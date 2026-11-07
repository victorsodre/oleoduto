import test from 'node:test';
import assert from 'node:assert/strict';
import { sampleFlow, setRoute, advancePlayback, type RouteEvent } from './flow.ts';
const auto: RouteEvent[] = [{ at: 0, destination: 'auto' }];
const close = (a: number, b: number) => assert.ok(Math.abs(a - b) < 1e-8, `${a} != ${b}`);
test('automatic receiving separates 40/20/40 with a complete material balance', () => {
  const s = sampleFlow(1, auto);
  s.received.flat().forEach((v,i)=>close(v,[40,0,0,0,20,0,0,0,40][i]));
  close(s.correct,100); close(s.remaining,0); close(s.total,100);
});
test('switching a destination changes future flow without moving received liquid', () => {
  const history = setRoute(auto,.45,'gasoline');
  assert.deepEqual(sampleFlow(.45,history).received, sampleFlow(.45,auto).received);
  const s = sampleFlow(.55,history);
  close(s.received[0][1],10); close(s.received[1][1],5); close(s.total,55);
});
test('late switch and later correction keep the mixing already received', () => {
  const h = setRoute(setRoute([{at:0,destination:'gasoline'}],.5,'interface'),.7,'diesel');
  assert.deepEqual(sampleFlow(1,h).received.map(r=>r.map(x=>Math.round(x))), [[40,10,0],[0,10,10],[0,0,30]]);
  close(sampleFlow(1,h).correct,80);
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
