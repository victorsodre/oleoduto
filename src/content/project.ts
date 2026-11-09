import type { Product, Seal } from '../simulation/flow.ts';

const sources = {
  martinoia: { title: 'Martinoia · PUC-Rio, 2016', detail: 'Dissertação "Impacto de operações transientes na mistura interfacial em polidutos". Bateladas sem separação física; turbulência reduz a dispersão; dados de campo de um poliduto de 8" e 67 km com cerca de 400 m de mistura; corte pela massa específica.', url: 'https://www.maxwell.vrac.puc-rio.br/27240/27240.PDF' },
  tepedino: { title: 'Tepedino et al. · Rio Pipeline, 2007', detail: '"Interfaces em oleodutos: otimizando o ponto de corte". Diferença de massa específica da ordem de 100 kg/m³ entre diesel e gasolina; válvulas mandam a mistura ao tanque de um produto, do outro ou de mistura.', url: 'http://escoamento-dutos.usuarios.rdc.puc-rio.br/ED-Tepedino_Interfaces_em_Oleodutos_RPC-2007.pdf' },
  ufu: { title: 'Kotchetkoff Neto · UFU, 2009', detail: 'Dissertação "Estudo de tratamento de interface proveniente de polidutos". OSBRA de Paulínia a Brasília; Portaria ANP 310/2001; 90 % das interfaces de volta à REPLAN de caminhão; criação do QINTER.', url: 'https://repositorio.ufu.br/handle/123456789/15143' },
  spolm: { title: 'Sousa e Ferreira Filho · SPOLM, 2010', detail: 'Sequência de bateladas do OSBRA com selo entre os produtos; o selo se mistura aos dois sem tirá-los de especificação.', url: 'https://assets.marinha.mil.br/spolm/sites/www.marinha.mil.br.spolm/files/73744.pdf' },
};

export const project = {
  number: '02', title: 'UM TUBO. DOIS COMBUSTÍVEIS.',
  intro: 'Acompanhe os lotes, veja o densímetro decidir a troca e escolha para onde vai a mistura.',
  video: 'https://www.youtube.com/watch?v=BM1JQSVafug',
  stages: [
    { name: 'Gasolina', description: 'O primeiro lote chega ao terminal. O densímetro lê a gasolina e a válvula abre o tanque A.' },
    { name: 'Interface', description: 'Sem parede entre os lotes, a fronteira vira uma faixa misturada. A leitura do densímetro sobe e, no meio, a válvula troca para o tanque B.' },
    { name: 'Diesel', description: 'O diesel é mais denso e a leitura chega ao topo. O mesmo duto transportou os dois em sequência.' },
    { name: 'Balanço', description: 'Tudo o que saiu do trecho aparece em algum tanque. Uma troca tardia mantém a mistura já recebida.' },
  ],
  /** Replaces the interface stage when a QINTER seal travels between the batches. */
  qinterStage: { name: 'Selo de QINTER', description: 'Entre os lotes passa um querosene intermediário. No meio dele, a válvula troca do tanque A para o tanque B.' },
  seals: {
    direct: { name: 'Contato direto', period: 'OSBRA até 2001', description: 'A gasolina encosta no diesel. A mistura é cortada no meio e cada metade vai para o tanque do produto vizinho.' },
    qinter: { name: 'Selo de QINTER', period: 'OSBRA a partir de 2001', description: 'Um lote de querosene intermediário vai entre os dois. Ele se dilui na gasolina e no diesel sem tirá-los da especificação, em proporções controladas.' },
  } satisfies Record<Seal, { name: string; period: string; description: string }>,
  facts: [
    { text: 'Não há parede: os lotes seguem em contato, um empurrando o outro.', source: 'Martinoia, 2016; Tepedino et al., 2007' },
    { text: 'O redemoinho ajuda. No escoamento turbulento, a fronteira se espalha menos do que num escoamento calmo, em que o centro do cano corre na frente.', source: 'Martinoia, 2016' },
    { text: 'Num poliduto brasileiro de 8 polegadas e 67 km, a mistura entre gasolina e diesel teve quase 400 m: menos de 1 % do duto. Aqui ela aparece ampliada.', source: 'Martinoia, 2016' },
    { text: 'Na chegada, um densímetro acompanha a massa específica. Diesel e gasolina diferem da ordem de 100 kg/m³; quando a leitura muda, as válvulas trocam o destino.', source: 'Martinoia, 2016; Tepedino et al., 2007' },
    { text: 'Em 2001, a Portaria ANP 310 subiu o ponto de fulgor mínimo do diesel para 38 °C. No OSBRA, 9 de cada 10 litros dessas misturas passaram a voltar de caminhão para a refinaria.', source: 'UFU, 2009' },
    { text: 'A saída foi o QINTER, posto entre o diesel e a gasolina. As fontes vão de 2001 a 2010; o uso atual não foi confirmado.', source: 'UFU, 2009; SPOLM, 2010' },
  ],
  sources: [
    sources.martinoia, sources.tepedino, sources.ufu, sources.spolm,
    { title: 'Transpetro · transporte em bateladas', detail: 'CGS Dutos Longos, rev. 05, abril/2013: definição 3.11 e itens 8.1–8.2. Interface, deslocamento e possibilidades de destinação.', url: 'https://transpetro.com.br/lumis/portal/file/fileDownload.jsp?fileId=4028908687346A610187648F1A943E26' },
    { title: 'O truque químico no duto · ovictorlab', detail: 'O vídeo que originou esta experiência.', url: 'https://www.youtube.com/watch?v=BM1JQSVafug' },
  ],
  disclosure: 'Modelo educativo autoral. A seção acompanhada tem 100 unidades ilustrativas: 40 de gasolina, 20 na região do meio e 40 de diesel, com a região do meio muito ampliada. Cores, volumes, velocidade, geometria e a curva do densímetro não são dados operacionais, e o ponto de corte no meio da mistura é ilustrativo. O tanque de mistura é uma das destinações possíveis; no OSBRA, a mistura era diluída nos tanques de produto.',
};

/** Name of each origin in the tracked section; the middle one depends on what travels between the batches. */
export const originName = (product: Product, seal: Seal) => product === 'gasoline' ? 'Gasolina' : product === 'diesel' ? 'Diesel' : seal === 'qinter' ? 'QINTER' : 'Interface';
export const tankNames: Record<Product, string> = { gasoline: 'Gasolina', interface: 'Mistura', diesel: 'Diesel' };
