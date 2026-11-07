# Escopo — Oleoduto: combustíveis no mesmo tubo

## Pergunta e resultado esperado

Como gasolina e diesel passam pelo mesmo tubo? O visitante deve conseguir explicar o mecanismo depois de explorar a cena e acionar seus controles.

Um trecho de duto com dois lotes, uma região de interface e um terminal de recebimento. A visualização explica o processo sem se apresentar como simulador operacional.

## Conjuntos da primeira versão

- Trecho de entrada
- Duto em corte
- Lote A
- Lote B
- Região de interface
- Válvulas e destinos

Esses grupos são uma proposta semântica; validar sua correspondência com a geometria e as fontes antes de nomear peças como reais.

## Ações principais

| Controle | Comportamento planejado |
|---|---|
| Enviar lotes | Inicia a sequência de volumes identificados por cor e padrão. |
| Avançar fluxo | Controla a posição ao longo do trecho, com pausa. |
| Trocar destino | Permite comparar recebimento correto e mistura, conforme regra documentada. |

Base de exploração: órbita, zoom, seleção por lista ou clique, isolamento, reenquadrar e reset. Desmontagem e corte só se aplicam aos conjuntos para os quais forem úteis e tecnicamente coerentes. Som, malha e captura são complementos, posteriores à clareza do mecanismo.

## Estado do mecanismo

`idle → batchA → interface → batchB → complete; reset zera volumes recebidos e reposiciona todos os lotes.`

## Critérios específicos de conclusão

- Os volumes ilustrados não surgem ou desaparecem ao trocar de destino.
- A interface é uma região identificada; não representar uma parede sólida entre líquidos.
- Cores diferentes também têm nomes e padrões; seleção não depende da percepção de cor.

- A pergunta inicial é respondida por uma interação observável, com texto curto e fontes acessíveis.
- O modelo funciona no desktop e no celular de referência, com reset e fallback conferidos.
- Nenhum botão visível é apenas decorativo ou promete função pendente.

## Fora da primeira versão

- CFD, telemetria industrial real e previsão de contaminação.
- Pressões, velocidades ou volumes apresentados como dados de operação sem referência.

Ampliações entram no backlog após o piloto, com evidência de uso e esforço. Não incluir funcionalidades só para repetir todas as opções do Fusquinha.
