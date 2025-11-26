// Configurações globais de tema, fonte e busca
(function () {
  const root = document.documentElement;
  const body = document.body;
  const configPanel = document.getElementById("configPanel");
  const configBtn = document.getElementById("configBtn");
  const closeConfig = document.getElementById("closeConfig");
  const themeToggle = document.getElementById("themeToggle");
  const fontDown = document.getElementById("fontDown");
  const fontReset = document.getElementById("fontReset");
  const fontUp = document.getElementById("fontUp");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");
  const searchBar = document.querySelector(".search-bar");

  const carsData = [
    { name: "Tesla Model 3", category: "Elétrico", price: 420, link: "eletrico/tesla-model-3.html", stats: { preco: 7, conforto: 8, desempenho: 8, economia: 10, tecnologia: 10 } },
    { name: "Nissan Leaf e+", category: "Elétrico", price: 320, link: "eletrico/nissan-leaf-eplus.html", stats: { preco: 9, conforto: 7, desempenho: 6, economia: 9, tecnologia: 8 } },
    { name: "BMW i4 eDrive40", category: "Elétrico", price: 520, link: "eletrico/bmw-i4-edrive40.html", stats: { preco: 6, conforto: 9, desempenho: 8, economia: 8, tecnologia: 9 } },
    { name: "Kia EV6 GT-Line", category: "Elétrico", price: 480, link: "eletrico/kia-ev6-gtline.html", stats: { preco: 7, conforto: 8, desempenho: 8, economia: 8, tecnologia: 8 } },

    { name: "Porsche 911 Carrera S", category: "Esportivo", price: 1150, link: "esportivo/porsche-911-carrera-s.html", stats: { preco: 3, conforto: 7, desempenho: 10, economia: 4, tecnologia: 9 } },
    { name: "Chevrolet Corvette Stingray", category: "Esportivo", price: 980, link: "esportivo/corvette-stingray.html", stats: { preco: 4, conforto: 7, desempenho: 9, economia: 4, tecnologia: 7 } },
    { name: "BMW M4 Competition", category: "Esportivo", price: 940, link: "esportivo/bmw-m4-competition.html", stats: { preco: 4, conforto: 7, desempenho: 9, economia: 4, tecnologia: 8 } },
    { name: "Audi R8 V10", category: "Esportivo", price: 1400, link: "esportivo/audi-r8-v10.html", stats: { preco: 2, conforto: 7, desempenho: 10, economia: 3, tecnologia: 9 } },

    { name: "Range Rover Sport", category: "SUV", price: 950, link: "suv/range-rover-sport.html", stats: { preco: 4, conforto: 9, desempenho: 8, economia: 5, tecnologia: 9 } },
    { name: "Volvo XC90 Recharge", category: "SUV", price: 820, link: "suv/volvo-xc90-recharge.html", stats: { preco: 5, conforto: 9, desempenho: 7, economia: 7, tecnologia: 9 } },
    { name: "BMW X5 xDrive45e", category: "SUV", price: 870, link: "suv/bmw-x5-xdrive45e.html", stats: { preco: 5, conforto: 9, desempenho: 8, economia: 6, tecnologia: 9 } },
    { name: "Toyota RAV4 Hybrid", category: "SUV", price: 520, link: "suv/toyota-rav4-hybrid.html", stats: { preco: 7, conforto: 7, desempenho: 6, economia: 8, tecnologia: 7 } },

    { name: "Mercedes-Benz S 580", category: "Luxo", price: 1250, link: "luxo/mercedes-s580.html", stats: { preco: 3, conforto: 10, desempenho: 8, economia: 5, tecnologia: 10 } },
    { name: "BMW 740i", category: "Luxo", price: 1050, link: "luxo/bmw-740i.html", stats: { preco: 4, conforto: 9, desempenho: 8, economia: 6, tecnologia: 9 } },
    { name: "Audi A8 L", category: "Luxo", price: 1100, link: "luxo/audi-a8l.html", stats: { preco: 4, conforto: 9, desempenho: 8, economia: 6, tecnologia: 9 } },
    { name: "Lexus LS 500", category: "Luxo", price: 980, link: "luxo/lexus-ls500.html", stats: { preco: 5, conforto: 9, desempenho: 7, economia: 6, tecnologia: 8 } },

    { name: "Mazda MX-5 RF", category: "Conversível", price: 520, link: "conversivel/mazda-mx5-rf.html", stats: { preco: 8, conforto: 6, desempenho: 7, economia: 7, tecnologia: 6 } },
    { name: "BMW Z4 Roadster", category: "Conversível", price: 750, link: "conversivel/bmw-z4.html", stats: { preco: 6, conforto: 7, desempenho: 8, economia: 6, tecnologia: 8 } },
    { name: "Audi A5 Cabriolet", category: "Conversível", price: 680, link: "conversivel/audi-a5-cabriolet.html", stats: { preco: 6, conforto: 8, desempenho: 7, economia: 6, tecnologia: 8 } },
    { name: "Ford Mustang Convertible", category: "Conversível", price: 720, link: "conversivel/ford-mustang-convertible.html", stats: { preco: 5, conforto: 7, desempenho: 8, economia: 5, tecnologia: 7 } }
  ];

  window.carsData = carsData;

  const state = {
    theme: localStorage.getItem("autoTheme") || root.getAttribute("data-theme") || "dark",
    fontScale: parseFloat(localStorage.getItem("autoFont") || "1")
  };

  function applyTheme(theme) {
    state.theme = theme;
    root.setAttribute("data-theme", theme);
    const isDark = theme === "dark";
    if (themeToggle) {
      themeToggle.classList.toggle("active", isDark);
      themeToggle.setAttribute("aria-pressed", String(isDark));
      themeToggle.setAttribute("aria-label", isDark ? "Alternar para tema claro" : "Alternar para tema escuro");
    }
    localStorage.setItem("autoTheme", theme);
  }

  function applyFontScale(scale) {
    const clamped = Math.min(1.2, Math.max(0.9, scale));
    state.fontScale = clamped;
    root.style.setProperty("--font-scale", clamped.toString());
    localStorage.setItem("autoFont", clamped.toString());
  }

  function toggleConfig(open) {
    if (!configPanel) return;
    const shouldOpen = typeof open === "boolean" ? open : !configPanel.classList.contains("active");
    configPanel.classList.toggle("active", shouldOpen);
    configBtn?.setAttribute("aria-expanded", String(shouldOpen));
  }

  function renderSearch(query) {
    if (!searchInput || !searchResults) return;
    const value = query.trim().toLowerCase();
    searchResults.innerHTML = "";
    if (value.length < 2) {
      searchResults.classList.remove("active");
      searchInput.setAttribute("aria-expanded", "false");
      return;
    }

    const results = carsData.filter(
      (car) =>
        car.name.toLowerCase().includes(value) ||
        car.category.toLowerCase().includes(value)
    );

    if (results.length === 0) {
      const empty = document.createElement("div");
      empty.textContent = "Nenhum modelo encontrado.";
      empty.className = "tagline";
      searchResults.appendChild(empty);
      searchResults.classList.add("active");
      searchInput.setAttribute("aria-expanded", "true");
      return;
    }

    const fragment = document.createDocumentFragment();
    results.slice(0, 6).forEach((car) => {
      const link = document.createElement("a");
      link.href = car.link;
      link.className = "search-card";
      link.setAttribute("role", "option");
      link.setAttribute("aria-label", `${car.name} em ${car.category}`);

      const left = document.createElement("div");
      left.innerHTML = `<strong>${car.name}</strong><div class="tagline">${car.category}</div>`;

      const price = document.createElement("span");
      price.className = "badge";
      price.textContent = `R$ ${car.price}/dia`;

      link.appendChild(left);
      link.appendChild(price);
      fragment.appendChild(link);
    });

    searchResults.appendChild(fragment);
    searchResults.classList.add("active");
    searchInput.setAttribute("aria-expanded", "true");
  }

  function closeSearch() {
    if (!searchResults) return;
    searchResults.classList.remove("active");
    if (searchInput) searchInput.setAttribute("aria-expanded", "false");
  }

  function initSplash() {
    const splash = document.querySelector(".splash");
    if (!splash) {
      body.classList.add("content-ready");
      return;
    }
    const navLogo = document.querySelector(".logo");
    const alreadySeen = sessionStorage.getItem("autoSplashSeen") === "1";
    if (alreadySeen) {
      splash.classList.add("hidden");
      body.classList.add("content-ready");
      return;
    }

    const finish = () => {
      splash.classList.add("hidden");
      navLogo?.classList.add("logo-pop");
      body.classList.add("content-ready");
      sessionStorage.setItem("autoSplashSeen", "1");
    };

    setTimeout(finish, 2600);
  }

  // Eventos de UI
  themeToggle?.addEventListener("click", () => {
    applyTheme(state.theme === "dark" ? "light" : "dark");
  });

  fontDown?.addEventListener("click", () => applyFontScale(state.fontScale - 0.05));
  fontReset?.addEventListener("click", () => applyFontScale(1));
  fontUp?.addEventListener("click", () => applyFontScale(state.fontScale + 0.05));

  configBtn?.addEventListener("click", () => toggleConfig(true));
  closeConfig?.addEventListener("click", () => toggleConfig(false));

  document.addEventListener("keydown", (ev) => {
    if (ev.key === "Escape") {
      toggleConfig(false);
      closeSearch();
    }
  });

  document.addEventListener("click", (ev) => {
    const target = ev.target;
    if (configPanel && !configPanel.contains(target) && !configBtn?.contains(target)) {
      toggleConfig(false);
    }
    if (searchBar && !searchBar.contains(target)) {
      closeSearch();
    }
  });

  if (searchInput) {
    searchInput.addEventListener("input", (ev) => renderSearch(ev.target.value));
    searchInput.addEventListener("focus", () => renderSearch(searchInput.value));
  }

  applyTheme(state.theme);
  applyFontScale(state.fontScale);
  initSplash();
})();
