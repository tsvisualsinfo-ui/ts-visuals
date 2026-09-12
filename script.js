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

  const stepOne = document.getElementById("booking-step-1");
  const stepTwo = document.getElementById("booking-step-2");
  const nextButton = document.getElementById("next-booking-step");
  const backButton = document.getElementById("back-booking-step");
  const summary = document.getElementById("booking-summary");
  const packageSelect = document.getElementById("booking-package");
  const dateInput = document.getElementById("booking-date");

  function getMinimumDate(hoursAhead) {
    const date = new Date();
    date.setHours(date.getHours() + hoursAhead);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function updateDateRule() {
    if (!packageSelect || !dateInput) return;

    if (packageSelect.value === "Deluxe Priority") {
      dateInput.min = getMinimumDate(48);
    } else {
      dateInput.min = getMinimumDate(168);
    }
  }

  packageSelect.addEventListener("change", updateDateRule);
  updateDateRule();

  nextButton.addEventListener("click", () => {
    const requiredFields = stepOne.querySelectorAll("input[required], select[required], textarea[required]");

    for (const field of requiredFields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return;
      }
    }

    const startTime = form.elements["start-time"].value;
    const endTime = form.elements["end-time"].value;

    if (endTime <= startTime) {
      alert("The latest arrival time must be after the earliest arrival time.");
      return;
    }

    const selectedDate = new Date(`${dateInput.value}T00:00:00`);
    const minimumDate = new Date(`${dateInput.min}T00:00:00`);

    if (selectedDate < minimumDate) {
      alert(
        packageSelect.value === "Deluxe Priority"
          ? "Deluxe bookings require at least 48 hours’ notice."
          : "Standard bookings require at least 7 days’ notice."
      );
      return;
    }

    summary.innerHTML = `
      <h4>Booking summary</h4>
      <p><strong>Shoot:</strong> ${form.elements["shoot"].value}</p>
      <p><strong>Package:</strong> ${packageSelect.value}</p>
      <p><strong>Date:</strong> ${dateInput.value}</p>
      <p><strong>Arrival window:</strong> ${startTime}–${endTime}</p>
      <p><strong>Location:</strong> ${form.elements["location"].value}</p>
      ${packageSelect.value === "Deluxe Priority"
        ? "<p><strong>Priority fee:</strong> £10</p>"
        : ""}
    `;

    stepOne.hidden = true;
    stepTwo.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  backButton.addEventListener("click", () => {
    stepTwo.hidden = true;
    stepOne.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
    form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = "Sending booking...";
    }

    const data = new FormData(form);

    const booking = {
      name: data.get("name"),
      email: data.get("email"),
      phone: data.get("phone"),
      shoot: data.get("shoot"),
      package: data.get("package"),
      date: data.get("date"),
      startTime: data.get("start-time"),
      endTime: data.get("end-time"),
      location: data.get("location"),
      message: data.get("message") || "",
      status: "Pending",
      createdAt: new Date().toISOString()
    };

    try {
      await db.collection("bookings").add(booking);

      alert(
        "Your booking request has been sent successfully. " +
        "TS Visuals will review it and contact you."
      );

      form.reset();
      stepTwo.hidden = true;
      stepOne.hidden = false;
    } catch (error) {
      console.error("Booking submission error:", error);

      alert(
        "Sorry, your booking could not be sent. " +
        "Please try again or email TS Visuals directly."
      );
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = "Confirm Booking Request";
      }
    }
  });
});
