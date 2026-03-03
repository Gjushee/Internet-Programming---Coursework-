// Wait until the HTML page is fully loaded before running the code

document.addEventListener("DOMContentLoaded", function () {

  // Select the table body where rows will be added
  const tableBody = document.querySelector("#pl-table tbody");

  // Show a temporary loading message while the API data is being fetched
  tableBody.innerHTML = `
    <tr>
      <td colspan="5">Loading table...</td>
    </tr>
  `;

  // Fetch Premier League table data from the API
  fetch("https://www.thesportsdb.com/api/v1/json/3/lookuptable.php?l=4328&s=2025-2026")

    // Convert the response to JSON format
    .then((response) => response.json())

    // Work with the returned data
    .then((data) => {

      // Clear the loading message
      tableBody.innerHTML = "";

      // If no table data exists, show a message
      if (!data.table || data.table.length === 0) {
        tableBody.innerHTML = `
          <tr>
            <td colspan="5">Table data not available for this season yet.</td>
          </tr>
        `;
        return; // Stop the function here
      }

      // Loop through each team in the table
      data.table.forEach((team) => {

        // Create a new row element
        const row = document.createElement("tr");

        // Highlight Manchester United row
        if (team.strTeam === "Manchester United") {
          row.classList.add("highlight-row");
        }

        // Convert API string values into numbers
        const played = toNum(team.intPlayed);
        const wins = toNum(team.intWin);
        const draws = toNum(team.intDraw);
        const losses = toNum(team.intLoss);

        // Generate a visual "last 5 matches" display
        const formHTML = generateLast5Form({ played, wins, draws, losses });

        // Insert team data into the row
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

        // Add the row to the table
        tableBody.appendChild(row);
      });
    })

    // If the API request fails, show an error message
    .catch((error) => {
      console.error("Error fetching table:", error);

      tableBody.innerHTML = `
        <tr>
          <td colspan="5">Error loading table. Please try again later.</td>
        </tr>
      `;
    });
});


// This function converts a data into a number
// If the data is not valid, it returns 0 instead
function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}


// This function creates 5 small circles (W, D, L)
// It estimates the last 5 matches based on season statistics
function generateLast5Form({ played, wins, draws, losses }) {

  // If no matches have been played yet
  if (!played || played <= 0) {
    return `<span class="text-muted">N/A</span>`;
  }

  // Calculate approx wins and draws out of 5 matches
  let wCount = Math.round((wins / played) * 5);
  let dCount = Math.round((draws / played) * 5);

  // Make sure total does not go above 5
  if (wCount + dCount > 5) {
    dCount = Math.max(0, 5 - wCount);
  }

  // Remaining matches are losses
  let lCount = 5 - (wCount + dCount);

  // Create an array containing W, D, L values
  const arr = [
    ...Array(wCount).fill("W"),
    ...Array(dCount).fill("D"),
    ...Array(lCount).fill("L"),
  ];

  // Shuffle the order so it looks more realistic
  shuffle(arr);

  // Convert each result into a colored circle
  return arr
    .map((r) => {
      if (r === "W") return `<span class="form-circle win">W</span>`;
      if (r === "D") return `<span class="form-circle draw">D</span>`;
      return `<span class="form-circle loss">L</span>`;
    })
    .join("");
}


// This function randomly rearranges items inside an array
// It is used to mix up the W/D/L results
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [array[i], array[j]] = [array[j], array[i]];
  }
}