/*
========================================================
TS VISUALS — EASY EDIT AREA
Change your email, socials and portfolio below.
You normally only need to edit this file.
========================================================
*/

const SITE = {
  email: "tsvisuals.info@gmail.com",

  socials: {
    instagram: "https://www.instagram.com/ts.visuals1/",
    tiktok: "https://www.tiktok.com/@tsvisuals.uk1?lang=en-GB"
  },

  // Portfolio status options:
  // "available", "booked", "coming-soon", "private"
  portfolio: [
    {
      image: "images/photo1.jpg",
      title: "Summer Shoot",
      category: "Portraits",
      status: "unavailable"
    },
    {
      image: "images/photo2.jpg",
      title: "Event Coverage",
      category: "Events",
      status: "unavailable"
    },
    {
      image: "images/photo3.jpg",
      title: "Sports Session",
      category: "Sports",
      status: "unavailable"
    },
    {
      image: "images/photo4.jpg",
      title: "Automotive",
      category: "Automotive",
      status: "unavailable"
    },
    {
      image: "images/photo5.jpg",
      title: "Portrait Session",
      category: "Portraits",
      status: "private"
    },
    {
      image: "images/photo6.jpg",
      title: "Latest Work",
      category: "Events",
      status: "unavailable"
    }
  ]
};

function headerHTML() {
  return `
    <header class="site-header">
      <div class="container navbar">
        <a class="logo" href="index.html"><span>TS</span> VISUALS</a>

        <button class="menu-button" id="menu-button" aria-label="Open menu">☰</button>

        <nav class="nav-links" id="nav-links">
          <a href="index.html">Home</a>
          <a href="portfolio.html">Portfolio</a>
          <a href="about.html">About</a>
          <a href="book.html">Book a Shoot</a>
        </nav>
      </div>
    </header>
  `;
}

function footerHTML() {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-col">
            <a class="logo" href="index.html"><span>TS</span> VISUALS</a>
            <p style="margin-top:14px;">Capturing moments. Creating memories.</p>
          </div>

          <div class="footer-col">
            <div class="footer-title">Contact</div>
            <a id="footer-email" href="#"></a>
          </div>

          <div class="footer-col">
            <div class="footer-title">Socials</div>
            <div class="social-list">
              <a href="${SITE.socials.instagram}" target="_blank" rel="noopener">Instagram</a>
              <a href="${SITE.socials.tiktok}" target="_blank" rel="noopener">TikTok</a>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} TS Visuals. All rights reserved.</span>
          <span>Photography by TS Visuals</span>
        </div>
      </div>
    </footer>
  `;
}

function statusLabel(status) {
  const labels = {
    available: "Available",
    booked: "Booked",
    "coming-soon": "Coming Soon",
    private: "Private"
  };
  return labels[status] || status;
}

function portfolioCard(item) {
  return `
    <article class="portfolio-card" data-status="${item.status}">
      <img src="${item.image}" alt="${item.title} — TS Visuals" loading="lazy"
           onerror="this.style.display='none'">
      <div class="portfolio-info">
        <h3>${item.title}</h3>
        <p>${item.category}</p>
        <span class="status status-${item.status}">${statusLabel(item.status)}</span>
      </div>
    </article>
  `;
}

function renderPortfolio(targetId, items) {
  const target = document.getElementById(targetId);
  if (!target) return;

  target.innerHTML = items.map(portfolioCard).join("");
}

function setupFilters() {
  const buttons = document.querySelectorAll(".filter");
  if (!buttons.length) return;

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      buttons.forEach(b => b.classList.remove("active"));
      button.classList.add("active");

      const filter = button.dataset.filter;
      const items = filter === "all"
        ? SITE.portfolio
        : SITE.portfolio.filter(item => item.status === filter);

      renderPortfolio("full-portfolio", items);
    });
  });
}

function setupBookingForm() {
  const form = document.getElementById("booking-form");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const subject = `TS Visuals Booking Enquiry - ${data.get("shoot")}`;
    const body =
`Name: ${data.get("name")}
Email: ${data.get("email")}
Type of shoot: ${data.get("shoot")}
Preferred date: ${data.get("date") || "Not specified"}

Message:
${data.get("message") || "No message provided."}`;

    window.location.href =
      `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("site-header");
  const footer = document.getElementById("site-footer");

  if (header) header.innerHTML = headerHTML();
  if (footer) footer.innerHTML = footerHTML();

  const emailElements = [
    document.getElementById("footer-email"),
    document.getElementById("booking-email")
  ];

  emailElements.forEach(element => {
    if (!element) return;
    element.textContent = SITE.email;
    element.href = `mailto:${SITE.email}`;
  });

  renderPortfolio("home-portfolio", SITE.portfolio.slice(0, 6));
  renderPortfolio("full-portfolio", SITE.portfolio);

  setupFilters();
  setupBookingForm();

  const menuButton = document.getElementById("menu-button");
  const nav = document.getElementById("nav-links");

  if (menuButton && nav) {
    menuButton.addEventListener("click", () => nav.classList.toggle("open"));
  }
});
