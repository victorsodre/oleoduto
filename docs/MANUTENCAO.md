# Manutenção e validação

## Antes de cada entrega

- Conferir fonte/data das explicações e a distinção entre ilustração e medição.
- Validar assets, créditos e termos, incluindo autorização para servir arquivos extraíveis no navegador.
- Executar `npm test`, `npm run check` e `npm run build`; registrar os resultados. Instalação limpa: `npm ci --ignore-scripts`.
- Revisar diff, evitar segredos e incluir apenas mudanças da tarefa. Não adicionar diretórios de configuração pessoal, tokens ou snapshots de sessão.
- Testar URL de vídeo, acesso às fontes, carregamento, fallback e navegação por teclado.
- Conferir visualmente 1440×900, 390×844 e orientação horizontal; usar ao menos um navegador desktop e um celular real quando disponível. Registrar dispositivo e limitações.
- Exercitar selecionar → isolar → reenquadrar → cortar/desmontar → montar → reset. Câmera deve conservar o objeto visível.
- Testar mecanismo no início, meio, fim, pausa, retomada, reset e alternância de aba. Ausência de NaN e poses acumuladas é critério funcional.
- Comparar captura inicial, seleção, corte e desmontagem com o guia visual. Validar som desligado e movimento reduzido.

## Testes proporcionais

Unitários cobrem balanço, histórico, limites temporais, geometria e enquadramento. Integração para catálogo/nós do asset e retorno ao estado inicial. Fluxo de navegador para carregar, interagir e resetar. Não criar testes que apenas repitam o texto destes guias.

## Rotina após lançamento

- A cada mudança de modelo: revisar IDs, pivôs, nomes, enquadramento, memória e créditos.
- A cada mudança de dependência: repetir build e fluxos essenciais; comparar imagens antes/depois.
- A cada mudança factual: atualizar a fonte e textos, incluindo capturas/posts ainda não publicados.
- Em revisão periódica: conferir links, disponibilidade de vídeos e situação das fontes. Datas dinâmicas, especialmente Voyager, exigem reconsulta explícita.
- Registrar bug com dispositivo, navegador, ação, resultado esperado/observado e evidência sem dados pessoais.

## Publicação e reversão

A publicação foi autorizada por Victor em 08/11/2026. O procedimento vigente, os checks, a URL e a reversão estão em [PUBLICACAO.md](PUBLICACAO.md). Pushes em `main` passam a publicar pelo workflow após validação.

## Medição do piloto

Se a medição for implementada e autorizada, observar em 7 e 28 dias: visitas à experiência, primeira interação, uso da ação principal e cliques para o vídeo. Evitar coletar placas, imagens pessoais ou identificadores desnecessários. Views dos vídeos não medem uso do aplicativo.

Usar a combinação de qualidade, uso e custo de manutenção para ajustar o próximo projeto. Não prometer crescimento ou patrocínio com base no alcance histórico.

## Regressões específicas

- Automático ao fim: tanques 40/20/40; total 100.
- Automático até 50%, então gasolina até o fim: 90/10/0, sendo 50 fora do destino do exemplo.
- Trocar válvula sem avançar não modifica nenhum volume recebido.
- Voltar e reencaminhar altera apenas o futuro; reset apaga o histórico e zera os tanques.
- Validar cores, nomes e padrões sem depender apenas de cor; nunca representar uma divisória física na interface.
- Conferir corte e PNG em ambos os formatos. Servir `dist/` em `/oleoduto/`, recarregar e conferir fontes/licenças.

Evidência detalhada: [VALIDACAO.md](VALIDACAO.md). `output/` é local e ignorado pelo Git.
