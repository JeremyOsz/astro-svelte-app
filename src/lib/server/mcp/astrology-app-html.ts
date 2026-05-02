export const ASTROLOGY_APP_RESOURCE_URI = 'ui://astrology-suite/app.html';

export function renderAstrologyAppHtml(): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>OsztrOlogy MCP App</title>
  <style>
    :root {
      color-scheme: light dark;
      --bg: #f8fafc;
      --panel: #ffffff;
      --panel-2: #eef2f7;
      --text: #111827;
      --muted: #64748b;
      --line: #d7dde8;
      --accent: #7c3aed;
      --accent-2: #0f766e;
      --hard: #dc2626;
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --bg: #0b1020;
        --panel: #111827;
        --panel-2: #1f2937;
        --text: #f8fafc;
        --muted: #a9b4c3;
        --line: #334155;
        --accent: #a78bfa;
        --accent-2: #5eead4;
        --hard: #fb7185;
      }
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      background: var(--bg);
      color: var(--text);
      min-width: 0;
    }
    main {
      width: 100%;
      max-width: 1040px;
      margin: 0 auto;
      padding: 16px;
    }
    .layout {
      display: grid;
      grid-template-columns: minmax(280px, 420px) minmax(280px, 1fr);
      gap: 16px;
      align-items: start;
    }
    .panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 8px;
      padding: 14px;
    }
    h1, h2, h3 { margin: 0; letter-spacing: 0; }
    h1 { font-size: 18px; line-height: 1.25; }
    h2 { font-size: 15px; line-height: 1.3; margin-bottom: 10px; }
    h3 { font-size: 13px; color: var(--muted); margin-bottom: 8px; text-transform: uppercase; }
    p { margin: 0; line-height: 1.55; }
    .muted { color: var(--muted); }
    .stack { display: grid; gap: 12px; }
    .meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 10px;
    }
    .chip {
      border: 1px solid var(--line);
      background: var(--panel-2);
      border-radius: 999px;
      padding: 4px 8px;
      font-size: 12px;
      color: var(--text);
    }
    .chart-wrap {
      aspect-ratio: 1;
      width: 100%;
      min-width: 260px;
    }
    svg { display: block; width: 100%; height: 100%; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 8px;
    }
    .item {
      border: 1px solid var(--line);
      background: color-mix(in srgb, var(--panel) 82%, var(--panel-2));
      border-radius: 8px;
      padding: 10px;
      min-width: 0;
    }
    .item strong { display: block; font-size: 13px; margin-bottom: 4px; }
    .item span { color: var(--muted); font-size: 13px; }
    button {
      appearance: none;
      border: 1px solid var(--line);
      background: var(--panel-2);
      color: var(--text);
      border-radius: 6px;
      padding: 8px 10px;
      font: inherit;
      font-size: 13px;
      cursor: pointer;
    }
    button:hover { border-color: var(--accent); }
    @media (max-width: 780px) {
      main { padding: 12px; }
      .layout { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <main>
    <div class="stack">
      <section class="panel">
        <h1 id="title">OsztrOlogy</h1>
        <p id="subtitle" class="muted">Waiting for astrology data from ChatGPT.</p>
        <div id="meta" class="meta"></div>
      </section>
      <section class="layout">
        <div class="panel">
          <h2>Chart</h2>
          <div id="chart" class="chart-wrap"></div>
        </div>
        <div class="panel stack">
          <div>
            <h2>Astrology Information</h2>
            <div id="summary" class="stack"></div>
          </div>
          <div>
            <h2>Details</h2>
            <div id="details" class="grid"></div>
          </div>
          <div>
            <button id="context-button" type="button">Send selected chart context</button>
          </div>
        </div>
      </section>
    </div>
  </main>
  <script>
    const signs = ["Aries","Taurus","Gemini","Cancer","Leo","Virgo","Libra","Scorpio","Sagittarius","Capricorn","Aquarius","Pisces"];
    const symbols = { Aries: "Ar", Taurus: "Ta", Gemini: "Ge", Cancer: "Ca", Leo: "Le", Virgo: "Vi", Libra: "Li", Scorpio: "Sc", Sagittarius: "Sg", Capricorn: "Cp", Aquarius: "Aq", Pisces: "Pi" };
    const planetSymbols = { Sun: "☉", Moon: "☽", Mercury: "☿", Venus: "♀", Mars: "♂", Jupiter: "♃", Saturn: "♄", Uranus: "♅", Neptune: "♆", Pluto: "♇", Node: "☊", Chiron: "⚷", ASC: "AC", MC: "MC" };
    let currentData = null;

    function parseChartData(chartData) {
      if (!chartData) return [];
      return chartData.split("\\n").map((line) => line.trim()).filter((line) => line && line[0] !== "#").map((line) => {
        const parts = line.split(",").map((part) => part.trim());
        const match = parts[2] && parts[2].match(/^(\\d+)°(\\d+)'$/);
        if (!parts[0] || !parts[1] || !match) return null;
        const degree = Number(match[1]);
        const minute = Number(match[2]);
        const signIndex = signs.indexOf(parts[1]);
        const longitude = signIndex * 30 + degree + minute / 60;
        return { planet: parts[0], sign: parts[1], degree, minute, longitude, house: parts.find((part) => /^\\d+$/.test(part)) || "", retrograde: parts.includes("R") };
      }).filter(Boolean);
    }

    function polar(cx, cy, radius, angle) {
      const radians = (angle - 90) * Math.PI / 180;
      return { x: cx + radius * Math.cos(radians), y: cy + radius * Math.sin(radians) };
    }

    function drawChart(chartData) {
      const placements = parseChartData(chartData);
      const chart = document.getElementById("chart");
      if (!placements.length) {
        chart.innerHTML = '<p class="muted">No wheel data available for this result.</p>';
        return;
      }
      const size = 520;
      const cx = 260;
      const cy = 260;
      const outer = 238;
      const inner = 178;
      const planetR = 136;
      let svg = '<svg viewBox="0 0 520 520" role="img" aria-label="Astrology chart wheel">';
      svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + outer + '" fill="none" stroke="var(--line)" stroke-width="2"/>';
      svg += '<circle cx="' + cx + '" cy="' + cy + '" r="' + inner + '" fill="none" stroke="var(--line)" stroke-width="1"/>';
      for (let i = 0; i < 12; i++) {
        const angle = i * 30;
        const a = polar(cx, cy, outer, angle);
        const b = polar(cx, cy, inner, angle);
        const label = polar(cx, cy, 209, angle + 15);
        svg += '<line x1="' + a.x + '" y1="' + a.y + '" x2="' + b.x + '" y2="' + b.y + '" stroke="var(--line)" stroke-width="1"/>';
        svg += '<text x="' + label.x + '" y="' + label.y + '" text-anchor="middle" dominant-baseline="middle" fill="var(--muted)" font-size="12">' + (symbols[signs[i]] || signs[i].slice(0, 2)) + '</text>';
      }
      placements.forEach((placement, index) => {
        const point = polar(cx, cy, planetR - (index % 3) * 16, placement.longitude);
        const label = planetSymbols[placement.planet] || placement.planet.slice(0, 2);
        svg += '<circle cx="' + point.x + '" cy="' + point.y + '" r="13" fill="var(--panel)" stroke="var(--accent)" stroke-width="1.5"/>';
        svg += '<text x="' + point.x + '" y="' + point.y + '" text-anchor="middle" dominant-baseline="middle" fill="var(--text)" font-size="11">' + label + '</text>';
      });
      svg += '<circle cx="' + cx + '" cy="' + cy + '" r="4" fill="var(--accent)"/>';
      svg += '</svg>';
      chart.innerHTML = svg;
    }

    function setText(id, text) {
      document.getElementById(id).textContent = text || "";
    }

    function renderList(id, items, formatter) {
      const target = document.getElementById(id);
      target.innerHTML = "";
      (items || []).forEach((item) => {
        const rendered = formatter(item);
        const node = document.createElement("div");
        node.className = "item";
        node.innerHTML = rendered;
        target.appendChild(node);
      });
    }

    function render(data) {
      currentData = data;
      const kind = data && data.kind ? data.kind : "unknown";
      setText("title", data && data.title ? data.title : "OsztrOlogy");
      setText("subtitle", data && data.subtitle ? data.subtitle : "Astrology result");
      document.getElementById("meta").innerHTML = "";
      [kind, data && data.house_system, data && data.date].filter(Boolean).forEach((value) => {
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.textContent = value;
        document.getElementById("meta").appendChild(chip);
      });
      drawChart(data && (data.chartData || data.natalChartData || data.person1ChartData));
      const summary = document.getElementById("summary");
      summary.innerHTML = "";
      (data && data.summary ? data.summary : []).forEach((text) => {
        const p = document.createElement("p");
        p.textContent = text;
        summary.appendChild(p);
      });
      const placements = parseChartData(data && (data.chartData || data.natalChartData || data.person1ChartData)).slice(0, 12);
      if (kind === "synastry") {
        renderList("details", data.aspects || [], (item) => '<strong>' + item.person1Planet + ' ' + item.aspect + ' ' + item.person2Planet + '</strong><span>Orb ' + item.orb + '°</span>');
      } else if (kind === "daily_horoscope") {
        const details = (data.highlights || []).map((text) => ({ title: "Highlight", text }));
        renderList("details", details, (item) => '<strong>' + item.title + '</strong><span>' + item.text + '</span>');
      } else {
        renderList("details", placements, (item) => '<strong>' + item.planet + ' in ' + item.sign + '</strong><span>' + item.degree + '°' + String(item.minute).padStart(2, "0") + "' house " + (item.house || "n/a") + (item.retrograde ? " retrograde" : "") + '</span>');
      }
    }

    window.addEventListener("message", (event) => {
      if (event.source !== window.parent) return;
      const message = event.data;
      if (!message || message.jsonrpc !== "2.0") return;
      if (message.method === "ui/notifications/tool-result") {
        render(message.params && message.params.structuredContent ? message.params.structuredContent : {});
      }
    }, { passive: true });

    document.getElementById("context-button").addEventListener("click", () => {
      if (!currentData) return;
      window.parent.postMessage({
        jsonrpc: "2.0",
        method: "ui/message",
        params: {
          role: "user",
          content: [{ type: "text", text: "Use this astrology app result as context and explain the strongest patterns: " + JSON.stringify({ kind: currentData.kind, title: currentData.title, summary: currentData.summary }) }]
        }
      }, "*");
    });
  </script>
</body>
</html>`;
}
