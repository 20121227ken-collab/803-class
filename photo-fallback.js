/* Try the organized folder, then the original root location, and common extensions. */
(()=>{'use strict';
function setup(img){
 const n=img.dataset.girl;if(!n)return;
 const base='girl'+n, ext=['jpg','jpeg','png','webp'];
 const paths=ext.flatMap(e=>['g/'+base+'.'+e,base+'.'+e]);
 let i=Math.max(0,paths.indexOf(img.getAttribute('src')));
 img.addEventListener('error',()=>{
   i++;if(i<paths.length){img.src=paths[i];return;}
   img.onerror=null;img.src='missing-photo.svg';img.alt='照片尚未提供';
 });
 if(img.complete&&img.naturalWidth===0)img.dispatchEvent(new Event('error'));
}
function init(){document.querySelectorAll('img[data-girl]').forEach(setup)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
