// 703 全站特效：彩色霓虹粒子＋拖尾＋連線＋滑鼠閃躲＋Loading＋捲動進度

document.addEventListener("DOMContentLoaded", function(){

const loading = document.createElement("div");
loading.id = "loading-screen";
loading.innerHTML = '<div class="loading-text">703 LOADING...</div>';
document.body.appendChild(loading);

const progress = document.createElement("div");
progress.id = "scroll-progress";
document.body.appendChild(progress);

const canvas = document.createElement("canvas");
canvas.id = "particle-canvas";
document.body.prepend(canvas);

const ctx = canvas.getContext("2d");

let particles = [];

let mouse = {
x:null,
y:null
};

const colors = [
"#38bdf8",
"#60a5fa",
"#a855f7",
"#f472b6",
"#22d3ee",
"#facc15",
"#34d399"
];

function resizeCanvas(){
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", function(){
resizeCanvas();
createParticles();
});

window.addEventListener("mousemove", function(e){
mouse.x = e.clientX;
mouse.y = e.clientY;
});

window.addEventListener("mouseleave", function(){
mouse.x = null;
mouse.y = null;
});

function createParticles(){

particles = [];

let count = 95;

if(window.innerWidth < 600){
count = 45;
}

for(let i = 0; i < count; i++){

particles.push({
x:Math.random() * canvas.width,
y:Math.random() * canvas.height,
r:Math.random() * 2.5 + 1.2,
dx:(Math.random() - 0.5) * 0.75,
dy:(Math.random() - 0.5) * 0.75,
color:colors[Math.floor(Math.random() * colors.length)],
trail:[]
});

}

}

createParticles();

function drawLines(){

for(let i = 0; i < particles.length; i++){

for(let j = i + 1; j < particles.length; j++){

let p1 = particles[i];
let p2 = particles[j];

let dx = p1.x - p2.x;
let dy = p1.y - p2.y;
let distance = Math.sqrt(dx * dx + dy * dy);

if(distance < 130){

let opacity = 1 - distance / 130;

ctx.beginPath();
ctx.strokeStyle = "rgba(125,211,252," + opacity * 0.35 + ")";
ctx.lineWidth = 1;
ctx.moveTo(p1.x,p1.y);
ctx.lineTo(p2.x,p2.y);
ctx.stroke();

}

}

}

}

function drawParticles(){

ctx.fillStyle = "rgba(2,6,23,0.18)";
ctx.fillRect(0,0,canvas.width,canvas.height);

drawLines();

for(let p of particles){

p.trail.push({x:p.x,y:p.y});

if(p.trail.length > 8){
p.trail.shift();
}

for(let i = 0; i < p.trail.length; i++){

let t = p.trail[i];
let alpha = i / p.trail.length;

ctx.beginPath();
ctx.shadowBlur = 10;
ctx.shadowColor = p.color;
ctx.fillStyle = p.color + Math.floor(alpha * 180).toString(16).padStart(2,"0");
ctx.arc(t.x,t.y,p.r * alpha,0,Math.PI * 2);
ctx.fill();

}

if(mouse.x !== null && mouse.y !== null){

let mx = p.x - mouse.x;
let my = p.y - mouse.y;
let distance = Math.sqrt(mx * mx + my * my);

if(distance < 130 && distance > 0){

let force = (130 - distance) / 130;

p.x += (mx / distance) * force * 10;
p.y += (my / distance) * force * 10;

}

}

ctx.beginPath();
ctx.shadowBlur = 18;
ctx.shadowColor = p.color;
ctx.fillStyle = p.color;
ctx.arc(p.x,p.y,p.r,0,Math.PI * 2);
ctx.fill();

ctx.shadowBlur = 0;

p.x += p.dx;
p.y += p.dy;

if(p.x < 0 || p.x > canvas.width){
p.dx *= -1;
}

if(p.y < 0 || p.y > canvas.height){
p.dy *= -1;
}

}

requestAnimationFrame(drawParticles);

}

drawParticles();

const revealTargets = document.querySelectorAll(
".card,.section,.title,.subtitle,.menu-btn,.container,footer,h1,.quote,.info,.photo,.place-title,.place-info"
);

revealTargets.forEach(function(el){
el.classList.add("reveal");
});

const observer = new IntersectionObserver(function(entries){

entries.forEach(function(entry){

if(entry.isIntersecting){
entry.target.classList.add("show");
}

});

},{
threshold:0.12
});

revealTargets.forEach(function(el){
observer.observe(el);
});

function updateProgress(){

const scrollTop = window.scrollY || document.documentElement.scrollTop;
const docHeight = document.documentElement.scrollHeight - window.innerHeight;
const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

progress.style.width = percent + "%";

}

window.addEventListener("scroll", updateProgress);
updateProgress();

window.addEventListener("load", function(){

setTimeout(function(){
loading.classList.add("hide");
},700);

});

});