const menuBtn = document.getElementById("menu-btn");
const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

// ====== MENU LATERAL ======
menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
});
overlay.addEventListener("click", () => {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
});

// ====== TOGGLES ======
const toggles = {
  temp: document.getElementById("toggle-temp"),
  hum: document.getElementById("toggle-hum"),
  press: document.getElementById("toggle-press"),
};

Object.values(toggles).forEach(toggle => {
  toggle.addEventListener("change", () => {
    if (toggle.checked) {
      Object.values(toggles).forEach(t => { if (t !== toggle) t.checked = false; });
    } else {
      toggle.checked = true;
    }
  });
});

// ====== GRÁFICO PRINCIPAL ======
let chart;
function renderChart(labels, values, labelName, color) {
  const ctx = document.getElementById("dashboard-chart").getContext("2d");
  if (chart) chart.destroy();

  chart = new Chart(ctx, {
    type: "line",
    data: { 
      labels, 
      datasets: [{ 
        label: labelName, 
        data: values, 
        borderColor: color,
        backgroundColor: color.replace("1)", "0.15)"), 
        borderWidth: 3, 
        fill: true, 
        tension: 0.35,
        pointRadius: 5, 
        pointHoverRadius: 7, 
        pointBackgroundColor: color, 
        pointBorderColor: "#fff",
        pointBorderWidth: 2 
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true, labels: { color: "#fff", font: { size: 14, weight: "bold" } } },
        tooltip: { backgroundColor: "#000", titleColor: "#fff", bodyColor: "#fff", borderColor: "#fff", borderWidth: 1 }
      },
      scales: {
        x: { 
          title: { display: true, text: "Hora", color: "#fff", font: { size: 13, weight: "bold" } }, 
          ticks: { color: "#fff" }, 
          grid: { color: "rgba(255,255,255,0.05)" } 
        },
        y: { 
          title: { display: true, text: labelName, color: "#fff", font: { size: 13, weight: "bold" } }, 
          ticks: { color: "#fff" }, 
          grid: { color: "rgba(255,255,255,0.05)" } 
        }
      }
    }
  });
}

// ====== GRÁFICO DO INDICADOR 1 ======
let indicador1Chart;
async function renderIndicador1() {
  const urls = {
    temperatura: "http://localhost:8080/temperatura/diario",
    umidade: "http://localhost:8080/umidade/diario",
    pressao: "http://localhost:8080/pressao/diario"
  };

  try {
    const [tempRes, humRes, pressRes] = await Promise.all([
      fetch(urls.temperatura), fetch(urls.umidade), fetch(urls.pressao)
    ]);

    const [tempData, humData, pressData] = await Promise.all([
      tempRes.json(), humRes.json(), pressRes.json()
    ]);

    const labels = tempData.map(d => new Date(d.data.replace(" ", "T")).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));

    const ctx = document.getElementById("indicador1-chart").getContext("2d");
    if (indicador1Chart) indicador1Chart.destroy();

    indicador1Chart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          { label: "Temperatura (°C)", data: tempData.map(d => d.valor), borderColor: "rgba(255,99,132,1)", backgroundColor: "rgba(255,99,132,0.1)", tension: 0.35, fill: true },
          { label: "Umidade (%)", data: humData.map(d => d.valor), borderColor: "rgba(54,162,235,1)", backgroundColor: "rgba(54,162,235,0.1)", tension: 0.35, fill: true },
          { label: "Pressão (hPa)", data: pressData.map(d => d.valor), borderColor: "rgba(255,206,86,1)", backgroundColor: "rgba(255,206,86,0.1)", tension: 0.35, fill: true }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: "#fff", font: { size: 12 } } } },
        scales: { 
          x: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.05)" } },
          y: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.05)" } }
        }
      }
    });

  } catch (err) {
    console.error("Erro ao carregar dados do Indicador 1:", err);
  }
}

// ====== FUNÇÃO PARA CALCULAR LINHA DE TENDÊNCIA ======
function calcularMediaMovel(dados, periodo = 3) {
  const resultado = [];
  for (let i = 0; i < dados.length; i++) {
    let inicio = Math.max(0, i - periodo + 1);
    const soma = dados.slice(inicio, i + 1).reduce((a, b) => a + b, 0);
    resultado.push(soma / (i - inicio + 1));
  }
  return resultado;
}

// ====== GRÁFICO INDICADOR 2 ======
let indicador2Chart;
async function renderIndicador2() {
  const url = "http://localhost:8080/temperatura/diario";

  try {
    const res = await fetch(url);
    const dados = await res.json();

    const labels = dados.map(d => new Date(d.data.replace(" ", "T")).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    const temperaturas = dados.map(d => d.valor);
    const tendencia = calcularMediaMovel(temperaturas, 3);

    const ctx = document.getElementById("indicador2-chart").getContext("2d");
    if (indicador2Chart) indicador2Chart.destroy();

    indicador2Chart = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          { label: "Temperatura (°C)", data: temperaturas, borderColor: "rgba(255,99,132,1)", backgroundColor: "rgba(54,162,235,0.1)", fill: true, tension: 0.35, pointRadius: 4, pointHoverRadius: 6 },
          { label: "Tendência", data: tendencia, borderColor: "rgba(76, 193, 40, 1)", borderDash: [5,5], fill: false, tension: 0.35, pointRadius: 0 }
        ]
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false, 
        plugins: { legend: { labels: { color: "#fff", font: { size: 12 } } } }, 
        scales: { 
          x: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.05)" } }, 
          y: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.05)" } } 
        } 
      }
    });

  } catch (err) { console.error("Erro ao carregar dados do Indicador 2:", err); }
}

