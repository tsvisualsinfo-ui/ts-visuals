
/* TS VISUALS — WEBSITE SCRIPT */

const SITE = {
  email: 'tsvisuals.info@gmail.com',

  tiktok: 'https://www.tiktok.com/@tsvisuals.uk1?lang=en-GB',

  emailjs: {
    publicKey: 'fw__wi-9TNHw2djjO',
    serviceId: 'service_16o9es7',
    templateId: 'template_zgozh2n',
    autoReplyTemplateId: 'template_d6c2omu'
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

function header(active = '') {
  return `
    <header class="site-header">
      <div class="container navbar">
        <a class="logo" href="index.html"><span>TS</span> VISUALS</a>
        <button class="menu-button" id="menu-button"
          aria-label="Toggle navigation" aria-expanded="false">☰</button>
        <nav class="nav-links" id="nav-links">
          <a class="${active === 'home' ? 'active' : ''}" href="index.html">Home</a>
          <a class="${active === 'portfolio' ? 'active' : ''}" href="portfolio.html">Portfolio</a>
          <a class="${active === 'about' ? 'active' : ''}" href="about.html">About</a>
          <a class="nav-cta ${active === 'book' ? 'active' : ''}" href="book.html">Send an Enquiry ↗</a>
        </nav>
      </div>
    </header>`;
}

function footer() {
  return `
    <footer class="footer">
      <div class="container">
        <div class="footer-top">
          <div>
            <a class="logo" href="index.html"><span>TS</span> VISUALS</a>
            <p>Capturing moments. Creating visions.</p>
          </div>
          <div class="footer-links">
            <a href="portfolio.html">Portfolio</a>
            <a href="about.html">About</a>
            <a href="book.html">Send an enquiry</a>
            <a href="${SITE.tiktok}" target="_blank" rel="noopener">TikTok ↗</a>
            <a href="mailto:${SITE.email}">Email</a>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} TS Visuals. All rights reserved.</span>
          <span>Professional Photography for Every Occasion.</span>
        </div>
      </div>
    </footer>`;
}

function portfolioCard(item) {
  return `
    <article class="portfolio-card">
      <img src="${item.image}" alt="${item.title} — TS Visuals"
        loading="lazy" onerror="this.remove()">
      <div class="portfolio-info">
        <h3>${item.title}</h3>
        <p>${item.category}</p>
      </div>
    </article>`;
}

document.addEventListener('DOMContentLoaded', () => {
  const head = document.getElementById('site-header');
  if (head) {
    head.innerHTML = header(document.body.dataset.page || '');
  }

  const foot = document.getElementById('site-footer');
  if (foot) foot.innerHTML = footer();

  const menu = document.getElementById('menu-button');
  const nav = document.getElementById('nav-links');

  if (menu && nav) {
    menu.addEventListener('click', () => {
      const opened = nav.classList.toggle('open');
      menu.setAttribute('aria-expanded', String(opened));
    });
  }

  document.querySelectorAll('[data-portfolio]').forEach(el => {
    const limit = Number(el.dataset.limit) || SITE.portfolio.length;
    el.innerHTML = SITE.portfolio.slice(0, limit).map(portfolioCard).join('');
  });

  const filterButtons = document.querySelectorAll('.filter');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      button.classList.add('active');

      const grid = document.getElementById('full-portfolio');
      if (!grid) return;

      const filter = button.dataset.filter;
      const items = filter === 'all'
        ? SITE.portfolio
        : SITE.portfolio.filter(
            item => item.category.toLowerCase() === filter
          );

      grid.innerHTML = items.length
        ? items.map(portfolioCard).join('')
        : '<p class="empty-note">No photographs in this category yet. Check back soon.</p>';
    });
  });

  const form = document.getElementById('booking-form');

  if (!form) return;

  form.addEventListener('submit', async event => {
    event.preventDefault();

    const status = document.getElementById('form-status');
    const submit = form.querySelector('button[type="submit"]');
    const cfg = SITE.emailjs;

    const ready =
      window.emailjs &&
      cfg.publicKey !== 'PASTE_YOUR_EXISTING_PUBLIC_KEY' &&
      cfg.serviceId &&
      cfg.templateId &&
      cfg.autoReplyTemplateId !== 'PASTE_YOUR_AUTO_REPLY_TEMPLATE_ID' &&
      cfg.autoReplyTemplateId;

    status.className = 'form-status show';

    if (!ready) {
      status.classList.add('error');
      status.textContent =
        'The enquiry form needs its EmailJS Public Key and Auto-Reply Template ID. Please check the website settings.';
      return;
    }

    if (typeof form.reportValidity === 'function' && !form.reportValidity()) {
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Sending enquiry…';

    try {
      window.emailjs.init({ publicKey: cfg.publicKey });

      const data = Object.fromEntries(new FormData(form).entries());
      const rawDate = String(data.date || '').trim();

      const preferredDate = /^\d{4}-\d{2}-\d{2}$/.test(rawDate)
        ? (() => {
            const [year, month, day] = rawDate.split('-');
            return `${day}/${month}/${year}`;
          })()
        : 'Flexible / to discuss';

      const details = {
        name: data.name || 'Not provided',
        email: data.email || '',
        phone: data.phone || 'Not provided',
        shoot_type: data.shoot || data.shoot_type || 'Not specified',
        date: preferredDate,
        preferred_date: preferredDate,
        location: data.location || 'To discuss',
        message: data.message || 'No additional details',
        booking_status:
          'Enquiry only — bookings are paused until 3 January 2027. No booking is confirmed.'
      };

      // 1. Send the enquiry to TS Visuals.
      await window.emailjs.send(
        cfg.serviceId,
        cfg.templateId,
        {
          ...details,
          to_email: SITE.email,
          from_name: details.name,
          from_email: details.email
        },
        { publicKey: cfg.publicKey }
      );

      // 2. Send an automatic reply to the customer.
      try {
        await window.emailjs.send(
          cfg.serviceId,
          cfg.autoReplyTemplateId,
          {
            ...details,
            to_email: details.email,
            reply_to: SITE.email
          },
          { publicKey: cfg.publicKey }
        );

        status.className = 'form-status show success';
        status.textContent =
          'Your enquiry has been sent, and a confirmation email has been sent to you. This is an enquiry only, not a confirmed booking.';
      } catch (replyError) {
        console.error('TS Visuals auto-reply error:', replyError);

        status.className = 'form-status show success';
        status.textContent =
          'Your enquiry has reached TS Visuals, but the automatic reply could not be sent. Please check your email address and try again later.';
      }

      form.reset();

    } catch (error) {
      console.error('TS Visuals enquiry error:', error);

      status.className = 'form-status show error';
      status.textContent =
        'Sorry, your enquiry could not be sent. Please try again or email ' +
        SITE.email + ' directly.';

    } finally {
      submit.disabled = false;
      submit.textContent = 'Send booking enquiry ↗';
    }
  });
});
