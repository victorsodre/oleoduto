export const products = ['gasoline', 'interface', 'diesel'] as const;
export type Product = typeof products[number];
export type Destination = Product | 'auto';
export type RouteEvent = { at: number; destination: Destination };
export const initialRoutes: RouteEvent[] = [{ at: 0, destination: 'auto' }];
export const safeProgress = (p: number) => Number.isFinite(p) ? Math.min(1, Math.max(0, p)) : 0;
const limits = [0, .4, .6, 1];
export function productAt(progress: number): Product { return progress < .4 ? 'gasoline' : progress < .6 ? 'interface' : 'diesel'; }
export function routeAt(progress: number, routes: RouteEvent[]): Destination {
  return routes.filter(r => r.at <= progress).at(-1)?.destination ?? 'auto';
}
/** Rewinding and changing the valve replaces the future, never already received material. */
export function setRoute(routes: RouteEvent[], at: number, destination: Destination): RouteEvent[] {
  const p = safeProgress(at);
  return [...routes.filter(r => r.at < p), { at: p, destination }];
}
export function sampleFlow(value: number, routes: RouteEvent[] = initialRoutes) {
  const progress = safeProgress(value);
  const received = products.map(() => [0, 0, 0]);
  const cuts = [...new Set([0, progress, ...limits.filter(x => x > 0 && x < progress), ...routes.map(r => r.at).filter(x => x > 0 && x < progress)])].sort((a,b) => a-b);
  for(let i=0;i<cuts.length-1;i++) {
    const from=cuts[i], to=cuts[i+1], mid=(from+to)/2;
    const product=productAt(mid), route=routeAt(mid,routes), destination=route==='auto'?product:route;
    received[products.indexOf(destination)][products.indexOf(product)] += (to-from)*100;
  }
  const inPipe = [40,20,40].map((volume,i) => Math.max(0, volume - received.reduce((sum,row)=>sum+row[i],0)));
  const total = received.flat().reduce((sum,x)=>sum+x,0);
  const correct = received.reduce((sum,row,i)=>sum+row[i],0);
  const current = productAt(progress), route=routeAt(progress,routes);
  return { progress, received, inPipe, total, correct, misplaced:total-correct, remaining:100-total, current, destination:route==='auto'?current:route, route, stage:progress>=1?3:products.indexOf(current) };
}
export function advancePlayback(progress: number, deltaSeconds: number, playing: boolean, visible: boolean) {
  const dt=Number.isFinite(deltaSeconds)?Math.min(.1,Math.max(0,deltaSeconds)):0;
  return safeProgress(progress + (playing && visible ? dt/20 : 0));
}
