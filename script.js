/* TS Visuals site settings. Add your EmailJS keys below before publishing the booking form. */
const SITE = {
  email: 'help.tsvisuals@outlook.com',
  tiktok: 'https://www.tiktok.com/@tsvisuals.uk1?lang=en-GB',
  emailjs: {
    publicKey: 'YOUR_EMAILJS_PUBLIC_KEY',
    serviceId: 'YOUR_EMAILJS_SERVICE_ID',
    templateId: 'YOUR_EMAILJS_TEMPLATE_ID'
  },
  portfolio: [
    { image: 'images/photo1.jpg', title: 'Summer Shoot', category: 'Portraits' },
    { image: 'images/photo2.jpg', title: 'Event Coverage', category: 'Events' },
    { image: 'images/photo3.jpg', title: 'Sports Session', category: 'Sports' },
    { image: 'images/photo4.jpg', title: 'Automotive', category: 'Automotive' },
    { image: 'images/photo5.jpg', title: 'Portrait Session', category: 'Portraits' },
    { image: 'images/photo6.jpg', title: 'Latest Work', category: 'Events' }
  ]
};
function header(active='') { return `<header class="site-header"><div class="container navbar"><a class="logo" href="index.html"><span>TS</span> VISUALS</a><button class="menu-button" id="menu-button" aria-label="Toggle navigation" aria-expanded="false">☰</button><nav class="nav-links" id="nav-links"><a class="${active==='home'?'active':''}" href="index.html">Home</a><a class="${active==='portfolio'?'active':''}" href="portfolio.html">Portfolio</a><a class="${active==='about'?'active':''}" href="about.html">About</a><a class="nav-cta ${active==='book'?'active':''}" href="book.html">Send an Enquiry ↗</a></nav></div></header>`; }
function footer(){return `<footer class="footer"><div class="container"><div class="footer-top"><div><a class="logo" href="index.html"><span>TS</span> VISUALS</a><p>Capturing moments. Creating visions.</p></div><div class="footer-links"><a href="portfolio.html">Portfolio</a><a href="about.html">About</a><a href="book.html">Send an enquiry</a><a href="${SITE.tiktok}" target="_blank" rel="noopener">TikTok ↗</a><a href="mailto:${SITE.email}">Email</a></div></div><div class="footer-bottom"><span>© ${new Date().getFullYear()} TS Visuals. All rights reserved.</span><span>Professional Photography for Every Occasion.</span></div></div></footer>`}
function portfolioCard(item){return `<article class="portfolio-card"><img src="${item.image}" alt="${item.title} — TS Visuals" loading="lazy" onerror="this.remove()"><div class="portfolio-info"><h3>${item.title}</h3><p>${item.category}</p></div></article>`}
document.addEventListener('DOMContentLoaded',()=>{
 const head=document.getElementById('site-header');if(head)head.innerHTML=header(document.body.dataset.page||'');
 const foot=document.getElementById('site-footer');if(foot)foot.innerHTML=footer();
 const menu=document.getElementById('menu-button'),nav=document.getElementById('nav-links');if(menu&&nav)menu.addEventListener('click',()=>{const opened=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(opened));});
 document.querySelectorAll('[data-portfolio]').forEach(el=>{const items=SITE.portfolio.slice(0,Number(el.dataset.limit)||SITE.portfolio.length);el.innerHTML=items.map(portfolioCard).join('');});
 const filterButtons=document.querySelectorAll('.filter');filterButtons.forEach(button=>button.addEventListener('click',()=>{filterButtons.forEach(b=>b.classList.remove('active'));button.classList.add('active');const grid=document.getElementById('full-portfolio');const filter=button.dataset.filter;const items=filter==='all'?SITE.portfolio:SITE.portfolio.filter(item=>item.category.toLowerCase()===filter);grid.innerHTML=items.length?items.map(portfolioCard).join(''):'<p class="empty-note">No photographs in this category yet. Check back soon.</p>';}));
 const form=document.getElementById('booking-form');if(form)form.addEventListener('submit',async event=>{event.preventDefault();const status=document.getElementById('form-status'),submit=form.querySelector('button[type="submit"]');const cfg=SITE.emailjs;const ready=window.emailjs&&cfg.publicKey!=='YOUR_EMAILJS_PUBLIC_KEY'&&cfg.serviceId!=='YOUR_EMAILJS_SERVICE_ID'&&cfg.templateId!=='YOUR_EMAILJS_TEMPLATE_ID';status.className='form-status show';if(!ready){status.classList.add('error');status.textContent='The enquiry form is not connected yet. EmailJS setup is required before this form can send. Please use the email link on this page for now.';return;}submit.disabled=true;submit.textContent='Sending enquiry…';try{const data=Object.fromEntries(new FormData(form).entries());await window.emailjs.send(cfg.serviceId,cfg.templateId,{to_email:SITE.email,from_name:data.name,from_email:data.email,phone:data.phone||'Not provided',shoot_type:data.shoot,date:data.date||'Flexible / to discuss',location:data.location||'To discuss',message:data.message||'No additional details',booking_status:'Enquiry only — bookings currently paused; not confirmed'});status.className='form-status show success';status.textContent='Enquiry sent successfully. Thank you — this is a request only, and your shoot is not confirmed. TS Visuals will reply by email.';form.reset();}catch(error){status.className='form-status show error';status.textContent='Sorry, the enquiry could not be sent. Please try again or email '+SITE.email+' directly.';}finally{submit.disabled=false;submit.textContent='Send booking enquiry ↗';}});
});
