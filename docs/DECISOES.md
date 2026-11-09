# Decisões e estado

## 2026-11-07 — documentação inicial

- Victor solicitou salvar o plano no VicMind, criar uma pasta para cada projeto, preparar guias de desenvolvimento/identidade, enviar ao GitHub e escrever posts do X para uso posterior.
- Planejamento detalhado criado; prioridade recomendada **2/10**. A prioridade pode mudar após o piloto e a validação de assets.
- Identidade: ovictorlab.com / Laboratório noturno. Interações: referência Fusquinha, adaptadas à pergunta do projeto.
- Repositório inicialmente privado por escolha operacional conservadora nesta fase. O pedido autoriza o envio dos guias; não foi tratado como solicitação de implementar e publicar os aplicativos.
- Nenhuma postagem no X enviada. Textos de protótipo e lançamento têm condições explícitas de uso.

## Pendências iniciais — resolvidas na implementação

- Documentação de operador de dutos sobre transporte em bateladas e destinação da interface.
- Verificar os limites do exemplo escolhido e a relação entre fluxo, válvula e recebimento.

Próxima ação: Desenhar o diagrama do trecho e validar o tratamento da interface antes de escrever o controlador.

## Como registrar mudanças

Acrescentar data, decisão, motivo, fonte/evidência, arquivos afetados e consequência para o escopo. Separar proposta, implementação, validação e publicação. Preservar decisões antigas com indicação de substituição quando necessário.

## 2026-11-07 — aplicação implementada

Victor definiu a meta de desenvolver os dez projetos. Implementação autorizada, com publicação web e posts ainda separados.

Modelo procedural independente, baseado nos conceitos da Transpetro; seção de 100 unidades ilustrativas, com interface segregada no cenário automático. Histórico de válvula e matriz de recebimento garantem conservação de volume e evitam mover retroativamente o líquido. Faixas são indicadores de origem; não pretendem representar estratificação.

Base visual e renderização reaproveitadas do projeto autoral do caminhão, sem pacote compartilhado prematuro. Cena e mecanismo próprios. Sem áudio por não acrescentar explicação a este escopo. Nove testes e 22 verificações no Chrome aprovados, build em subpasta conferido; limites em VALIDACAO.md. Nenhum deploy ou post enviado.

## 2026-11-08 — repositório público e GitHub Pages

Victor autorizou aprimorar e tornar públicos os dez projetos com HTML funcional e identidade oficial. Esta decisão substitui a restrição histórica de publicação acima. Incluídos navegação entre os dez sites, canonical/OG/X, prévia real, sitemap, página 404, verificação de caminhos e workflow com testes/build antes do deploy. URL: https://victorsodre.github.io/oleoduto/. Conteúdo e modelo educativo preservados; nenhum post enviado ao X. Procedimento e reversão em PUBLICACAO.md.

## 2026-11-08 — vídeo do canal incorporado

Pedido de Victor: embed abaixo do experimento e thumbnail clicável no README. Vídeo `BM1JQSVafug`, autoria ovictorlab confirmada pelo oEmbed público. Veja como os combustíveis seguem pelo mesmo duto. Depois, volte ao experimento para acompanhar os lotes e escolher os destinos. Player `youtube-nocookie.com`, criado só por clique, `autoplay=0`, controles nativos, referrer de origem e link direto sempre disponível. Capa local para não carregar o YouTube na abertura; layout portrait. Cabeçalho leva à seção `#video`. Identidade preservada; nenhum upload ou alteração de vídeo no canal.

## 2026-11-09 — revisão: metadados, truque do vídeo e celular

Pedido de Victor ("faça tudo") a partir da revisão dos dez labs.

- Metadados: description, OG, Twitter e noscript vinham do caminhão de lixo; reescritos para o oleoduto, noscript aponta para `BM1JQSVafug`. Título com a busca ("Como gasolina e diesel viajam no mesmo cano?"), resumo indexável dentro de `#root` e JSON-LD `VideoObject`. `check-pages.mjs` passou a conferir JSON-LD, resumo e termos do título.
- Automático: substitui a segregação em tanque de interface. Motivo: contradizia o vídeo e a pesquisa do EP284 (no OSBRA, a mistura era diluída nos tanques de produto, UFU 2009). Agora o densímetro troca a válvula no meio da mistura (corte ilustrativo). O tanque I virou "Mistura", destinação possível segundo Tepedino et al. (2007), só por escolha manual.
- Truque do vídeo: densímetro 3D e na interface, seletor contato direto/selo de QINTER, curva ilustrativa e seis fatos com fonte (Martinoia 2016, Tepedino 2007, UFU 2009, SPOLM 2010). QINTER contado como história de 2001 a 2010; uso atual não confirmado. A densidade do QINTER não é desenhada por falta de fonte. Seletor laminar/turbulento ficou de fora: virou texto com fonte.
- Cor: a região misturada usa o degradê gasolina→diesel com trama em todo lugar (3D, balanço, PNG); laranja passa a ser o QINTER.
- Celular e câmera: texto ≥ 11 px e alvos ≥ 44 px no celular (exceto o vídeo e a navegação, que vêm do lab-kit), descrição da etapa visível, barra de câmera em linha abaixo da cena, canvas com `touch-action: pan-y`, enquadramento pelas caixas de cada peça, órbita preservada em resize/tela cheia/isolamento, toque distinguido de arrasto.
- Etiquetas 3D (09/11/2026): sprites de tamanho fixo na tela, com letra só nos tanques em telas estreitas.
- Bugs: meia-cana com material próprio (não altera aço e marfim compartilhados), etiquetas 3D redesenhadas quando a Archivo carrega, destinos desativados com o envio concluído, sombra 1024 no celular, código morto removido de `geometry.ts`.
