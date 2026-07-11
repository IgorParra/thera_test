# thera_test — Ordens de Venda

Frontend Next.js (App Router) para gestão de ordens de venda: cadastros de clientes,
tipos de transporte e itens, criação e acompanhamento de ordens, agendamento de entregas
e auditoria. **Não há backend real** — todas as chamadas de API são interceptadas por
[MSW](https://mswjs.io/), com dados de exemplo gerados de forma determinística
(`@faker-js/faker` com seed fixa).

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

## Trade-offs assumidos

- **Sem persistência real.** Os fixtures do MSW são arrays em memória — criar/editar
  qualquer coisa dura até o próximo reload completo da página.
- **Sem autenticação/autorização.** Não existe login, sessão ou controle de permissão;
  a aplicação assume um único usuário implícito com acesso a tudo.
- **Sem testes end-to-end de navegador.** A suíte (Vitest + Testing Library) cobre lógica
  pura, validação dos handlers mockados e um fluxo de integração de UI; não há
  Playwright/Cypress rodando num navegador de verdade.
- **Sem atualização otimista.** As mutations sempre esperam a resposta (mockada) antes de
  invalidar o cache e atualizar a tela — mais simples, ao custo de um pequeno delay
  percebido que uma API real também teria.
- **Paginação só no cliente.** O `DataTable` (`src/components/shared/DataTable.tsx`)
  pagina os dados já carregados; não há paginação de fato na "API" mockada.

## Trocando o mock por uma API NestJS real

A única borda que fala com "o backend" hoje é `apiFetch` (`src/lib/http.ts`) — todos os
hooks de React Query em `src/features/*/api/index.ts` já são escritos contra o contrato
HTTP que os handlers do MSW definem (rotas, payloads, códigos de erro), então a troca é
transparente pra eles desde que a API real exponha o mesmo formato.

O que muda:
- `apiFetch` passa a apontar pra uma base URL real (hoje é sempre relativa, same-origin)
  e ganha os headers de autenticação necessários.
- Removidos: `src/mocks/**`, `src/mocks/MSWProvider.tsx`, a chamada em
  `src/instrumentation.ts`, e a dependência `msw` do `package.json`.

O que entraria, que hoje não existe:
- Autenticação de verdade (login, sessão/JWT, rotas protegidas) — a UI hoje não tem
  nenhuma noção de usuário autenticado.
- Paginação e filtros resolvidos no servidor em vez de client-side.
- Tratamento de falhas de rede (timeout, retry, offline) além do que `apiFetch` já faz
  hoje (só unwrap de erro HTTP pra mensagem amigável).
