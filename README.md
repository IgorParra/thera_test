# thera_test — Ordens de Venda

Frontend Next.js (App Router) para gestão de ordens de venda: cadastros de clientes,
tipos de transporte e itens, criação e acompanhamento de ordens, agendamento de entregas
e auditoria. **Não há backend real** — todas as chamadas de API são interceptadas por
[MSW](https://mswjs.io/), com dados de exemplo gerados de forma determinística
(`@faker-js/faker` com seed fixa).

> **Escopo desta entrega**: cobre o perfil **Front-end** do desafio (Sistema de Gestão de
> Ordens de Venda). A spec permite explicitamente "a utilização de APIs simuladas
> (mockadas)" para esse perfil — por isso não há serviço NestJS, banco de dados,
> ORM (Prisma/TypeORM/Sequelize) nem `docker-compose.yml` neste repositório; esses itens
> são requisito dos perfis Back-end/Full Stack, não deste.

## Como rodar

```bash
npm install
npm run dev       # http://localhost:3000
```

Não é preciso subir nenhum serviço além do próprio `next dev` — o MSW intercepta as
requisições tanto no navegador (Service Worker registrado via `src/mocks/MSWProvider.tsx`,
arquivo gerado em `public/mockServiceWorker.js`) quanto durante SSR (`src/instrumentation.ts`
sobe o mesmo conjunto de handlers via `msw/node`). Os dados vivem em memória
(`src/mocks/fixtures/*.ts`) e resetam a cada reload da página/reinício do servidor.

Outros scripts:

```bash
npm test            # Vitest (testes unitários + um teste de integração)
npm run lint         # ESLint
npx tsc --noEmit     # checagem de tipos
npm run build        # build de produção
```

## Tecnologias utilizadas

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **TanStack React Query** — estado de servidor (cache, invalidação, hidratação SSR)
- **Redux Toolkit** — estado de UI (filtros, wizard)
- **MSW** — mock de API (Service Worker no navegador + `msw/node` no SSR)
- **shadcn** (variante `base-nova`) + **@base-ui/react** — primitivas de UI
- **Tailwind CSS** — estilos
- **react-hook-form + zod** — formulários e validação (Cadastros e wizard de ordens)
- **TanStack Table** — `DataTable`
- **react-day-picker** — `Calendar` (agendamento, filtro por período)
- **Vitest + Testing Library** — testes
- **@faker-js/faker** — dados mockados determinísticos

## Decisões de arquitetura

- **Organização por feature** (inspirada em [Bulletproof
  React](https://github.com/alan2207/bulletproof-react)):
  `src/features/<domínio>/{api,components,hooks,lib,types}` para cada domínio (orders,
  clients, transport-types, items, audit). Código compartilhado entre features fica em
  `src/components/shared`, `src/components/ui` (primitivas shadcn/base-ui) e `src/lib`.
- **MSW como mock de API completo**, não só stubs pontuais: os handlers em
  `src/mocks/handlers/*.ts` implementam validação, relacionamentos entre entidades
  (ex. tipos de transporte autorizados por cliente) e side effects (todo evento de
  mutação em uma ordem gera um `AuditEvent` — ver `src/mocks/fixtures/audit.ts`). Isso faz
  os handlers funcionarem como a própria "especificação" de contrato da API enquanto não
  existe um backend de verdade.
- **shadcn (variante `base-nova`, primitivas `@base-ui/react`)** para os componentes de
  UI, não Radix — algumas peças do registro (como `form`) não existem nessa variante, por
  isso os formulários são montados com `react-hook-form` + `zod` direto sobre
  `input`/`select`/`label`, sem o wrapper `Form`/`FormField`.

## Estratégia de modelagem do domínio

- `SalesOrder.clientId`/`transportTypeId` são strings singulares, não arrays — reflete
  literalmente as regras "vinculada a um único cliente" / "exatamente um tipo de
  transporte", sem precisar de validação extra pra impedir múltiplos.
- `authorizedTransportTypeIds` mora no **Cliente** (`src/features/clients/types`), não no
  Tipo de Transporte — a autorização é uma regra por cliente ("cada cliente poderá possuir
  uma lista..."), então o Tipo de Transporte fica simples e reutilizável, e cada cliente
  tem seu próprio subconjunto autorizado.
- `SalesOrderStatus` é uma union de 5 literais (`CREATED..DELIVERED`) mais uma máquina de
  estado estritamente linear (`src/features/orders/lib/status-machine.ts` —
  `getValidNextStatuses` sempre retorna 0 ou 1 status) — de propósito mais simples que um
  grafo genérico de transições, porque o fluxo da spec não tem ramificação nem
  cancelamento.
- `Scheduling` é um objeto opcional embutido na própria ordem, não uma entidade separada
  com histórico — uma ordem tem no máximo um agendamento *ativo* por vez; reagendar
  sobrescreve, não cria um novo registro.
- `SalesOrderItem` (`{itemId, quantity}`) vive embutido no array da ordem, sem id próprio —
  itens de uma ordem nunca são consultados fora do contexto dela.
- `AuditEvent` usa um envelope genérico (`entityType`/`entityId` como `string`,
  `previousState`/`nextState` como `Record<string,unknown>` soltos) em vez de uma union
  tipada por entidade — de propósito, pra qualquer entidade futura poder emitir eventos
  sem migração de schema; o custo é perder segurança de tipo no diff, compensado por um
  helper (`describeAuditEvent`, `src/features/audit/lib/labels.ts`) que interpreta cada
  `action` na hora de renderizar.
- Dos 4 eventos mínimos de auditoria pedidos pela spec (criação, status, agendamento,
  transporte), só 3 ocorrem na prática: **não existe "alteração de transporte"** porque
  não há endpoint que edite o `transportTypeId` de uma ordem já criada — o transporte é
  definido uma vez, na criação (`POST /api/orders`), e nunca mais muda. Não é uma lacuna
  de implementação; é a ausência da própria mutação que geraria esse evento. Se essa
  funcionalidade (reatribuir transporte pós-criação) for adicionada no futuro, o handler
  correspondente só precisa seguir o mesmo padrão dos demais: mutar o campo e chamar
  `addAuditEvent` com `previousState`/`nextState` do `transportTypeId`.
- Itens são identificados pelo SKU como chave de negócio (unicidade validada na criação,
  `src/mocks/handlers/items.ts`), não só pelo id interno — reflete a regra de
  "identificador único (SKU)".

## Estratégia de persistência

Sem banco: os fixtures (`src/mocks/fixtures/*.ts`) são arrays em memória + funções de
acesso (`listX`/`getXById`/`createX`/`updateX`) que fazem o papel de um repositório fake.
Seed determinística (`faker.seed(N)` por módulo) garante que os mesmos dados apareçam a
cada reload/execução — útil pra demo e pra os testes, que dependem de ids/relações
previsíveis. Os handlers MSW ficam na frente desses fixtures como uma camada HTTP fake,
replicando a validação que uma API real faria (400/404/422) — é o que permite a troca por
um backend real ser só uma troca de "onde" as requisições batem (ver seção abaixo), não
uma reescrita do consumidor.

Ressalva honesta: existem tecnicamente **duas** cópias do estado em memória — uma no
Service Worker do navegador (`src/mocks/MSWProvider.tsx`), outra no processo Node do SSR
(`src/instrumentation.ts`) — que não são sincronizadas entre si. Isso normalmente não é
perceptível (a maior parte da navegação é client-side depois do primeiro load), mas é uma
particularidade real do approach. Desde a Fase 8, os Server Components de cada página
(`src/app/**/page.tsx`) leem os fixtures **diretamente** (não fazem HTTP self-fetch) pra
popular o cache do React Query no SSR — então o lado servidor nem chega a depender do
Service Worker; só as mutations feitas pelo usuário no navegador passam pela cópia
client-side.

## Redux (estado de UI) vs React Query (estado de servidor)

As duas ferramentas coexistem de propósito, cada uma dona de um tipo de estado diferente:

- **React Query** é dono de qualquer dado que "vem do backend": ordens, clientes, tipos
  de transporte, itens, auditoria. Cada feature expõe seus hooks em
  `src/features/<domínio>/api/index.ts`, com uma factory de query keys
  (`orderKeys`, `clientKeys`, etc.) que já resolve cache, invalidação após mutations e
  estados de loading/error — sem precisar reimplementar nada disso manualmente.
- **Redux** (`src/lib/redux/`) só guarda estado de UI que não tem relação nenhuma com o
  servidor e não faria sentido morar num cache de query: a seleção de filtros da listagem
  de ordens (`ordersFilterSlice`) e o progresso do wizard de criação de ordem
  (`orderWizardSlice`, com o passo atual e os dados preenchidos até então). Nenhum dos
  dois é "dado buscado de algum lugar" — é estado efêmero de interação, e colocar isso no
  React Query criaria uma segunda fonte de verdade (e a necessidade de sincronizar as
  duas) sem nenhum benefício.

Na prática: se a informação sobrevive a um F5 vindo de algum lugar (uma API), é React
Query; se é só "o que o usuário está fazendo agora nesta tela", é Redux.

## Considerações sobre escalabilidade

- Hoje toda listagem (`useOrdersList`, `useClientsList`, etc.) busca a coleção inteira e
  filtra/pagina no cliente (`DataTable`) — sustentável no volume do mock (dezenas de
  registros), não escalaria pra uma base real com milhares de linhas.
- O formato dos filtros (`OrdersListFilters`, `src/features/orders/api/index.ts`) já é
  compatível com filtragem server-side (são só query params) — migrar pra paginação real
  seria adicionar `page`/`pageSize` na query e parar de fatiar no cliente, não redesenhar a
  UI.
- A factory de query keys (`orderKeys.list(filters)`, etc.) já cacheia por combinação de
  filtro — é exatamente o que se precisa pra um dataset paginado/filtrado no servidor, não
  muda com a escala.
- Não há nenhuma modelagem de concorrência (dois usuários editando a mesma ordem ao mesmo
  tempo, por exemplo) — o mock assume um único usuário implícito; uma base real precisaria
  de alguma estratégia de lock otimista/versão de registro.

## Considerações sobre performance

- `staleTime: 30s` no `QueryClient` (`src/lib/query-client.ts`) evita refetch redundante
  num backend que só muda pelas próprias mutations do app.
- `useClientDetail`/`useItemDetail` reaproveitam a query de lista via `select` em vez de
  disparar uma requisição por id — evita N+1 ao montar os mapas de nome usados nas
  tabelas (`clientNameById`, etc., repetido em várias páginas).
- Mutations invalidam chaves específicas (`orderKeys.detail(id)`, não a lista inteira sem
  necessidade) — minimiza refetch desnecessário após escrita.
- Paginação do `DataTable` mantém o DOM pequeno mesmo já com todos os dados em memória —
  funciona bem no volume atual, precisaria de virtualização real se a base crescesse pra
  milhares de linhas.
- **Todas as páginas fazem prefetch server-side** (Fase 8): cada `src/app/**/page.tsx` é
  um Server Component que popula o cache do React Query antes de renderizar, hidratado via
  `HydrationBoundary` no componente `*PageClient` correspondente — o HTML inicial já chega
  com dado real, sem esperar um fetch client-side pós-hidratação. Isso não era garantido
  desde o início: a primeira tentativa (self-fetch via `apiFetch` a partir do Server
  Component) esbarrou numa interação real entre o patch de `fetch` do próprio Next.js App
  Router e o interceptador Node do MSW, que fez a chamada vazar como requisição real em vez
  de ser mockada — resolvido lendo os fixtures diretamente no servidor (ver "Estratégia de
  persistência" acima).
- Code-splitting é o padrão automático por rota do App Router, sem nenhum ajuste manual
  feito — não foi um ponto trabalhado ativamente.

## Trade-offs assumidos

- **Sem persistência real.** Os fixtures do MSW são arrays em memória — criar/editar
  qualquer coisa dura até o próximo reload completo da página.
- **Sem autenticação/autorização.** Não existe login, sessão ou controle de permissão;
  a aplicação assume um único usuário implícito com acesso a tudo. Isso é uma escolha
  consciente, não um esquecimento: a spec do desafio lista "estratégias de segurança e
  autorização" como **diferencial** (opcional), não como requisito da Gestão de Ordens de
  Venda, do Monitoramento, da Central de Agendamento ou dos Cadastros — e o próprio
  documento reforça que "não é esperado que todos os diferenciais sejam implementados".
  Priorizei tempo/escopo nas funcionalidades centrais (regras de negócio, fluxo de status,
  agendamento, auditoria, testes) em vez de auth, dado esse enquadramento.
  **Possível aprimoramento futuro**: com uma API real por trás (ver seção de migração
  pra NestJS), o caminho natural seria autenticação via [Auth.js](https://authjs.dev/)
  (NextAuth) ou um JWT emitido pelo backend guardado em cookie httpOnly, um
  `middleware.ts` do Next protegendo as rotas de `src/app/**`, e um papel/permissão simples
  associado ao usuário (ex. só quem tem papel de "logística" pode transicionar status ou
  confirmar agendamento) — reaproveitando a própria estrutura de mutations já existente
  em `src/features/*/api/index.ts` como ponto único onde anexar o header de autorização.
- **Sem testes end-to-end de navegador.** A suíte (Vitest + Testing Library) cobre lógica
  pura, validação dos handlers mockados e um fluxo de integração de UI; não há
  Playwright/Cypress rodando num navegador de verdade.
- **Sem atualização otimista.** As mutations sempre esperam a resposta (mockada) antes de
  invalidar o cache e atualizar a tela — mais simples, ao custo de um pequeno delay
  percebido que uma API real também teria.
- **Paginação só no cliente.** O `DataTable` (`src/components/shared/DataTable.tsx`)
  pagina os dados já carregados; não há paginação de fato na "API" mockada.

## Trocando o mock por uma API NestJS real

No lado do cliente, a única borda que fala com "o backend" é `apiFetch`
(`src/lib/http.ts`) — todos os hooks de React Query em `src/features/*/api/index.ts` já
são escritos contra o contrato HTTP que os handlers do MSW definem (rotas, payloads,
códigos de erro), então a troca é transparente pra eles desde que a API real exponha o
mesmo formato.

O que muda:
- `apiFetch` passa a apontar pra uma base URL real (hoje é sempre relativa, same-origin)
  e ganha os headers de autenticação necessários.
- **Os blocos de prefetch server-side precisam ser reescritos.** Desde a Fase 8, o
  Server Component de cada página (`src/app/**/page.tsx`) lê os fixtures do mock
  *diretamente* (`src/mocks/fixtures/*.ts`) pra popular o cache antes de renderizar — isso
  foi uma escolha deliberada (ver "Estratégia de persistência") porque o self-fetch via
  `apiFetch` não conseguia passar pelo interceptador do MSW de forma confiável no SSR.
  Com uma API real, esses blocos passam a fazer um fetch server-side de verdade (por
  exemplo, reaproveitando o próprio `apiFetch` com a base URL real) em vez de importar os
  fixtures — é a única parte da aplicação que hoje está acoplada à existência do mock.
- Removidos: `src/mocks/**`, `src/mocks/MSWProvider.tsx`, a chamada em
  `src/instrumentation.ts`, e a dependência `msw` do `package.json`.

O que entraria, que hoje não existe:
- Autenticação de verdade (login, sessão/JWT, rotas protegidas) — a UI hoje não tem
  nenhuma noção de usuário autenticado.
- Paginação e filtros resolvidos no servidor em vez de client-side.
- Tratamento de falhas de rede (timeout, retry, offline) além do que `apiFetch` já faz
  hoje (só unwrap de erro HTTP pra mensagem amigável).
