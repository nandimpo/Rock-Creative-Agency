// =====================================================
// ROCK CREATIVE AGENCY - NAVBAR FILTER DROPDOWNS
// Final Version – Fixed Audio-Visual Filter + Combined Logic + Global Visibility
// =====================================================

class NavigationFilter {
  constructor() {
    this.filters = { team: [], projects: [], services: [] };
    this.categories = {
      team: [
        "Creative Director",
        "Producer",
        "Designer",
        "Developer",
        "Manager",
        "Strategist"
      ],
      projects: [
        "Braam Fashion Week",
        "Metro FM",
        "Loeries",
        "Cannes",
        "Riot Agency",
        "Busy Beverages",
        "Mkunda Productions",
        "Luyanda Game Lodge",
        "M & M Firm"
      ],
      services: [
        "Public Relations",
        "Audio-Visual",   // ✅ fixed from Audio-/-Visual
        "Branding",
        "Social Media",
        "Production",
        "Pre Production",
        "Post Production"
      ]
    };

    this.apiConfig = {
      baseUrl: "https://api.unsplash.com",
      accessKey: "0t9oSz1rrQysyS9sOIvyKAcT9Q3NzQmAetBVKqS_CaY"
    };

    this.init();
  }

  // ---------- INIT ----------
  init() {
    this.loadFilters();
    this.addArrows();
    this.createDropdowns();
    this.setupListeners();
  }

  // ---------- Add arrows beside About, Work, Services ----------
  addArrows() {
    const navMap = { About: "team", Work: "projects", Services: "services" };
    const navLinks = document.querySelectorAll(".nav-links a");

    navLinks.forEach((link) => {
      const text = link.textContent.trim();
      const category = navMap[text];
      if (!category) return;

      const wrapper = document.createElement("span");
      wrapper.className = "filter-arrow-wrapper";

      const arrow = document.createElement("span");
      arrow.className = "filter-arrow";
      arrow.innerHTML = "&#9662;";
      arrow.dataset.category = category;

      link.after(wrapper);
      wrapper.appendChild(arrow);
    });
  }

  // ---------- Create dropdowns dynamically ----------
  createDropdowns() {
    Object.entries(this.categories).forEach(([key, items]) => {
      const dropdown = document.createElement("div");
      dropdown.className = "filter-dropdown";
      dropdown.dataset.category = key;

      const title = document.createElement("div");
      title.className = "filter-title";
      title.textContent = key.toUpperCase();

      const options = document.createElement("div");
      options.className = "filter-options";

      // ✅ Clean value creation (fix Audio-Visual bug)
      items.forEach((item) => {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.dataset.category = key;

        // replace spaces/slashes/specials
        checkbox.value = item
  .toLowerCase()
  .replace(/[^\w\s-]/g, "")   // remove punctuation but keep spaces and hyphens
  .replace(/[\s/]+/g, "-");   // convert spaces and slashes to hyphen


        label.appendChild(checkbox);
        label.append(" " + item);
        options.appendChild(label);
      });

      // ---------- Action Buttons ----------
      const actions = document.createElement("div");
      actions.className = "filter-actions";

      const applyBtn = document.createElement("button");
      applyBtn.textContent = "Apply Filters";
      applyBtn.className = "filter-apply-btn";

      const resetBtn = document.createElement("button");
      resetBtn.textContent = "Reset Filters";
      resetBtn.className = "filter-reset-btn";

      actions.append(applyBtn, resetBtn);

      // ---------- Unsplash API Section ----------
      const apiSection = document.createElement("div");
      apiSection.className = "filter-api-section";
      apiSection.innerHTML = `
        <div class="filter-category-title">🔴 Live Industry Inspiration</div>
        <p class="filter-api-subtext">Fetch real creative industry photos from Unsplash</p>
        <button class="filter-api-btn">🌐 Load Creative Inspiration</button>
      `;

      dropdown.append(title, options, actions, apiSection);
      document.querySelector(".navbar").appendChild(dropdown);
    });
  }

