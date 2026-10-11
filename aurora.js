/* 803 night sky: twinkling stars, quiet particle links and occasional meteors */
(()=>{'use strict';
const canvas=document.getElementById('aurora-particles');if(!canvas)return;
const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return;
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');if(reduced.matches)return;
let W=0,H=0,dpr=1,stars=[],particles=[],meteors=[],raf=0,last=0,elapsed=0,nextMeteor=5;
const mouse={x:-9999,y:-9999,active:false};
const rnd=(a,b)=>a+Math.random()*(b-a);
function reset(){W=innerWidth;H=innerHeight;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
const ns=Math.min(210,Math.max(65,Math.round(W*H/5300)));stars=Array.from({length:ns},()=>({x:rnd(0,W),y:rnd(0,H),r:rnd(.35,1.35),phase:rnd(0,6.28),speed:rnd(.35,1.4),base:rnd(.19,.55)}));
const np=Math.min(W<650?22:38,Math.max(14,Math.round(W*H/30000)));particles=Array.from({length:np},()=>({x:rnd(0,W),y:rnd(0,H),vx:rnd(-.17,.17),vy:rnd(-.17,.17),r:rnd(.8,1.5),trail:[]}));meteors=[]}
function pointer(e){mouse.x=e.clientX;mouse.y=e.clientY;mouse.active=true}
addEventListener('pointermove',pointer,{passive:true});addEventListener('pointerleave',()=>mouse.active=false,{passive:true});addEventListener('blur',()=>mouse.active=false);addEventListener('resize',reset,{passive:true});reset();
function spawn(){const x=rnd(W*.2,W*1.05),y=rnd(-H*.18,H*.35),speed=rnd(6,10);meteors.push({x,y,vx:-speed*.95,vy:speed*.5,life:0,max:rnd(40,65),length:rnd(85,155),width:rnd(.8,1.5)})}
function frame(t){raf=requestAnimationFrame(frame);if(t-last<1000/40)return;const dt=Math.min((t-last)/25||1,2);last=t;elapsed+=dt/40;ctx.clearRect(0,0,W,H);
for(const s of stars){const alpha=s.base*(.74+.26*Math.sin(elapsed*s.speed+s.phase));ctx.globalAlpha=alpha;ctx.fillStyle='#e8f1ff';ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);ctx.fill()}ctx.globalAlpha=1;
for(const p of particles){if(mouse.active){const dx=p.x-mouse.x,dy=p.y-mouse.y,d=Math.hypot(dx,dy);if(d<120&&d>1){p.vx+=dx/d*(120-d)/120*.06;p.vy+=dy/d*(120-d)/120*.06}}
p.vx*=.99;p.vy*=.99;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.x<0||p.x>W)p.vx*=-1;if(p.y<0||p.y>H)p.vy*=-1;p.x=Math.max(0,Math.min(W,p.x));p.y=Math.max(0,Math.min(H,p.y));p.trail.push([p.x,p.y]);if(p.trail.length>7)p.trail.shift()}
for(let i=0;i<particles.length;i++)for(let j=i+1;j<particles.length;j++){const a=particles[i],b=particles[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<100){ctx.strokeStyle=`rgba(167,203,209,${.07*(1-d/100)})`;ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}
for(const p of particles){for(let k=1;k<p.trail.length;k++){ctx.strokeStyle=`rgba(194,222,220,${.055*k/p.trail.length})`;ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(...p.trail[k-1]);ctx.lineTo(...p.trail[k]);ctx.stroke()}ctx.fillStyle='rgba(205,232,236,.55)';ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fill()}
if(elapsed>nextMeteor){spawn();nextMeteor=elapsed+rnd(7,14)}
for(let i=meteors.length-1;i>=0;i--){const m=meteors[i];m.life+=dt;m.x+=m.vx*dt;m.y+=m.vy*dt;const a=Math.min(1,m.life/9,(m.max-m.life)/14)*.65;const norm=Math.hypot(m.vx,m.vy),tx=m.x-m.vx/norm*m.length,ty=m.y-m.vy/norm*m.length;const g=ctx.createLinearGradient(tx,ty,m.x,m.y);g.addColorStop(0,'rgba(190,222,244,0)');g.addColorStop(.65,`rgba(170,210,238,${a*.38})`);g.addColorStop(1,`rgba(245,249,255,${a})`);ctx.strokeStyle=g;ctx.lineWidth=m.width;ctx.beginPath();ctx.moveTo(tx,ty);ctx.lineTo(m.x,m.y);ctx.stroke();ctx.fillStyle=`rgba(255,255,255,${a})`;ctx.beginPath();ctx.arc(m.x,m.y,1.35,0,Math.PI*2);ctx.fill();if(m.life>=m.max||m.x< -180||m.y>H+180)meteors.splice(i,1)}
}
raf=requestAnimationFrame(frame);document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelAnimationFrame(raf);else{last=0;raf=requestAnimationFrame(frame)}});
})();
