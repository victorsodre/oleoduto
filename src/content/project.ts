export const project = {
  number: '02', title: 'UM TUBO. DOIS COMBUSTÍVEIS.',
  intro: 'Acompanhe os lotes, encontre a mistura e escolha para onde ela vai.',
  video: 'https://www.youtube.com/watch?v=BM1JQSVafug',
  stages: [
    { name: 'Gasolina', description: 'O primeiro lote chega ao terminal. A válvula direciona o líquido ao tanque escolhido.' },
    { name: 'Interface', description: 'Entre os lotes existe uma região misturada. Neste exemplo, ela recebe um tanque separado.' },
    { name: 'Diesel', description: 'Depois da interface, chega o segundo lote. O mesmo duto transportou os dois em sequência.' },
    { name: 'Balanço', description: 'Tudo o que saiu do trecho aparece em algum tanque. Uma troca tardia mantém a mistura já recebida.' },
  ],
  sources: [
    { title: 'Transpetro · transporte em bateladas', detail: 'CGS Dutos Longos, rev. 05, abril/2013: definição 3.11 e itens 8.1–8.2. Interface, deslocamento e possibilidades de destinação.', url: 'https://transpetro.com.br/lumis/portal/file/fileDownload.jsp?fileId=4028908687346A610187648F1A943E26' },
    { title: 'Combustíveis no mesmo tubo · ovictorlab', detail: 'O vídeo que originou esta experiência.', url: 'https://www.youtube.com/watch?v=BM1JQSVafug' },
  ],
  disclosure: 'Modelo educativo autoral. A seção acompanhada tem 100 unidades ilustrativas: 40 de gasolina, 20 de interface e 40 de diesel. Cores, volumes, velocidade e geometria não são dados operacionais. Segregar a interface é uma possibilidade; sua destinação real depende da operação.',
};
export const productNames = { gasoline: 'Gasolina', interface: 'Interface', diesel: 'Diesel' };
