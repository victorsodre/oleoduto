import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import { createPipeline } from './pipeline.ts';
import { initialRoutes, setRoute } from '../simulation/flow.ts';
import { fit } from './camera.ts';
test('nine semantic groups contain actual geometry, with unique IDs',()=>{
  const a=createPipeline();assert.equal(a.parts.length,9);assert.equal(new Set(a.parts.map(p=>p.id)).size,9);
  for(const p of a.parts){let meshes=0;p.group.traverse(o=>{if(o instanceof T.Mesh)meshes++;});assert.ok(meshes>0,p.id);}
  a.dispose();
});
test('full sequence and rerouting remain finite; reset restores exact geometry',()=>{
  const a=createPipeline(),snapshot=()=>{const v:number[]=[];a.root.traverse(o=>v.push(...o.position.toArray(),...o.scale.toArray(),...o.quaternion.toArray(),Number(o.visible)));return v;};
  const start=snapshot(),h=setRoute(initialRoutes,.45,'gasoline');
  for(let i=0;i<=200;i++){a.update(i/200,Boolean(i%2),h);assert.ok(snapshot().every(Number.isFinite));}
  a.update(0,true,initialRoutes);assert.deepEqual(snapshot(),start);a.dispose();
});
test('camera includes all bounding corners in desktop, portrait and landscape',()=>{
  const a=createPipeline(),bounds=new T.Box3().setFromObject(a.root);
  for(const aspect of [1440/980,390/844,844/390]){
    const c=new T.PerspectiveCamera(38,aspect,.1,150);fit(c,bounds,new T.Vector3(-.8,.8,1.5));c.updateMatrixWorld(true);
    for(const x of [bounds.min.x,bounds.max.x])for(const y of [bounds.min.y,bounds.max.y])for(const z of [bounds.min.z,bounds.max.z]){
      const v=new T.Vector3(x,y,z).project(c);assert.ok(Math.abs(v.x)<=1 && Math.abs(v.y)<=1);
    }
  }a.dispose();
});
