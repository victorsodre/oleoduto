import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Box, ChevronRight, Download, Eye, Focus, Layers3, Maximize, Minus, Pause, Play, Plus, RotateCcw, Search, X } from 'lucide-react';
import { Brand } from './ui/Brand.tsx';
import { Sources } from './ui/Sources.tsx';
import { project, productNames } from './content/project.ts';
import { createScene } from './scene/runtime.ts';
import { advancePlayback, sampleFlow, initialRoutes, setRoute, products, type Destination } from './simulation/flow.ts';
import type { Part, SceneHandle } from './scene/types.ts';

export function App() {
  const host = useRef<HTMLDivElement>(null), scene = useRef<SceneHandle | null>(null);
  const [routes, setRoutes] = useState(initialRoutes);
  const [parts, setParts] = useState<Part[]>([]), [selected, setSelected] = useState<string | null>(null);
  const [progress, setProgress] = useState(0), [playing, setPlaying] = useState(false);
  const [cutaway, setCutaway] = useState(true), [explosion, setExplosion] = useState(0);
  const [isolated, setIsolated] = useState(false), [wireframe, setWireframe] = useState(false);
  const [sources, setSources] = useState(false);
  const [search, setSearch] = useState(''), [drawer, setDrawer] = useState(false), [tour, setTour] = useState(false);
  const [error, setError] = useState<string | null>(null), [notice, setNotice] = useState('');
  const [reduced, setReduced] = useState(() => matchMedia('(prefers-reduced-motion: reduce)').matches);
  const partsDialog = useRef<HTMLDialogElement>(null);
  const inspector = useRef<HTMLElement>(null);
  const flow = sampleFlow(progress, routes), phase = flow.stage;
  const currentPart = parts.find(p => p.id === selected);
  const format = (n: number) => n.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
  const stagePositions = [.2, .5, .8, 1];
  function changeRoute(destination: Destination) { setRoutes(history => setRoute(history, progress, destination)); setNotice('Destino alterado para os próximos volumes.'); }
  const normalize = (value: string) => value.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/\p{Diacritic}/gu, '');
  const filteredParts = parts.filter(p => normalize(p.label).includes(normalize(search)));
  const select = useCallback((id: string | null) => { setSelected(id); setIsolated(false); setTour(false); }, []);
  useEffect(() => {
    if (!host.current) return;
    try { scene.current = createScene(host.current, select, setParts, setError); }
    catch { setError('Seu navegador não conseguiu abrir a cena 3D. Você ainda pode consultar as fontes e assistir ao vídeo.'); }
    return () => { scene.current?.dispose(); scene.current = null; };
  }, [select]);
  useEffect(() => { scene.current?.update({ progress, cutaway, explosion, selected, isolated, wireframe, routes }); }, [progress, cutaway, explosion, selected, isolated, wireframe, routes]);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const change = () => { setReduced(media.matches); if (media.matches) setPlaying(false); };
    media.addEventListener('change', change); return () => media.removeEventListener('change', change);
  }, []);
  useEffect(() => {
    if (!playing) return;
    let id = 0, last = performance.now();
    const tick = (now: number) => {
      const delta = (now - last) / 1000;
      if (delta >= 1 / 30 - .002) { last = now; setProgress(p => advancePlayback(p, delta, true, !document.hidden)); }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick); return () => cancelAnimationFrame(id);
  }, [playing]);
  useEffect(() => { if (progress === 1) setPlaying(false); }, [progress]);
  useEffect(() => { if (drawer) partsDialog.current?.showModal(); else partsDialog.current?.close(); }, [drawer]);
  useEffect(() => {
    if ((selected || tour) && innerWidth <= 760) {
      const id = requestAnimationFrame(() => inspector.current?.scrollIntoView({ block: 'nearest', behavior: reduced ? 'instant' : 'smooth' }));
      return () => cancelAnimationFrame(id);
    }
  }, [selected, tour, reduced]);
  function reset() {
    setPlaying(false); setProgress(0); setRoutes(initialRoutes); setSelected(null); setIsolated(false); setExplosion(0); setCutaway(true); setWireframe(false); setTour(false);
    scene.current?.home(); setNotice('Experiência reiniciada.');
  }
  function play() {
    setExplosion(0); setIsolated(false); setCutaway(true); setTour(false);
    if (progress >= 1) { setProgress(0); setRoutes(initialRoutes); }
    setPlaying(value => !value);
  }
  function guide(step: number) {
    setPlaying(false); setTour(true); setSelected(null); setIsolated(false); setCutaway(true); setExplosion(0);
    setProgress(stagePositions[Math.max(0, Math.min(3, step))]);
  }
  async function fullscreen() {
    try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); }
    catch { setNotice('Tela cheia não está disponível neste navegador.'); }
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.target instanceof HTMLInputElement || sources || drawer) return;
      if (e.key.toLowerCase() === 'r') scene.current?.home();
      if (e.key.toLowerCase() === 'e') { setPlaying(false); setExplosion(p => p > 0 ? 0 : 1); }
      if (e.key === 'Escape') { setSelected(null); setIsolated(false); setTour(false); }
    };
    document.addEventListener('keydown', onKey); return () => document.removeEventListener('keydown', onKey);
  }, [sources, drawer]);
  const renderParts = () => <>
    <label className="search"><Search size={16}/><input aria-label="Encontrar conjunto" placeholder="Encontrar conjunto" value={search} onChange={e => setSearch(e.target.value)}/><span>{parts.length.toString().padStart(2, '0')}</span></label>
    <div className="parts-list">
      {filteredParts.map(p => <button key={p.id} className={'part-row' + (selected === p.id ? ' selected' : '')} aria-pressed={selected === p.id} onClick={() => { select(p.id); setDrawer(false); }}><span>{String(parts.indexOf(p) + 1).padStart(2, '0')}</span><strong>{p.label}</strong><ChevronRight size={14}/></button>)}
      {parts.length > 0 && !filteredParts.length && <small className="search-hint">Nenhum conjunto encontrado.</small>}
    </div>
  </>;
  return <div className="app">
    <header className="header"><Brand/><div className="collection-label">ENGENHARIA POR DENTRO <span>/</span> LAB {project.number}</div><a className="video-link" href={project.video} target="_blank" rel="noreferrer">Assistir ao vídeo <ArrowUpRight size={16}/></a></header>
    <main className="workspace">
      <div className="heading"><p className="eyebrow"><span/> EXPERIMENTO {project.number} <i>—</i> TRANSPORTE EM BATELADAS</p><h1>{project.title}</h1><p className="intro">{project.intro}</p></div>
      <div className="canvas-region"><div className="scene-host" ref={host}/>
        {!parts.length && !error && <div className="loading" role="status">Preparando o laboratório…</div>}
        {error && <div className="scene-error" role="alert"><Box size={32}/><h2>Cena indisponível</h2><p>{error}</p><button className="primary" onClick={() => location.reload()}>Tentar novamente</button><a href={project.video}>Assistir ao vídeo</a></div>}
        <div className="scene-mode"><span className={playing ? 'status-dot active' : 'status-dot'}/>{isolated ? 'CONJUNTO ISOLADO' : explosion > 0 ? 'VISTA DESMONTADA' : cutaway ? 'POR DENTRO' : 'VISTA COMPLETA'}<span className="mode-divider"/>MODELO 3D</div>
        <div className="orbit-hint">Arraste para girar <span>·</span> Aproxime para descobrir</div>
      </div>
      <aside className="sidebar"><div className="sidebar-label">CONHEÇA OS CONJUNTOS</div>{renderParts()}<div className="sidebar-foot"><span className="mini-line"/><p>O mesmo tubo. Lotes em sequência.<br/>A mistura tem um destino.</p><button className="text-button" onClick={() => guide(0)}>Fazer uma visita guiada <ArrowRight size={15}/></button></div></aside>
      <nav className="view-switch" aria-label="Modo da cena"><button className={!cutaway ? 'active' : ''} aria-pressed={!cutaway} onClick={() => setCutaway(false)}>Explorar</button><button className={cutaway ? 'active' : ''} aria-pressed={cutaway} onClick={() => setCutaway(true)}>Por dentro</button></nav>
      <div className="camera-tools"><button aria-label="Aproximar" title="Aproximar" onClick={() => scene.current?.zoom(.85)}><Plus size={18}/></button><button aria-label="Afastar" title="Afastar" onClick={() => scene.current?.zoom(1.15)}><Minus size={18}/></button><span/><button aria-label="Reenquadrar" title="Reenquadrar (R)" onClick={() => scene.current?.home()}><Focus size={19}/></button><button aria-label="Vista lateral" title="Vista lateral" onClick={() => scene.current?.preset('side')}><Eye size={18}/></button><button aria-label="Mostrar malha" title="Mostrar malha" aria-pressed={wireframe} onClick={() => setWireframe(v => !v)}><Box size={18}/></button><span/><button aria-label="Salvar imagem PNG" title="Salvar imagem" onClick={() => scene.current?.capture()}><Download size={18}/></button><button className="format-button" aria-label="Salvar imagem vertical 9 por 16" title="Salvar imagem vertical 9:16" onClick={() => scene.current?.capture(true)}>9:16</button>{Boolean(document.documentElement.requestFullscreen) && <button aria-label="Tela cheia" title="Tela cheia" onClick={fullscreen}><Maximize size={17}/></button>}</div>
      {currentPart && <section ref={inspector} className="inspector" aria-label="Conjunto selecionado"><div className="inspector-top"><span className="eyebrow">EM DETALHE</span><button className="icon-button" aria-label="Fechar detalhe" onClick={() => select(null)}><X size={16}/></button></div><h2>{currentPart.label}</h2><p>{currentPart.detail}</p><small>{currentPart.note}</small><div className="inspector-actions"><button onClick={() => setIsolated(v => !v)} aria-pressed={isolated}><Layers3 size={14}/>{isolated ? 'Ver conjunto todo' : 'Isolar'}</button><button onClick={() => scene.current?.focus(currentPart.id)}><Focus size={14}/>Aproximar</button></div></section>}
      {tour && <section ref={inspector} className="inspector tour" aria-label="Visita guiada"><div className="inspector-top"><span className="eyebrow">VISITA GUIADA · {phase + 1}/4</span><button className="icon-button" aria-label="Fechar visita" onClick={() => setTour(false)}><X size={16}/></button></div><h2>{project.stages[phase].name}</h2><p>{project.stages[phase].description}</p><div className="inspector-actions"><button disabled={phase === 0} onClick={() => guide(phase - 1)}><ArrowLeft size={14}/>Anterior</button><button onClick={() => phase < 3 ? guide(phase + 1) : setTour(false)}>{phase < 3 ? 'Próxima etapa' : 'Concluir'}<ArrowRight size={14}/></button></div></section>}
      <div className="mobile-actions"><button onClick={() => setDrawer(true)}><Layers3 size={16}/>Conjuntos <span>{parts.length}</span></button><button onClick={() => guide(0)}>Visita guiada <ArrowRight size={16}/></button></div>
      <section className="control-dock" aria-label="Controles do escoamento">
        <div className="dock-top"><button className="primary play-button" disabled={Boolean(error)} onClick={play}>{playing ? <Pause size={17}/> : <Play size={17}/>}<span>{playing ? 'Pausar' : progress >= 1 ? 'Repetir envio' : progress > 0 ? 'Continuar fluxo' : 'Enviar lotes'}</span></button><div className="phase-copy"><strong>{progress >= 1 ? 'Envio concluído' : project.stages[phase].name}</strong><span>{project.stages[phase].description}</span></div><button className="icon-button" aria-label="Reiniciar experiência" title="Reiniciar" onClick={reset}><RotateCcw size={18}/></button></div>
        <div className="timeline"><label htmlFor="cycle">FLUXO <span>{Math.round(progress * 100)}%</span></label><input id="cycle" aria-label="Progresso do escoamento" type="range" min="0" max="1000" value={Math.round(progress * 1000)} style={{ '--progress': `${progress * 100}%` } as React.CSSProperties} onChange={e => { setPlaying(false); setProgress(Number(e.target.value) / 1000); setCutaway(true); setExplosion(0); }}/><div className="phase-markers">{project.stages.map((stage, i) => <button className={phase === i ? 'current' : ''} key={stage.name} onClick={() => { setPlaying(false); setProgress(stagePositions[i]); setCutaway(true); setExplosion(0); }}>{String(i + 1).padStart(2, '0')} <span>{stage.name}</span></button>)}</div></div>
        <fieldset className="route-control"><legend>Destino dos próximos volumes</legend><div className="route-options">{(['auto', ...products] as Destination[]).map((value,i)=><button key={value} aria-pressed={flow.route===value} onClick={()=>changeRoute(value)}>{i===0?'Automático':`${['A','I','B'][i-1]} · ${productNames[value as keyof typeof productNames]}`}</button>)}</div><p>{flow.route==='auto'?'Troca automática: gasolina → interface → diesel.':`Você escolheu o tanque de ${productNames[flow.destination].toLocaleLowerCase('pt-BR')}. O que já chegou permanece no mesmo lugar.`}</p><p className="flow-feedback" aria-live="polite">{format(flow.total)} recebidas · {format(flow.remaining)} no trecho{flow.misplaced>.01 ? ` · ${format(flow.misplaced)} fora do destino de referência` : ''}</p></fieldset>
        <div className="explode-control"><Layers3 size={17}/><label htmlFor="explode">Desmontar conjuntos</label><input id="explode" aria-label="Desmontagem dos conjuntos" type="range" min="0" max="100" value={Math.round(explosion * 100)} onChange={e => { setPlaying(false); setIsolated(false); setExplosion(Number(e.target.value) / 100); }}/><output>{Math.round(explosion * 100)}%</output></div>
        {reduced && <p className="motion-note">Movimento reduzido ativo. Você também pode explorar pelas etapas e pelos controles deslizantes.</p>}
      </section>
    </main>
    <section className="balance" aria-label="Balanço dos lotes"><div className="balance-heading"><div><p className="eyebrow">ACOMPANHE A SEÇÃO DE 100 UNIDADES</p><h2>Para onde foi cada lote?</h2></div><p><strong>{format(flow.total)} recebidas</strong> · {format(flow.remaining)} no trecho<br/><span>Unidades ilustrativas. Sem perda ou criação de volume.</span></p></div><div className="balance-grid">{products.map((id,i)=><article className="tank-reading" key={id}><h3><span className={`product-mark product-${id}`}>{['A','I','B'][i]}</span>Tanque {productNames[id]}</h3><strong className="tank-total">{format(flow.received[i].reduce((sum,n)=>sum+n,0))}<small>un.</small></strong><div className="level-bar" aria-hidden="true">{products.map((p,j)=><span key={p} className={`product-${p}`} style={{width:`${flow.received[i][j]}%`}}/>)}</div><dl>{products.map((p,j)=><div key={p}><dt>{productNames[p]}</dt><dd>{format(flow.received[i][j])}</dd></div>)}</dl></article>)}</div><p className="balance-note" role="status">{flow.misplaced>.01?`${format(flow.misplaced)} unidades foram para um destino diferente do exemplo de segregação. Corrigir a válvula agora não desfaz o que já chegou.`:'No modo de segregação deste exemplo, cada região segue para seu tanque. Experimente escolher outro destino durante a interface.'}</p><p className="balance-disclosure">As faixas representam a origem dos volumes, não camadas físicas nos tanques. A faixa neutra no duto é a continuidade do fluxo que desloca a seção acompanhada.</p></section>
    <footer><span>UM EXPERIMENTO DO OVICTORLAB <i>© 2026</i></span><button onClick={() => setSources(true)}>Modelo educativo · Fontes e créditos <ArrowUpRight size={13}/></button></footer>
    <Sources open={sources} onClose={() => setSources(false)}/>
    <dialog ref={partsDialog} className="parts-dialog" onClose={() => setDrawer(false)} aria-label="Conjuntos do oleoduto"><div className="dialog-top"><span className="eyebrow">CONHEÇA OS CONJUNTOS</span><button className="icon-button" aria-label="Fechar conjuntos" onClick={() => setDrawer(false)}><X size={20}/></button></div>{renderParts()}</dialog>
    <span className="sr-only" role="status" aria-live="polite">{notice}</span>
  </div>;
}
