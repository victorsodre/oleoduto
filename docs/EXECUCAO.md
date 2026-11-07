# Lista de execução — Oleoduto: combustíveis no mesmo tubo

Desenvolvimento **1–6 concluído e validado localmente**; evidências em [VALIDACAO.md](VALIDACAO.md). Divulgação e medição são etapas posteriores. Prioridade da coleção: 2/10.

## 1. Apuração e decisão de escopo

- [x] Desenhar o diagrama do trecho e validar o tratamento da interface antes de escrever o controlador.
- [x] Resolver as pesquisas listadas em ASSETS-E-FONTES.md e registrar fonte, data, afirmação e limite.
- [x] Fechar a pergunta, os grupos e as três ações de ESCOPO.md.

**Pronto quando:** uma página de esquema permite revisar o funcionamento e suas simplificações antes de modelar.

## 2. Modelo e contrato de peças

- [x] Geometria procedural de tubos, conexões, válvulas e reservatórios; lotes definidos por intervalos ao longo de uma curva. Começar sem dinâmica de fluidos.
- [x] Conferir licença de entrega web, escala, orientação, pivôs, materiais, nomes e créditos.
- [x] Criar catálogo estável; registrar pose inicial e grupos selecionáveis.

**Pronto quando:** o objeto pode ser inspecionado e cada conjunto tem origem e função documentadas. Se o asset não servir, reduzir escopo ou modelar; não improvisar interior como se fosse fiel.

## 3. Primeiro mecanismo funcional

- [x] Implementar o estado descrito em ESCOPO.md com geometria simples.
- [x] Demonstrar início, meio, fim, pausa, retomada e reset.
- [x] Validar os critérios específicos e registrar as hipóteses do modelo.

**Pronto quando:** uma captura real mostra a resposta à pergunta sem depender de acabamento visual.

## 4. Exploração e identidade

- [x] Aplicar o guia visual, logo oficial e layout responsivo.
- [x] Implementar seleção por lista/clique, isolamento, reenquadramento e modos pertinentes.
- [x] Adicionar explicações curtas, fontes e ligação com os vídeos.

**Pronto quando:** o visitante encontra o primeiro controle, entende a seleção e retorna à cena inicial em desktop e celular.

## 5. Acabamento e desempenho

- [x] Conferir enquadramento, materiais, luz, sombras e contraste em capturas reais.
- [x] Implementar áudio opcional e movimento reduzido, quando houver animação/som.
- [x] Medir orçamento de assets e renderização; tratar falhas de rede/WebGL.

**Pronto quando:** os fluxos de MANUTENCAO.md passam no dispositivo de referência, com medidas e limitações registradas.

## 6. Entrega revisável

- [x] Registrar comandos reais de setup/check/build no README após implementar o código.
- [x] Revisar diff, créditos, texto factual e estados dos controles.
- [x] Preparar prévia e instruções de reversão; documentar a URL somente quando existir.

**Pronto quando:** outra pessoa consegue reproduzir a versão e verificar o resultado. Deploy depende de autorização no pedido vigente.

## 7. Divulgação e aprendizado

- [ ] Capturar demonstração verdadeira, sem prometer recursos ausentes.
- [ ] Revisar POSTAGENS-X.md e substituir informações de lançamento pela versão real.
- [ ] Publicar apenas quando Victor decidir; registrar permalink depois do envio.
- [ ] Se houver medição, revisar uso em 7/28 dias e decidir o próximo incremento.

**Estimativa:** Médio: modelagem procedural simples; maior atenção às regras do fluxo. Não fixar dias de entrega antes das etapas 1 e 2.
