# Convenção de features

Cada domínio da aplicação vive em sua própria pasta dentro de `src/features/`, isolado dos demais. Isso mantém o código organizado por funcionalidade (feature-first) em vez de por tipo de arquivo, e evita acoplamento implícito entre domínios diferentes.

Cada feature segue a mesma estrutura interna:

```
features/<nome-da-feature>/
  api/         # chamadas HTTP, query keys e hooks do React Query específicos da feature
  components/  # componentes React usados apenas por essa feature
  hooks/       # hooks de UI/estado específicos da feature (não ligados a fetching)
  types/       # tipos e schemas (ex.: Zod) específicos da feature
```

## Regras

- Uma feature **não deve** importar diretamente de dentro de outra feature. Se algo precisa ser compartilhado, ele deve subir para `src/components/shared`, `src/lib` ou virar seu próprio pacote/feature.
- Componentes genéricos de UI (botões, inputs, etc.) ficam em `src/components/ui` (shadcn/ui).
- O shell da aplicação (layout, navegação, header) fica em `src/components/layout`.
- Estado global de UI (ex.: filtros persistentes, estado de modais complexos) fica no Redux store em `src/lib/store`. Dados vindos da API são responsabilidade do React Query, não do Redux.

## Features atuais

- `orders` — ordens de venda
- `clients` — clientes
- `transport-types` — tipos de transporte
- `items` — itens/produtos
- `scheduling` — agendamento
- `audit` — auditoria/histórico