// ====== VARIAÇÃO DIÁRIA ======
let indicador2VarChart;
async function renderIndicador2Variacao() {
  try {
    const [tempRes, humRes, pressRes] = await Promise.all([
      fetch("http://localhost:8080/temperatura/diario"),
      fetch("http://localhost:8080/umidade/diario"),
      fetch("http://localhost:8080/pressao/diario")
    ]);

    const [tempData, humData, pressData] = await Promise.all([tempRes.json(), humRes.json(), pressRes.json()]);

    const variacoes = [
      Math.max(...tempData.map(d => d.valor)) - Math.min(...tempData.map(d => d.valor)),
      Math.max(...humData.map(d => d.valor)) - Math.min(...humData.map(d => d.valor)),
      Math.max(...pressData.map(d => d.valor)) - Math.min(...pressData.map(d => d.valor))
    ];

    const ctx = document.getElementById("indicador2-var-chart").getContext("2d");
    if (indicador2VarChart) indicador2VarChart.destroy();

    indicador2VarChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Temperatura (°C)", "Umidade (%)", "Pressão (hPa)"],
        datasets: [{ 
          label: "Variação Diária", 
          data: variacoes, 
          backgroundColor: ["rgba(255,99,132,0.5)","rgba(54,162,235,0.5)","rgba(255,206,86,0.5)"], 
          borderColor: ["rgba(255,99,132,1)","rgba(54,162,235,1)","rgba(255,206,86,1)"], 
          borderWidth: 2 
        }]
      },
      options: { 
        responsive: true, 
        maintainAspectRatio: false, 
        plugins: { legend: { display: false } }, 
        scales: { 
          x: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.05)" } }, 
          y: { ticks: { color: "#fff" }, grid: { color: "rgba(255,255,255,0.05)" }, beginAtZero: true } 
        } 
      }
    });

  } catch (err) { console.error("Erro ao carregar dados do Indicador 2 - Variação:", err); }
}

// ====== VALORES MÁXIMOS DIÁRIOS ======
async function carregarMaximosDiarios() {
  try {
    const [tempRes, humRes, pressRes] = await Promise.all([
      fetch("http://localhost:8080/temperatura/diario"),
      fetch("http://localhost:8080/umidade/diario"),
      fetch("http://localhost:8080/pressao/diario")
    ]);

    const [tempData, humData, pressData] = await Promise.all([tempRes.json(), humRes.json(), pressRes.json()]);

    const maxTemp = Math.max(...tempData.map(d => d.valor));
    const maxHum = Math.max(...humData.map(d => d.valor));
    const maxPress = Math.max(...pressData.map(d => d.valor));

    document.querySelector(".indicadorTemperatura").innerText = `🌡️ ${maxTemp} °C`;
    document.querySelector(".indicadorUmidade").innerText = `💧 ${maxHum} %`;
    document.querySelector(".indicadorPressao").innerText = `⚖️  ${maxPress} hPa`;

  } catch(err) {
    console.error("Erro ao carregar valores máximos:", err);
  }
}

// ====== FUNÇÃO GENÉRICA PARA GRÁFICO PRINCIPAL ======
function buscarDadosGenerico(tipo, inicioInput = "", fimInput = "") {
  let url;
  let label, cor;

  switch (tipo) {
    case "temperatura": label = "Temperatura (°C)"; cor = "rgba(255,99,132,1)"; break;
    case "umidade": label = "Umidade (%)"; cor = "rgba(54,162,235,1)"; break;
    case "pressao": label = "Pressão (hPa)"; cor = "rgba(255,206,86,1)"; break;
  }

  if (inicioInput && fimInput) {
    const dataInicio = `${inicioInput}T00:00:00`;
    const dataFinal = `${fimInput}T23:59:59`;
    url = `http://localhost:8080/${tipo}/intervalo?dataInicio=${encodeURIComponent(dataInicio)}&dataFinal=${encodeURIComponent(dataFinal)}`;
  } else url = `http://localhost:8080/${tipo}/diario`;

  fetch(url)
    .then(res => res.json())
    .then(dados => {
      const labelsChart = dados.map(d => new Date(d.data.replace(" ", "T")).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
      const valores = dados.map(d => d.valor);
      renderChart(labelsChart, valores, label, cor);
    })
    .catch(err => console.error("Erro ao carregar dados:", err));
}

// ====== BOTÃO APLICAR ======
document.getElementById("btn-aplicar").addEventListener("click", () => {
  const inicio = document.getElementById("data-inicio").value;
  const fim = document.getElementById("data-fim").value;

  let tipo = "temperatura";
  if (toggles.hum.checked) tipo = "umidade";
  else if (toggles.press.checked) tipo = "pressao";

  buscarDadosGenerico(tipo, inicio, fim);
});

// ====== AO CARREGAR ======
window.addEventListener("load", () => {
  buscarDadosGenerico("temperatura");
  renderIndicador1();
  renderIndicador2();
  renderIndicador2Variacao();
  carregarMaximosDiarios();
});
