import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import { createPipeline } from './pipeline.ts';
import { initialRoutes, setRoute } from '../simulation/flow.ts';
import { fit, framePoints, framing, keepOrbit } from './camera.ts';
const meshes = (root: T.Object3D) => { const list: T.Mesh[] = []; root.traverse(o => { if (o instanceof T.Mesh) list.push(o); }); return list; };
test('ten semantic groups, including the arrival densimeter, contain actual geometry with unique IDs',()=>{
  const a=createPipeline();assert.equal(a.parts.length,10);assert.equal(new Set(a.parts.map(p=>p.id)).size,10);
  assert.ok(a.parts.some(p=>p.id==='sensor'));
  for(const p of a.parts)assert.ok(meshes(p.group).length>0,p.id);
  a.dispose();
});
test('only the open half-pipes are double-sided; shared materials stay single-sided',()=>{
  const a=createPipeline(),pipe=a.parts.find(p=>p.id==='pipe')!.group;
  const doubled=meshes(pipe).filter(m=>(m.material as T.Material).side===T.DoubleSide);
  assert.equal(doubled.length,2);
  const shared=new Set(meshes(a.root).filter(m=>!doubled.includes(m)).map(m=>m.material as T.Material));
  for(const m of doubled)assert.ok(!shared.has(m.material as T.Material));
  a.dispose();
});
test('full sequence, rerouting and both seals remain finite; reset restores exact geometry',()=>{
  const a=createPipeline(),snapshot=()=>{const v:number[]=[];a.root.traverse(o=>v.push(...o.position.toArray(),...o.scale.toArray(),...o.quaternion.toArray(),Number(o.visible)));return v;};
  const start=snapshot(),h=setRoute(initialRoutes,.45,'interface');
  for(let i=0;i<=200;i++){a.update(i/200,Boolean(i%2),h,i%3?'direct':'qinter');assert.ok(snapshot().every(Number.isFinite));}
  a.update(0,true,initialRoutes,'direct');assert.deepEqual(snapshot(),start);a.dispose();
});
test('the QINTER seal swaps the middle material in the pipe and in the tanks',()=>{
  const a=createPipeline(),middle=()=>meshes(a.parts.find(p=>p.id==='interface')!.group)[0].material;
  const direct=middle();a.update(.5,true,initialRoutes,'qinter');assert.notEqual(middle(),direct);
  a.update(.5,true,initialRoutes,'direct');assert.equal(middle(),direct);a.dispose();
});
test('camera keeps every visible mesh in frame in desktop, portrait and landscape, from several orbits',()=>{
  const a=createPipeline(),points=framePoints(a.root);
  assert.ok(points.length>=a.parts.length*8);
  for(const aspect of [1076/585,390/844,844/390])for(const direction of [new T.Vector3(-.8,.8,1.5),new T.Vector3(.01,.15,1),new T.Vector3(1.4,.9,-.6)]){
    const c=new T.PerspectiveCamera(38,aspect,.1,150);fit(c,points,direction);c.updateMatrixWorld(true);
    for(const p of points){const v=p.clone().project(c);assert.ok(Math.abs(v.x)<=1 && Math.abs(v.y)<=1);}
  }a.dispose();
});
test('resizing keeps the user orbit direction and target, and scales the zoom with the fit',()=>{
  const a=createPipeline(),points=framePoints(a.root),target=new T.Vector3(.5,1,-.3);
  const orbit=new T.Vector3(2,1.2,-.4).normalize(),position=target.clone().addScaledVector(orbit,9);
  const next=keepOrbit(position,target,points,1440/980,390/844);
  const direction=next.clone().sub(target).normalize();
  assert.ok(direction.distanceTo(orbit)<1e-9);
  const ratio=framing(points,390/844,orbit).distance/framing(points,1440/980,orbit).distance;
  assert.ok(Math.abs(next.distanceTo(target)-9*ratio)<1e-9);
  assert.ok(keepOrbit(position,target,points,1.5,1.5).distanceTo(position)<1e-9);
  a.dispose();
});
