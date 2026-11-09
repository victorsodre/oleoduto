# Assets e fontes — Oleoduto: combustíveis no mesmo tubo

**Estado atual:** modelo procedural e padrões autorais, com tipografia licenciada. Referência factual abaixo, sem dados operacionais reais.

## Conteúdo que originou a proposta

- [Combustíveis no mesmo tubo — Instagram](https://www.instagram.com/reel/Dem0z-nCbFI/)
- [Combustíveis no mesmo tubo — YouTube](https://www.youtube.com/watch?v=BM1JQSVafug)

O Reel do tema registrou 37.151 visualizações, 137 salvamentos e 557 compartilhamentos no Instagram.

Leitura em 07/11/2026. A análise consultou as APIs oficiais do Instagram/YouTube e relatórios existentes do canal. Vídeos do próprio canal orientam a pauta; fatos científicos/operacionais precisam retornar a fontes primárias antes de serem usados no modelo.

## Fonte primária consultada em 07/11/2026

[Transpetro — Condições Gerais de Serviço, Transporte Dutoviário: Dutos Longos, revisão 05, abril/2013](https://transpetro.com.br/lumis/portal/file/fileDownload.jsp?fileId=4028908687346A610187648F1A943E26).

- Item 3.11, página 5: interface é mistura resultante de produtos em sequência.
- Item 8.1, página 10: o produto seguinte desloca o anterior; interfaces dependem da operação e sequência.
- Item 8.2, páginas 10–11: possibilidades de compartilhamento, direcionamento e segregação. Desde 09/11/2026 o automático dilui a mistura nos tanques de produto, como no OSBRA; a segregação fica como escolha manual.

## Fontes do truque do vídeo (pesquisa do EP284, consultada em 17/10/2026)

- Martinoia, PUC-Rio, 2016: bateladas sem separação física; turbulência reduz a dispersão; ~400 m de mistura em poliduto de 8" e 67 km (duto não identificado); corte pela massa específica.
- Tepedino et al., Rio Pipeline 2007: diferença da ordem de 100 kg/m³ entre diesel e gasolina; destinos possíveis da mistura.
- Kotchetkoff Neto, UFU, 2009: OSBRA, Portaria ANP 310/2001, 90 % das interfaces de volta de caminhão, QINTER.
- Sousa e Ferreira Filho, SPOLM, 2010: selo entre os produtos, misturável aos dois sem tirá-los de especificação.

Limites: uso atual do QINTER não confirmado; curva do densímetro e ponto de corte são ilustrativos.

Consulta factual; não copiamos diagramas ou tabelas nem redistribuímos o PDF. A experiência não apresenta esses termos históricos como norma operacional vigente. Não usa volumes, pressões ou vazões reais.

## Assets incorporados

| Asset | Origem e termos |
|---|---|
| Geometria do terminal, texturas e padrões | Código procedural autoral em `pipeline.ts`, sem modelo externo |
| Marca | SVG oficial de ovictorlab.com, copiado da implementação autoral do caminhão |
| Tipografia local | Fontsource 5.3.0: Anton, Archivo, Archivo Black, JetBrains Mono; SIL OFL, textos em `public/licenses/` |
| Bibliotecas | React/Three/Vite/Lucide e ferramentas fixadas no lockfile, avisos em `public/licenses/bibliotecas.txt` |

Sem asset comprado, áudio externo, código ou modelo do Fusquinha. As faixas nos tanques explicam a composição por origem, não a separação física dos líquidos depois de recebidos.
