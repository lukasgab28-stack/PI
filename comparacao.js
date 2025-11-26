// Gráfico de radar para comparação de carros
(function () {
  const selects = [
    document.getElementById("carOne"),
    document.getElementById("carTwo"),
    document.getElementById("carThree")
  ];
  const compareBtn = document.getElementById("compareBtn");
  const compareCards = document.getElementById("compareCards");
  const canvas = document.getElementById("radarChart");

  const carsData = window.carsData || [];
  if (!canvas || !compareBtn || !compareCards || carsData.length === 0) return;

  const ctx = canvas.getContext("2d");
  const attributes = [
    { key: "preco", label: "Preço" },
    { key: "conforto", label: "Conforto" },
    { key: "desempenho", label: "Desempenho" },
    { key: "economia", label: "Economia" },
    { key: "tecnologia", label: "Tecnologia" }
  ];

  const palette = [
    { line: "rgba(77,208,225,0.9)", fill: "rgba(77,208,225,0.20)" },
    { line: "rgba(255,127,80,0.9)", fill: "rgba(255,127,80,0.20)" },
    { line: "rgba(124,77,255,0.9)", fill: "rgba(124,77,255,0.20)" },
    { line: "rgba(100,221,23,0.9)", fill: "rgba(100,221,23,0.20)" },
    { line: "rgba(255,202,40,0.9)", fill: "rgba(255,202,40,0.20)" }
  ];

  function populateSelects() {
    selects.forEach((select, index) => {
      if (!select) return;
      const placeholder = index === 2 ? "Nenhum (opcional)" : "Selecione";
      select.innerHTML = `<option value="">${placeholder}</option>`;
      carsData.forEach((car) => {
        const option = document.createElement("option");
        option.value = car.name;
        option.textContent = `${car.name} • ${car.category}`;
        select.appendChild(option);
      });
      if (index === 0) select.value = carsData[0]?.name || "";
      if (index === 1) select.value = carsData[1]?.name || "";
    });
  }

  function getSelectedCars() {
    const selected = [];
    const seen = new Set();
    selects.forEach((select) => {
      const name = select?.value;
      if (!name || seen.has(name)) return;
      const car = carsData.find((c) => c.name === name);
      if (car) {
        selected.push(car);
        seen.add(name);
      }
    });
    return selected;
  }

  function renderCards(list) {
    compareCards.innerHTML = "";
    const fragment = document.createDocumentFragment();

    list.forEach((car) => {
      const consumo = (12 + car.stats.economia * 0.6).toFixed(1);
      const potencia = Math.round(140 + car.stats.desempenho * 22);
      const card = document.createElement("article");
      card.className = "compare-card";
      card.innerHTML = `
        <h4>${car.name}</h4>
        <div class="tagline">${car.category}</div>
        <div class="price">R$ ${car.price}/dia</div>
        <div class="pill-grid">
          <span class="pill">Potência ~ ${potencia} cv</span>
          <span class="pill">Consumo ~ ${consumo} km/l eq.</span>
          <span class="pill">Tecnologia ${car.stats.tecnologia}/10</span>
          <span class="pill">Conforto ${car.stats.conforto}/10</span>
        </div>
      `;
      fragment.appendChild(card);
    });

    compareCards.appendChild(fragment);
  }

  function setupCanvas() {
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth || 600;
    const height = Math.max(360, Math.min(540, Math.round(width * 0.7)));
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    return { width, height };
  }

  // Gera radar animado com valores crescendo
  function drawRadar(list) {
    const { width, height } = setupCanvas();
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2 - 40;
    const step = (Math.PI * 2) / attributes.length;

    function drawGrid() {
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.strokeStyle = "rgba(255,255,255,0.14)";
      ctx.lineWidth = 1;
      for (let level = 2; level <= 10; level += 2) {
        const radius = (level / 10) * maxRadius;
        ctx.beginPath();
        attributes.forEach((_, idx) => {
          const angle = step * idx - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          idx === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.globalAlpha = 0.35;
        ctx.stroke();
      }

      attributes.forEach((attr, idx) => {
        const angle = step * idx - Math.PI / 2;
        const x = Math.cos(angle) * maxRadius;
        const y = Math.sin(angle) * maxRadius;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(x, y);
        ctx.stroke();

        const labelX = Math.cos(angle) * (maxRadius + 18);
        const labelY = Math.sin(angle) * (maxRadius + 18);
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--muted");
        ctx.font = "14px 'Segoe UI', sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(attr.label, labelX, labelY);
      });
      ctx.restore();
    }

    function drawPolygons(progress) {
      list.forEach((car, index) => {
        const color = palette[index % palette.length];
        ctx.beginPath();
        attributes.forEach((attr, idx) => {
          const value = car.stats[attr.key] * progress;
          const radius = (value / 10) * maxRadius;
          const angle = step * idx - Math.PI / 2;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          idx === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fillStyle = color.fill;
        ctx.strokeStyle = color.line;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.9;
        ctx.fill();
        ctx.stroke();

        attributes.forEach((attr, idx) => {
          const value = car.stats[attr.key] * progress;
          const radius = (value / 10) * maxRadius;
          const angle = step * idx - Math.PI / 2;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          ctx.beginPath();
          ctx.fillStyle = color.line;
          ctx.arc(x, y, 4, 0, Math.PI * 2);
          ctx.fill();
        });
      });
    }

    let start;
    function animate(timestamp) {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / 900, 1);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();
      drawPolygons(progress);
      if (progress < 1) requestAnimationFrame(animate);
    }

    requestAnimationFrame(animate);
  }

  function runCompare() {
    const list = getSelectedCars();
    if (list.length < 2) {
      compareCards.innerHTML = "<p class='tagline'>Selecione ao menos dois carros para comparar.</p>";
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    renderCards(list);
    drawRadar(list);
  }

  populateSelects();
  runCompare();

  compareBtn.addEventListener("click", runCompare);
  window.addEventListener("resize", () => runCompare());
})();
