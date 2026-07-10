# Fixtures mockadas

Cada arquivo neste diretório é um módulo singleton: mantém um array em memória
(não exportado diretamente) e expõe funções `listX`/`getXById`/`createX`/`updateX`
que os handlers MSW usam para ler e mutar o estado.

## Por que `@faker-js/faker`

Optou-se por `@faker-js/faker` (em vez de dados 100% escritos à mão) para gerar
nomes de clientes, produtos e datas com variedade suficiente para exercitar
filtros, busca textual e paginação sem esforço manual de escrever dezenas de
registros plausíveis. Cada gerador chama `faker.seed(<n>)` com uma seed fixa
própria antes de gerar seus dados, então a saída é determinística — os mesmos
dados aparecem a cada reload do dev server, no CI, e independente da ordem em
que os módulos são importados (cada arquivo reseta o RNG para sua própria seed
antes de usar).

Tipos de transporte são a exceção: são apenas 3 valores fixos de negócio
(Caminhão, Carreta, Bi-truck), então foram escritos diretamente.

## Consistência entre entidades

`orders.ts` é gerado por último e depende de `clients.ts` e `items.ts`: para
cada ordem, o `transportTypeId` é sorteado a partir de
`client.authorizedTransportTypeIds` do cliente escolhido, garantindo que toda
ordem referencie um transporte autorizado para aquele cliente.
