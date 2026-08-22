const toggle=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
toggle.addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));
const socialDialog=document.getElementById('social-dialog');
const contactDialog=document.getElementById('contact-dialog');
document.querySelectorAll('.contact-trigger').forEach((contactTrigger,index)=>contactTrigger.addEventListener('click',()=>{
	const dialog=index===0?socialDialog:contactDialog;
	nav.classList.remove('open');
	const triggerBounds=contactTrigger.getBoundingClientRect();
	dialog.style.top=`${triggerBounds.bottom+12}px`;
	dialog.style.right=`${Math.max(16,window.innerWidth-triggerBounds.right)}px`;
	dialog.showModal();
}));
document.querySelectorAll('.social-dialog').forEach(dialog=>{
	dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
	dialog.addEventListener('click',event=>{
		if(event.target===dialog) dialog.close();
	});
});
document.querySelectorAll('a[href="#"]').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));
const header=document.querySelector('.site-header');
window.addEventListener('scroll',()=>{header.style.background=scrollY>50?'#080808ee':'linear-gradient(#050505cc,transparent)'});

const featuredVideos=[...document.querySelectorAll('.video-player')];
const visibleFeaturedVideos=new Set();
let featuredAudioUnlocked=false;

function controlFeaturedVideo(video,command) {
	if(video.tagName==='VIDEO') {
		if(command==='playVideo') {
			video.play().catch(()=>{
				video.muted=true;
				video.play().catch(()=>{});
			});
		}
		if(command==='pauseVideo') video.pause();
		if(command==='mute') video.muted=true;
		if(command==='unMute') video.muted=false;
		return;
	}
	if(!video.contentWindow) return;
	video.contentWindow.postMessage(JSON.stringify({
		event:'command',
		func:command,
		args:[]
	}), 'https://www.youtube.com');
}

const videoObserver=new IntersectionObserver(entries=>{
	entries.forEach(entry=>{
		if(entry.isIntersecting){
			visibleFeaturedVideos.add(entry.target);
			if(entry.target.tagName!=='VIDEO') controlFeaturedVideo(entry.target,'mute');
			if(featuredAudioUnlocked) controlFeaturedVideo(entry.target,'unMute');
			controlFeaturedVideo(entry.target,'playVideo');
		} else {
			visibleFeaturedVideos.delete(entry.target);
			controlFeaturedVideo(entry.target,'pauseVideo');
		}
	});
},{threshold:.5});

featuredVideos.forEach(video=>videoObserver.observe(video));

function unlockFeaturedAudio() {
	if(featuredAudioUnlocked) return;
	featuredAudioUnlocked=true;
	visibleFeaturedVideos.forEach(video=>{
		controlFeaturedVideo(video,'unMute');
		controlFeaturedVideo(video,'playVideo');
	});
}

window.addEventListener('pointerdown',unlockFeaturedAudio,{once:true,passive:true});
window.addEventListener('keydown',unlockFeaturedAudio,{once:true});

const vaultPlayer=document.querySelector('.vault-player');
let vaultAudioUnlocked=false;
const vaultVideoObserver=new IntersectionObserver(entries=>{
	entries.forEach(entry=>{
		if(entry.isIntersecting){
			vaultPlayer.play().catch(()=>{});
		} else {
			vaultPlayer.pause();
		}
	});
},{threshold:.5});

vaultVideoObserver.observe(vaultPlayer);

function unlockVaultAudio() {
	if(vaultAudioUnlocked) return;
	vaultAudioUnlocked=true;
	vaultPlayer.muted=false;
	if(vaultPlayer.paused && vaultPlayer.getBoundingClientRect().top < window.innerHeight && vaultPlayer.getBoundingClientRect().bottom > 0){
		vaultPlayer.play().catch(()=>{});
	}
	window.removeEventListener('pointerdown',unlockVaultAudio);
	window.removeEventListener('keydown',unlockVaultAudio);
}

window.addEventListener('pointerdown',unlockVaultAudio,{once:true,passive:true});
window.addEventListener('keydown',unlockVaultAudio,{once:true});

