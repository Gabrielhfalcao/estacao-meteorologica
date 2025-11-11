// ====== ELEMENTOS DO MENU ======
const menuBtn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

// Abrir/fechar menu
menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
});

// Fechar menu ao clicar no overlay
overlay.addEventListener("click", () => {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
  closeAllModals();
});

// ====== MODAIS ======
const cards = document.querySelectorAll(".card");
const modals = document.querySelectorAll(".modal");
const closeButtons = document.querySelectorAll(".modal .close");

function closeAllModals() {
  modals.forEach(m => m.classList.remove("active"));
}

// Abrir modal ao clicar no card
cards.forEach(card => {
  card.addEventListener("click", () => {
    const modalId = card.getAttribute("data-modal");
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("active");
      overlay.classList.add("active");

      if (modalId === "modal-temp") carregarGrafico("http://localhost:8080/temperatura/diario", "chart-temp", "Temperatura (°C)", "rgba(255,99,132,1)");
      if (modalId === "modal-hum") carregarGrafico("http://localhost:8080/umidade/diario", "chart-hum", "Umidade (%)", "rgba(54,162,235,1)");
      if (modalId === "modal-press") carregarGrafico("http://localhost:8080/pressao/diario", "chart-press", "Pressão (hPa)", "rgba(255,206,86,1)");
    }
  });
});

// Fechar modal ao clicar no "x"
closeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    closeAllModals();
    overlay.classList.remove("active");
  });
});

// ====== ATUALIZAÇÃO EM TEMPO REAL COM DADOS REAIS (com animação e fallback) ======
const updateValue = (elementId, newValue, suffix = "") => {
  const el = document.getElementById(elementId);
  const currentValue = parseFloat(el.textContent) || 0;
  const targetValue = parseFloat(newValue);

  // Animação suave de transição numérica
  const duration = 100; // ms
  const steps = 5;
  const stepTime = duration / steps;
  const increment = (targetValue - currentValue) / steps;
  let stepCount = 0;

  const animate = setInterval(() => {
    stepCount++;
    const updated = currentValue + increment * stepCount;
    el.textContent = updated.toFixed(2) + " " + suffix; // sempre 2 casas decimais
    if (stepCount >= steps) clearInterval(animate);
  }, stepTime);
};

const updateRealtimeData = () => {
  fetch("http://localhost:8080/dadosArduino")
    .then(res => {
      if (!res.ok) throw new Error("Falha na resposta da API");
      return res.json();
    })
    .then(data => {
      updateValue("temp", data.temperatura, "°C");
      updateValue("hum", data.umidade, "%");
      updateValue("press", data.pressao, "hPa");
    })
    .catch(err => {
      console.warn("⚠️ Erro ao buscar dados:", err.message);
      document.getElementById("temp").textContent = "-- °C";
      document.getElementById("hum").textContent = "-- %";
      document.getElementById("press").textContent = "-- hPa";
      document.getElementById("alt").textContent = "21 m";
    });
};

// Atualiza a cada 2 segundos
setInterval(updateRealtimeData, 2000);

// Chamada inicial imediata
updateRealtimeData();



// ====== FUNÇÃO GENÉRICA DE GRÁFICO ======
const charts = {}; // para evitar recriação

function carregarGrafico(apiUrl, canvasId, labelName, borderColor) {
  fetch(apiUrl)
    .then(res => res.json())
    .then(dados => {
      // Converter 'yyyy-MM-dd HH:mm:ss' para 'yyyy-MM-ddTHH:mm:ss' para o Date funcionar
      const labels = dados.map(item => {
        const isoDate = item.data.replace(' ', 'T');
        return new Date(isoDate).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
      });

      const values = dados.map(item => item.valor);

      const ctx = document.getElementById(canvasId).getContext("2d");

      if (charts[canvasId]) charts[canvasId].destroy();

      charts[canvasId] = new Chart(ctx, {
        type: "line",
        data: {
          labels,
          datasets: [{
            label: labelName,
            data: values,
            borderColor: borderColor,
            pointBackground: borderColor.replace("1)", "0.9)"),
            backgroundColor: borderColor.replace("1)", "0.3)"),
            pointBorderColor: "#fff",
            pointBorderWidth: 2,
            tension: 0.3,
            fill: true,
            pointRadius: 5
          }]
        },
        options: {
            responsive: true,
            plugins: {
            legend: {
            display: true,
            labels: { color: "#ffffffff", font: { size: 14, weight: "bold" } }
          },
          tooltip: {
            backgroundColor: "#000000ff",
            titleColor: "#ffffffff",
            bodyColor: "#ffffffff",
            borderColor: "#fffefeff",
            borderWidth: 1,
          }
        },
          scales: {
            x: {
              title: { display: true, text: "Hora do Dia", color: "#ffffffff" },
              ticks: { autoSkip: true, maxTicksLimit: 12, color: "#ffffffff" },
              grid: { color: "rgba(255, 255, 255, 0.05)" }
            },
            y: {
              title: { display: true, text: labelName, color: "#ffffffff" },
              ticks: { color: "#ffffffff", color: "#ffffffff"},
              grid: { color: "rgba(214, 214, 214, 0.05)"},
              beginAtZero: false
            }
          }
        }
      });
    })
    .catch(err => console.error("Erro ao carregar API:", err));
}
