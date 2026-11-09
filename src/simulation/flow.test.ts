import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleFlow, setRoute, advancePlayback, sensorReading, autoDestination, type RouteEvent } from './flow.ts';
const auto: RouteEvent[] = [{ at: 0, destination: 'auto' }];
const close = (a: number | null, b: number) => assert.ok(a !== null && Math.abs(a - b) < 1e-8, `${a} != ${b}`);
test('automatic cut splits the mixed region between the product tanks, as in OSBRA', () => {
  const s = sampleFlow(1, auto);
  s.received.flat().forEach((v,i)=>close(v,[40,10,0,0,0,0,0,10,40][i]));
  close(s.offCut,0); close(s.remaining,0); close(s.total,100);
  assert.equal(autoDestination(.49),'gasoline'); assert.equal(autoDestination(.5),'diesel');
});
test('the arrival sensor rises from gasoline to diesel and the QINTER seal is not given a density', () => {
  close(sensorReading(0,'direct'),0); close(sensorReading(.39,'direct'),0);
  close(sensorReading(.5,'direct'),.5); close(sensorReading(.6,'direct'),1); close(sensorReading(1,'qinter'),1);
  assert.equal(sensorReading(.5,'qinter'),null); close(sensorReading(.2,'qinter'),0);
  let previous = 0;
  for(let i=0;i<=100;i++){ const r=sensorReading(i/100,'direct')!; assert.ok(r>=previous-1e-12 && r<=1); previous=r; }
  close(sensorReading(NaN,'direct'),0);
});
test('switching a destination changes future flow without moving received liquid', () => {
  const history = setRoute(auto,.45,'interface');
  assert.deepEqual(sampleFlow(.45,history).received, sampleFlow(.45,auto).received);
  const s = sampleFlow(.55,history);
  close(s.received[0][1],5); close(s.received[1][1],10); close(s.total,55); close(s.offCut,10);
});
test('late switch and later correction keep the mixing already received', () => {
  const h = setRoute(setRoute([{at:0,destination:'gasoline'}],.5,'interface'),.7,'diesel');
  assert.deepEqual(sampleFlow(1,h).received.map(r=>r.map(x=>Math.round(x))), [[40,10,0],[0,10,10],[0,0,30]]);
  close(sampleFlow(1,h).offCut,20);
});
test('switching to gasoline at the cut point sends everything after it to tank A', () => {
  const s = sampleFlow(1, setRoute(auto,.5,'gasoline'));
  assert.deepEqual(s.received.map(r=>r.reduce((a,b)=>a+b,0)).map(Math.round),[100,0,0]);
  close(s.offCut,50);
});
test('scrubbing and rerouting rewrites only the future', () => {
  const h = setRoute(setRoute(auto,.7,'gasoline'),.3,'diesel');
  assert.equal(h.length,2); assert.equal(h[1].at,.3);
  assert.deepEqual(sampleFlow(.2,h),sampleFlow(.2,auto));
});
test('conservation, monotonic receipt and finite nonnegative values across 1001 samples', () => {
  const history = setRoute(setRoute(auto,.37,'interface'),.61,'gasoline');
  let previous = 0;
  for(let i=0;i<=1000;i++) {
    const s=sampleFlow(i/1000,history);
    close(s.total+s.remaining,100); close(s.total,i/10);
    assert.ok(s.total>=previous-1e-8); previous=s.total;
    assert.ok(s.received.flat().every(x=>Number.isFinite(x)&&x>=0));
    close(s.inPipe.reduce((sum,x)=>sum+x,0),s.remaining);
  }
});
test('invalid time clamps, paused and hidden flow conserve state',()=>{
  close(sampleFlow(NaN,auto).total,0); close(sampleFlow(20,auto).total,100);
  close(advancePlayback(.5,100,true,true),.505);
  close(advancePlayback(.5,1,false,true),.5); close(advancePlayback(.5,1,true,false),.5);
});
