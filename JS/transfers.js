// =============================
// SELECTORS
// =============================

const form = document.querySelector("#transferForm");
const tableBody = document.querySelector("#transferTableBody");
const likelihoodInput = document.querySelector("#likelihood");
const likelihoodValue = document.querySelector("#likelihoodValue");

const totalRumors = document.querySelector("#totalRumors");
const veryLikely = document.querySelector("#veryLikely");
const avgLikelihood = document.querySelector("#avgLikelihood");

const sortSelect = document.querySelector("#sortSelect");
const positionFilter = document.querySelector("#positionFilter");
const applyFiltersBtn = document.querySelector("#applyFiltersBtn");
const clearFiltersBtn = document.querySelector("#clearFiltersBtn");

// =============================
// DEFAULT DATA (Your examples stay)
// =============================

let transfers = [
    { name: "Victor Osimhen", club: "Napoli", position: "ST", age: 25, fee: "£100m", likelihood: 7, source: "Sky Sports" },
    { name: "Frenkie de Jong", club: "Barcelona", position: "MID", age: 26, fee: "£70m", likelihood: 5, source: "The Guardian" },
    { name: "Jarrad Branthwaite", club: "Everton", position: "CB", age: 21, fee: "£60m", likelihood: 8, source: "BBC Sport" }
];

// =============================
// LOAD FROM LOCAL STORAGE (SAFE)
// =============================

const savedTransfers = localStorage.getItem("transfers");

if (savedTransfers) {
    try {
        const parsed = JSON.parse(savedTransfers);

        if (
            Array.isArray(parsed) &&
            parsed.length > 0 &&
            parsed[0].name &&
            parsed[0].club
        ) {
            transfers = parsed;
        }
    } catch (err) {
        console.warn("Invalid localStorage data — using default examples.");
    }
}

let activeSort = "none";
let activePosition = "ALL";

// =============================
// SAVE FUNCTION
// =============================

function saveTransfers() {
    localStorage.setItem("transfers", JSON.stringify(transfers));
}

// =============================
// SLIDER
// =============================

likelihoodInput.addEventListener("input", () => {
    likelihoodValue.textContent = likelihoodInput.value;
});

// =============================
// RENDER TABLE
// =============================

function renderTable() {
    tableBody.innerHTML = "";

    let view = [...transfers];

    if (activePosition !== "ALL") {
        view = view.filter(t => t.position === activePosition);
    }

    if (activeSort === "high-low") {
        view.sort((a, b) => b.likelihood - a.likelihood);
    } else if (activeSort === "low-high") {
        view.sort((a, b) => a.likelihood - b.likelihood);
    } else if (activeSort === "position") {
        view.sort((a, b) => a.position.localeCompare(b.position));
    }

    view.forEach((transfer) => {

        const realIndex = transfers.indexOf(transfer);

        const row = `
            <tr>
                <td>${transfer.name}</td>
                <td>${transfer.club}</td>
                <td><span class="badge bg-secondary">${transfer.position}</span></td>
                <td>${transfer.age}</td>
                <td>${transfer.fee}</td>
                <td><span class="badge bg-danger">${transfer.likelihood}/10</span></td>
                <td>${transfer.source}</td>
                <td>
                    <button class="btn btn-sm btn-danger delete-btn" data-index="${realIndex}">
                        Delete
                    </button>
                </td>
            </tr>
        `;

        tableBody.insertAdjacentHTML("beforeend", row);
    });

    attachDeleteListeners();
    updateStats();
}

// =============================
// DELETE
// =============================

function attachDeleteListeners() {
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", () => {
            const index = parseInt(button.dataset.index);
            transfers.splice(index, 1);
            saveTransfers(); // Save after delete
            renderTable();
        });
    });
}

// =============================
// STATS
// =============================

function updateStats() {
    totalRumors.textContent = transfers.length;
    veryLikely.textContent = transfers.filter(t => t.likelihood >= 8).length;

    const avg = transfers.length > 0
        ? (transfers.reduce((sum, t) => sum + t.likelihood, 0) / transfers.length).toFixed(1)
        : 0;

    avgLikelihood.textContent = avg + "/10";
}

// =============================
// VALIDATION + FORM SUBMIT
// =============================

form.addEventListener("submit", function (e) {

    e.preventDefault();
    let isValid = true;

    const nameInput = document.querySelector("#playerName");
    const clubInput = document.querySelector("#currentClub");
    const positionInput = document.querySelector("#position");
    const ageInput = document.querySelector("#age");
    const feeInput = document.querySelector("#fee");
    const sourceInput = document.querySelector("#source");

    const name = nameInput.value.trim();
    const club = clubInput.value.trim();
    const position = positionInput.value;
    const age = parseInt(ageInput.value);
    const fee = feeInput.value.trim();
    const source = sourceInput.value.trim();
    const likelihood = parseInt(likelihoodInput.value);

    form.querySelectorAll(".form-control, .form-select").forEach(input => {
        input.classList.remove("is-invalid");
    });

    if (name.length < 3) {
        nameInput.classList.add("is-invalid");
        isValid = false;
    }

    if (club.length < 2) {
        clubInput.classList.add("is-invalid");
        isValid = false;
    }

    if (!position) {
        positionInput.classList.add("is-invalid");
        isValid = false;
    }

    if (isNaN(age) || age < 16 || age > 45) {
        ageInput.classList.add("is-invalid");
        isValid = false;
    }

    const feePattern = /^£\d+/;
    if (!feePattern.test(fee)) {
        feeInput.classList.add("is-invalid");
        isValid = false;
    }

    if (source.length < 3) {
        sourceInput.classList.add("is-invalid");
        isValid = false;
    }

    if (!isValid) return;

    transfers.push({ name, club, position, age, fee, likelihood, source });

    saveTransfers(); // Save after add

    form.reset();
    likelihoodValue.textContent = "5";
    likelihoodInput.value = "5";

    renderTable();
});

// =============================
// APPLY / CLEAR
// =============================

applyFiltersBtn.addEventListener("click", () => {
    activeSort = sortSelect.value;
    activePosition = positionFilter.value;
    renderTable();
});

clearFiltersBtn.addEventListener("click", () => {
    sortSelect.value = "none";
    positionFilter.value = "ALL";
    activeSort = "none";
    activePosition = "ALL";
    renderTable();
});

// =============================
// INIT
// =============================

renderTable();