# Validação — 07/11/2026

Ambiente: macOS, Node 26.7.0, npm 11.19.0, Chrome em sessão Playwright isolada. Desktop 1440×980, móvel 390×844 e horizontal 844×390. Viewport móvel, sem ensaio em telefone físico.

## Verificações aprovadas

- `npm ci --ignore-scripts`: instalação reproduzida, audit zero vulnerabilidades.
- `npm test`: nove testes, zero falhas. Conservação em 1.001 amostras, histórico, troca tardia, voltar/reencaminhar, pausa/ocultação, delta limitado, grupos reais, reset exato e enquadramento em três proporções.
- `npm run check` e `npm run build`: aprovados. Build final 448 ms. JS 805,26 KB / 216,43 KB gzip; CSS 19,88 KB / 5,07 KB gzip. Aviso de chunk >500 KB pelo Three, sem falha.
- 22 verificações de navegador: repouso, play/pause, etapas, troca sem deslocamento retroativo, 90/10/0 tardio, 40/20/40 automático, repetir, isolamento, desmontagem por teclado, busca sem acento, tour, fontes, ambos PNGs, móvel sem overflow, detalhe abaixo da cena, recebimento manual móvel, movimento reduzido, perda/recuperação WebGL e zero erros JS.
- 156 draw calls e aproximadamente 35.066 triângulos na vista inicial, incluindo passes de sombras; render para em repouso.
- PNGs reais com marca e título nos formatos 1920×1080 e 1080×1920. Vertical possui orientação própria e legenda A/I/B.
- Build estático em `/oleoduto/`: recarga, balanço 90/10/0, feedback de 50 unidades fora do destino de referência, licenças HTTP 200, um canvas, sem overflow horizontal ou erros JS.

## Evidência local

`output/playwright/fluxo-navegador.txt`, `producao-subpasta.txt`; capturas desktop-inicial, desktop-troca-tardia, desktop-isolamento, desktop-desmontado, mobile-completo, mobile-selecao, mobile-fallback, horizontal e exportacao-horizontal/vertical-final. Não versionar estado do navegador.

## Limites

Sem teste em telefone físico ou outros motores de navegador. Ocultação tem teste unitário e infraestrutura compartilhada já verificada por evento controlado no caminhão; não é confirmação da suspensão nativa neste ambiente automatizado.

Este é um balanço educativo por intervalos. Não calcula difusão, qualidade comercial, pressão, vazão ou segurança de instalações. O modo automático exemplifica segregação; a fonte contempla outras destinações conforme o caso. Nenhuma telemetria ao vivo.

Desenvolvimento concluído localmente. Sem deploy público, analytics ou postagem no X.

## Revisão para publicação — 08/11/2026

Testes automatizados do projeto, TypeScript/build e `check:pages` aprovados. O último verifica assets relativos em subpasta, canonical, prévia social, 404, sitemap e fallback sem JavaScript. O conjunto mantém 76 testes dos mecanismos.

Chrome real em janela dedicada: build servido sob a subpasta do projeto, canvas e catálogo carregados, seleção, ação principal quando presente no dock, diálogo da coleção com dez destinos corretos, indicação da página atual, fechamento por Escape, foco devolvido e seleção preservada. Viewports 1440×1000 e 390×844, sem transbordamento horizontal, erros de JavaScript ou respostas HTTP de erro durante o fluxo. Capturas reais em `output/publish-local-*.png` (ignoradas pelo Git).

A publicação usa o procedimento em [PUBLICACAO.md](PUBLICACAO.md). Verificação local não substitui conferir a URL após o deploy. Celular físico e Safari permanecem fora da amostra; o modelo mantém os limites educativos descritos acima.

## Embed do canal — 08/11/2026

Vídeo e autoria confirmados pelo oEmbed público do YouTube. Os 76 testes da coleção continuam aprovados; TypeScript/build e check de Pages aprovados em cada projeto. Capas originais de maior resolução servidas localmente, com mesmo ID do player e link do README.

Fluxo a conferir após cada publicação: abrir pelo cabeçalho, capa legível, zero requisições ao YouTube antes do clique, Enter no botão Carregar vídeo, iframe correto sem autoplay, controles nativos, foco e link direto. Viewports 1440×1000 e 390×844; largura/altura úteis do player de ao menos 200 px, descontando bordas. Limites: telefone físico/Safari fora da amostra e disponibilidade do vídeo depende do YouTube. Evidências desta rodada em `output/video-*`.

Nesta rodada, os dez players foram carregados no Chrome em estado pronto (`5` / cued), com o ID esperado e sem reprodução automática. Navegação pelo cabeçalho, clique/Enter, dimensões mínimas, thumbnail local e link direto aprovados; nenhuma requisição ao YouTube antes do clique ou erro JavaScript nos fluxos.
