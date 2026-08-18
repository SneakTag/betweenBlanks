const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
toggle.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
document.querySelectorAll('a[href="#"]').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));
const form=document.getElementById('signup'),msg=document.querySelector('.form-message');
form.addEventListener('submit',e=>{e.preventDefault();msg.textContent="You're on the list. Welcome to Between Blanks.";form.reset();});
const header=document.querySelector('.site-header');
window.addEventListener('scroll',()=>{header.style.background=scrollY>50?'#080808ee':'linear-gradient(#050505cc,transparent)'});
