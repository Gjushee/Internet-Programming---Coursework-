document.addEventListener("DOMContentLoaded", function () {
  const tableBody = document.querySelector("#pl-table tbody");

  tableBody.innerHTML = `
    <tr>
      <td colspan="5">Loading table...</td>
    </tr>
  `;

  fetch("https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=4328&s=2025-2026")
    .then((response) => response.json())
    .then((data) => {
      tableBody.innerHTML = "";

      if (!data.table || data.table.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="5">Table data not available for this season yet.</td>
          </tr>
        `;
        return;
      }

      data.table.forEach((team) => {
        const row = document.createElement("tr");

        // Highlight Manchester United
        if (team.strTeam === "Manchester United") {
          row.classList.add("highlight-row");
        }

        // Safely parse numbers (API often returns strings)
        const played = toNum(team.intPlayed);
        const wins = toNum(team.intWin);
        const draws = toNum(team.intDraw);
        const losses = toNum(team.intLoss);

        // Generate a "last 5" form approximation based on ratio
        const formHTML = generateLast5Form({ played, wins, draws, losses });

        row.innerHTML = `
          <td>${team.intRank ?? "-"}</td>

          <td class="text-start align-middle">
            <img src="${team.strBadge ?? ""}"
                 alt="${team.strTeam ?? "Club"}"
                 class="club-logo me-2">
            ${team.strTeam ?? "Unknown"}
          </td>

          <td>${team.intPlayed ?? "-"}</td>
          <td>${team.intPoints ?? "-"}</td>

          <td class="align-middle">${formHTML}</td>
        `;

        tableBody.appendChild(row);
      });
    })
    .catch((error) => {
      console.error("Error fetching table:", error);

      tableBody.innerHTML = `
        <tr>
          <td colspan="5">Error loading table. Please try again later.</td>
        </tr>
      `;
    });
});

// ---- Helpers ----
function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

// Creates 5 circles based on season win/draw/loss ratios (approx)
function generateLast5Form({ played, wins, draws, losses }) {
  // If API doesn't provide meaningful data yet
  if (!played || played <= 0) {
    return `<span class="text-muted">N/A</span>`;
  }

  // Convert ratios to counts out of 5
  let wCount = Math.round((wins / played) * 5);
  let dCount = Math.round((draws / played) * 5);

  // Ensure total = 5
  if (wCount + dCount > 5) {
    dCount = Math.max(0, 5 - wCount);
  }
  let lCount = 5 - (wCount + dCount);

  // Build array (then shuffle so it doesn't always look like WWWDD)
  const arr = [
    ...Array(wCount).fill("W"),
    ...Array(dCount).fill("D"),
    ...Array(lCount).fill("L"),
  ];

  shuffle(arr);

  // Render circles
  return arr
    .map((r) => {
      if (r === "W") return `<span class="form-circle win">W</span>`;
      if (r === "D") return `<span class="form-circle draw">D</span>`;
      return `<span class="form-circle loss">L</span>`;
    })
    .join("");
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}