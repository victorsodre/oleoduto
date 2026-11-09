import { CUT_POINT, sensorReading, type Seal } from '../simulation/flow.ts';

const describe = (reading: number | null) => reading === null ? 'selo de QINTER passando' : reading === 0 ? 'gasolina, mais leve' : reading === 1 ? 'diesel, mais denso' : 'mistura, leitura subindo';

/** One-line readout of the arrival sensor, shown next to the valve controls. */
export function DensityGauge({ progress, seal }: { progress: number; seal: Seal }) {
  const reading = sensorReading(progress, seal);
  return <div className="density-gauge">
    <span className="density-label">DENSÍMETRO</span>
    <span className={'density-track' + (reading === null ? ' density-track--seal' : '')} aria-hidden="true"><i style={{ left: `${(reading ?? .5) * 100}%` }}/></span>
    <output aria-live="off">{describe(reading)}</output>
  </div>;
}

const W = 320, H = 132, left = 58, right = 10, top = 14, bottom = 30;
const x = (units: number) => left + units / 100 * (W - left - right);
const y = (reading: number) => top + (1 - reading) * (H - top - bottom);

/** Density read at the terminal as the tracked section arrives. The curve is illustrative. */
export function DensityChart({ progress, seal }: { progress: number; seal: Seal }) {
  const samples = Array.from({ length: 101 }, (_, i) => [i, sensorReading(i / 100, seal)] as const);
  const path = samples.reduce((d, [units, r], i) => {
    if (r === null) return d;
    const gap = i > 0 && samples[i - 1][1] === null;
    return d + `${d === '' || gap ? 'M' : 'L'}${x(units).toFixed(1)} ${y(r).toFixed(1)}`;
  }, '');
  const now = sensorReading(progress, seal), at = progress * 100;
  return <svg className="density-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Leitura do densímetro ao longo das 100 unidades: ${seal === 'qinter' ? 'gasolina, selo de QINTER e diesel' : 'sobe da gasolina para o diesel na faixa misturada'}. Agora: ${describe(now)}.`}>
    <defs><pattern id="seal-hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#ef7d4224"/><line x1="0" y1="0" x2="0" y2="8" stroke="#ef7d42" strokeWidth="2"/></pattern></defs>
    <text x={left - 8} y={y(1) + 4} textAnchor="end">diesel</text>
    <text x={left - 8} y={y(0) + 4} textAnchor="end">gasolina</text>
    <line className="density-axis" x1={left} x2={W - right} y1={y(0) + 8} y2={y(0) + 8}/>
    {seal === 'qinter' && <><rect x={x(40)} y={top} width={x(60) - x(40)} height={H - top - bottom} fill="url(#seal-hatch)"/><text className="density-seal" x={(x(40) + x(60)) / 2} y={top + 14} textAnchor="middle">QINTER</text></>}
    <path className="density-line" d={path}/>
    <line className="density-cut" x1={x(CUT_POINT * 100)} x2={x(CUT_POINT * 100)} y1={top} y2={y(0) + 8}/>
    <text className="density-cut-label" x={x(CUT_POINT * 100) + 4} y={H - 8}>corte</text>
    <text x={left} y={H - 8}>0</text><text x={W - right} y={H - 8} textAnchor="end">100 un.</text>
    <line className="density-now" x1={x(at)} x2={x(at)} y1={top} y2={y(0) + 8}/>
    {now !== null && <circle className="density-dot" cx={x(at)} cy={y(now)} r="4.5"/>}
  </svg>;
}