  // ---------- Event Listeners ----------
  setupListeners() {
    // Toggle dropdown open/close
    document.addEventListener("click", (e) => {
      const wrapper = e.target.closest(".filter-arrow-wrapper");
      if (wrapper) {
        const arrow = wrapper.querySelector(".filter-arrow");
        const cat = arrow.dataset.category;
        this.toggleDropdown(cat);
      } else if (!e.target.closest(".filter-dropdown")) {
        this.closeAll();
      }
    });

    // Apply filters
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("filter-apply-btn")) {
        this.collectFilters();
        this.saveFilters();
        this.applyFilters();
        this.closeAll();
      }
    });

    // Reset filters
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("filter-reset-btn")) {
        this.resetFilters();
      }
    });

    // Unsplash API + Close gallery
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("filter-api-btn")) {
        const category = e.target.closest(".filter-dropdown")?.dataset.category;
        this.fetchUnsplashImages(category || "creative agency");
      }

      if (e.target.classList.contains("unsplash-close-btn")) {
        const gallery = e.target.closest(".unsplash-gallery");
        if (gallery) {
          gallery.style.opacity = "0";
          gallery.style.transform = "translateY(40px)";
          setTimeout(() => gallery.remove(), 600);
        }
      }
    });
  }

  // ---------- Dropdown Toggle ----------
  toggleDropdown(category) {
    const dropdown = document.querySelector(`.filter-dropdown[data-category='${category}']`);
    const arrow = document.querySelector(`.filter-arrow[data-category='${category}']`);
    const isOpen = dropdown.classList.contains("active");

    this.closeAll();

    if (isOpen) return;

    dropdown.classList.add("active");
    arrow.classList.add("rotated");

    // FIXED position for visibility across all pages
    const rect = arrow.getBoundingClientRect();
    dropdown.style.position = "fixed";
    dropdown.style.top = `${rect.bottom + 10}px`;
    dropdown.style.left = `${rect.left - dropdown.offsetWidth / 2 + rect.width / 2}px`;
    dropdown.style.zIndex = "99999";
  }

  closeAll() {
    document.querySelectorAll(".filter-dropdown").forEach((d) => d.classList.remove("active"));
    document.querySelectorAll(".filter-arrow").forEach((a) => a.classList.remove("rotated"));
  }

  // ---------- Filter Logic ----------
  collectFilters() {
    this.filters = { team: [], projects: [], services: [] };
    document.querySelectorAll(".filter-dropdown input:checked").forEach((cb) => {
      const cat = cb.dataset.category;
      this.filters[cat].push(cb.value);
    });
  }

  saveFilters() {
    localStorage.setItem("navFilters", JSON.stringify(this.filters));
  }

  loadFilters() {
    const saved = localStorage.getItem("navFilters");
    if (saved) this.filters = JSON.parse(saved);
  }

  // ✅ Combined filter logic
  applyFilters() {
    const els = document.querySelectorAll(
      "[data-filter-team], [data-filter-projects], [data-filter-services]"
    );

    els.forEach((el) => {
      let visible = true;

      Object.entries(this.filters).forEach(([cat, values]) => {
        if (values.length > 0) {
          const attr = el.getAttribute(`data-filter-${cat}`) || "";
          const matches = values.some((v) => attr.includes(v));
          if (!matches) visible = false;
        }
      });

      el.classList.toggle("filtered-hidden", !visible);
    });

    if (this.getFilterCount() === 0) {
      els.forEach((el) => el.classList.remove("filtered-hidden"));
    }

    setTimeout(() => {
      const firstVisible = Array.from(els).find(
        (el) => !el.classList.contains("filtered-hidden")
      );
      if (firstVisible) {
        firstVisible.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 200);
  }

  // ---------- Reset Filters ----------
  resetFilters() {
    document.querySelectorAll(".filter-dropdown input[type='checkbox']").forEach(
      (cb) => (cb.checked = false)
    );
    this.filters = { team: [], projects: [], services: [] };
    localStorage.removeItem("navFilters");
    document
      .querySelectorAll("[data-filter-team], [data-filter-projects], [data-filter-services]")
      .forEach((el) => el.classList.remove("filtered-hidden"));
  }

  getFilterCount() {
    return (
      this.filters.team.length +
      this.filters.projects.length +
      this.filters.services.length
    );
  }

  // ---------- UNSPLASH API ----------
  async fetchUnsplashImages(query) {
    try {
      const url = `${this.apiConfig.baseUrl}/search/photos?query=${encodeURIComponent(
        query
      )}&client_id=${this.apiConfig.accessKey}&per_page=6`;

      const res = await fetch(url);
      const data = await res.json();

      const existing = document.querySelector(".unsplash-gallery");
      if (existing) existing.remove();

      const gallerySection = document.createElement("section");
      gallerySection.className = "unsplash-gallery";

      const header = document.createElement("div");
      header.className = "unsplash-header";
      header.innerHTML = `<h2 class="unsplash-heading">${query.toUpperCase()} INSPIRATION</h2>`;

      const imageContainer = document.createElement("div");
      imageContainer.className = "unsplash-images";

      data.results.forEach((img) => {
        const image = document.createElement("img");
        image.src = img.urls.regular;
        image.alt = img.alt_description || "Creative inspiration";
        imageContainer.appendChild(image);
      });

      const closeBtn = document.createElement("button");
      closeBtn.className = "unsplash-close-btn";
      closeBtn.textContent = "Close Inspiration";

      gallerySection.appendChild(header);
      gallerySection.appendChild(imageContainer);
      gallerySection.appendChild(closeBtn);

      const footer = document.querySelector("footer");
      if (footer) {
        footer.parentNode.insertBefore(gallerySection, footer);
      } else {
        document.body.appendChild(gallerySection);
      }

      gallerySection.style.opacity = "0";
      gallerySection.style.transform = "translateY(50px)";
      setTimeout(() => {
        gallerySection.style.transition = "all 0.8s ease";
        gallerySection.style.opacity = "1";
        gallerySection.style.transform = "translateY(0)";
      }, 50);

      gallerySection.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (err) {
      console.error("Unsplash API Error:", err);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => new NavigationFilter());
