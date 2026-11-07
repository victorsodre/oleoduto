import * as T from 'three';
import { box, mesh, materials, connect, rod, disposeTree, mergeStatic } from './geometry.ts';
import { sampleFlow, products, type RouteEvent } from '../simulation/flow.ts';
import type { Assembly, Part } from './types.ts';

const colors = ['#ffd21f','#ef7d42','#52b8da'];
/** Patterned liquids remain distinguishable without color. No solid separator is modeled. */
function fluidMaterial(index: number) {
  const n=64, data=new Uint8Array(n*n*4), a=new T.Color(colors[0]), b=new T.Color(colors[2]);
  for(let y=0;y<n;y++)for(let x=0;x<n;x++) {
    const c=index===1?b.clone().lerp(a,y/(n-1)):new T.Color(colors[index]);
    const marked=index===0?x%24<3:index===2?(x%20-10)**2+(y%20-10)**2<8:(x+y)%24<3||(x-y+128)%24<3;
    if(marked)c.multiplyScalar(.48);
    const offset=(y*n+x)*4;data[offset]=c.r*255;data[offset+1]=c.g*255;data[offset+2]=c.b*255;data[offset+3]=255;
  }
  const map=new T.DataTexture(data,n,n);map.needsUpdate=true;map.wrapS=map.wrapT=T.RepeatWrapping;
  return new T.MeshStandardMaterial({map,roughness:.38,metalness:.15});
}
function tag(parent:T.Group,text:string,x:number,y:number,z:number) {
  if(typeof document==='undefined')return;
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=96;
  const ctx=canvas.getContext('2d')!;ctx.fillStyle='#101526';ctx.fillRect(0,0,512,96);ctx.strokeStyle='#5c657d';ctx.strokeRect(1,1,510,94);
  ctx.font='600 30px Archivo, sans-serif';ctx.fillStyle='#f1f2f8';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(text,256,48);
  const material=new T.MeshBasicMaterial({map:new T.CanvasTexture(canvas),side:T.DoubleSide});
  const label=mesh(parent,new T.PlaneGeometry(1.8,.34),material,x,y,z);label.rotation.x=-.2;label.castShadow=false;
}
export function createPipeline():Assembly {
  const root=new T.Group(),parts:Part[]=[],m=materials();
  const part=(id:string,label:string,detail:string,note:string,offset:[number,number,number])=>{
    const group=new T.Group();group.name=id;group.userData.partId=id;root.add(group);parts.push({id,label,detail,note,group,offset:new T.Vector3(...offset)});return group;
  };
  const inlet=part('inlet','Entrada e bombeamento','O escoamento desloca os lotes pelo mesmo tubo.','O trecho já começa preenchido. O fluido que vem depois aparece neutro e não entra no balanço da seção acompanhada.',[-1,-.4,0]);
  const pipe=part('pipe','Duto em corte','Uma única passagem transporta os produtos em sequência.','O corte é apenas visual. As cores ajudam a acompanhar cada região; o tubo real permanece fechado.', [0,-.7,0]);
  const liquidGroups=[
    part('gasoline','A · Gasolina','Primeiro lote: faixa amarela com traços.','40 unidades ilustrativas da seção acompanhada.', [0,.6,.3]),
    part('interface','I · Interface','Região de mistura entre os lotes, identificada com uma trama cruzada.','Não existe uma parede entre os líquidos. A extensão real depende das condições de transporte.', [0,1.3,0]),
    part('diesel','B · Diesel','Segundo lote: faixa azul com pontos.','40 unidades ilustrativas da seção acompanhada.', [0,.6,-.3]),
  ];
  const valves=part('valves','Válvulas e destinos','A seleção abre uma rota para o tanque correspondente.','Mudar a rota afeta o que chegar depois. O líquido já recebido não muda de tanque.', [.7,.5,0]);
  const tankGroups=products.map((id,i)=>part(`tank-${id}`,['Tanque A · Gasolina','Tanque I · Interface','Tanque B · Diesel'][i],
    ['Recebe o primeiro lote.','Separa a região misturada neste exemplo.','Recebe o segundo lote.'][i],
    'As faixas de nível mostram a composição acumulada por origem. Não representam estratificação física dos líquidos.',[1.1,.3,(i-1)*.7]));
  box(inlet,[2.5,.22,1.8],[-6.2,.12,0],m.dark,.06);
  const pump=mesh(inlet,new T.CylinderGeometry(.5,.5,1.1,32),m.yellow,-6.4,.85,0);pump.rotation.z=Math.PI/2;
  for(let i=0;i<6;i++){const fin=mesh(inlet,new T.CylinderGeometry(.54,.54,.05,32),m.steel,-6.8+i*.14,.85,0);fin.rotation.z=Math.PI/2;}
  box(inlet,[.85,.28,.7],[-5.65,.85,0],m.yellow,.06);
  const elbow=rod(inlet,.22,m.silver);connect(elbow,new T.Vector3(-5.55,.85,0),new T.Vector3(-5.55,1.8,0));
  tag(inlet,'ENTRADA  →',-6.2,.4,1.05);
  const start=-5.3,length=7.2,end=start+length,y=1.8;
  const bottom=mesh(pipe,new T.CylinderGeometry(.48,.48,length,40,1,true,Math.PI,Math.PI),m.steel,(start+end)/2,y,0);bottom.rotation.z=Math.PI/2;bottom.material.side=T.DoubleSide;
  const upper=mesh(pipe,new T.CylinderGeometry(.48,.48,length,40,1,true,0,Math.PI),m.ivory,(start+end)/2,y,0);upper.rotation.z=Math.PI/2;upper.material.side=T.DoubleSide;
  for(let x=start;x<end+.1;x+=1.2){
    const rim=mesh(pipe,new T.TorusGeometry(.49,.045,8,40),m.silver,x,y,0);rim.rotation.y=Math.PI/2;
    for(const z of [-.65,.65])box(pipe,[.12,1.1,.1],[x,.65,z],m.steel);
    box(pipe,[.4,.18,1.7],[x,.14,0],m.dark,.03);
  }
  const fluidMats=colors.map((_,i)=>fluidMaterial(i));
  const fluids=liquidGroups.map((g,i)=>{const f=mesh(g,new T.CylinderGeometry(.41,.41,1,36),fluidMats[i],0,y,0);f.rotation.z=-Math.PI/2;return f;});
  const carrier=mesh(inlet,new T.CylinderGeometry(.4,.4,1,32),new T.MeshStandardMaterial({color:'#3b4a5b',roughness:.5}),0,y,0);carrier.rotation.z=-Math.PI/2;
  const centers=[2.5,0,-2.5];
  const handles:T.Mesh[]=[],routeLights:T.Mesh[]=[],levels:T.Mesh[][]=[];
  const shellMat=new T.MeshStandardMaterial({color:'#c2cfdd',roughness:.3,metalness:.25,transparent:true,opacity:.18,depthWrite:false,side:T.DoubleSide});
  const tankShells:T.Mesh[]=[],tankRoofs:T.Mesh[]=[];
  for(let i=0;i<3;i++){
    const z=centers[i],g=tankGroups[i],x=4.2;
    box(g,[2.3,.18,2.1],[x,.1,z],m.dark,.05);
    const shell=mesh(g,new T.CylinderGeometry(.85,.85,2.25,48,1,true),shellMat,x,1.35,z);shell.castShadow=false;tankShells.push(shell);
    for(const h of [.25,2.46])mesh(g,new T.TorusGeometry(.85,.045,8,48),m.silver,x,h,z).rotation.x=Math.PI/2;
    const roof=mesh(g,new T.ConeGeometry(.88,.23,48),m.ivory,x,2.58,z);tankRoofs.push(roof);
    mesh(g,new T.CylinderGeometry(.12,.12,.2,16),m.steel,x,2.8,z);
    tag(g,['A  ·  GASOLINA','I  ·  INTERFACE','B  ·  DIESEL'][i],x,2.98,z+.15);
    const stack=products.map((_,j)=>mesh(g,new T.CylinderGeometry(.8,.8,1,36),fluidMats[j],x,.25,z));levels.push(stack);
    const inletRod=rod(valves,.15,m.steel);connect(inletRod,new T.Vector3(end,y,0),new T.Vector3(2.35,y,z));
    const outletRod=rod(valves,.15,m.steel);connect(outletRod,new T.Vector3(2.35,y,z),new T.Vector3(3.4,y,z));
    box(valves,[.38,.45,.4],[2.65,y,z],m.silver,.03);
    const stem=rod(valves,.05,m.steel);connect(stem,new T.Vector3(2.65,y,z),new T.Vector3(2.65,y+.55,z));
    const handle=box(valves,[.5,.08,.09],[2.65,y+.58,z],m.yellow,.025);handles.push(handle);
    const light=mesh(valves,new T.SphereGeometry(.09,12,8),new T.MeshStandardMaterial({color:colors[i],emissive:colors[i],emissiveIntensity:0}),2.65,y+.31,z+.22);routeLights.push(light);
  }
  // Merge only static siblings. Dynamic liquids, valves, tank roofs and shells remain addressable.
  mergeStatic(liquidGroups[0]); // one mesh: no-op, preserves the liquid transform
  for(const g of [inlet,pipe])g.updateMatrixWorld(true);
  function update(progress:number,cutaway:boolean,routes:RouteEvent[]) {
    const s=sampleFlow(progress,routes),d=s.progress;
    upper.visible=!cutaway;
    const bounds=[[.6,1],[.4,.6],[0,.4]];
    fluids.forEach((f,i)=>{
      const a=Math.min(1,bounds[i][0]+d),b=Math.min(1,bounds[i][1]+d),span=Math.max(0,b-a);
      f.visible=span>1e-6;f.scale.y=Math.max(.00001,span*length);f.position.x=start+(a+b)*length/2;
    });
    carrier.visible=d>0;carrier.scale.y=Math.max(.00001,d*length);carrier.position.x=start+d*length/2;
    for(let i=0;i<3;i++){
      tankRoofs[i].visible=!cutaway;
      let level=.25;
      for(let j=0;j<3;j++){
        const amount=s.received[i][j],height=amount/100*2.1,item=levels[i][j];
        item.visible=amount>1e-8;item.scale.y=Math.max(.00001,height);item.position.y=level+height/2;level+=height;
      }
      const active=products[i]===s.destination;
      handles[i].rotation.y=active?0:Math.PI/2;
      (routeLights[i].material as T.MeshStandardMaterial).emissiveIntensity=active?1.3:0;
    }
    root.updateMatrixWorld(true);
  }
  update(0,true,[{at:0,destination:'auto'}]);
  return {root,parts,update,dispose:()=>disposeTree(root)};
}
