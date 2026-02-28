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
// DATA (with LocalStorage support)
// =============================

let transfers = [
    { name: "Victor Osimhen", club: "Napoli", position: "ST", age: 25, fee: "£100m", likelihood: 7, source: "Sky Sports" },
    { name: "Frenkie de Jong", club: "Barcelona", position: "MID", age: 26, fee: "£70m", likelihood: 5, source: "The Guardian" },
    { name: "Jarrad Branthwaite", club: "Everton", position: "CB", age: 21, fee: "£60m", likelihood: 8, source: "BBC Sport" }
];

const savedTransfers = localStorage.getItem("transfers");

if (savedTransfers) {
    try {
        const parsed = JSON.parse(savedTransfers);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name) {
            transfers = parsed;
        }
    } catch (e) {
        console.error("Invalid localStorage data");
    }
}

function saveToLocalStorage() {
    localStorage.setItem("transfers", JSON.stringify(transfers));
}

let activeSort = "none";
let activePosition = "ALL";
let editingIndex = null;

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

        if (editingIndex === realIndex) {
            renderEditRow(transfer, realIndex);
        } else {
            renderNormalRow(transfer, realIndex);
        }

    });

    updateStats();
}

// =============================
// NORMAL ROW
// =============================

function renderNormalRow(transfer, index) {

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
                <button class="btn btn-sm btn-warning edit-btn" data-index="${index}">
                    Edit
                </button>
                <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">
                    Delete
                </button>
            </td>
        </tr>
    `;

    tableBody.insertAdjacentHTML("beforeend", row);
}

// =============================
// EDIT ROW
// =============================

function renderEditRow(transfer, index) {

    const row = `
        <tr>
            <td><input type="text" class="form-control edit-name" value="${transfer.name}"></td>
            <td><input type="text" class="form-control edit-club" value="${transfer.club}"></td>
            <td>
                <select class="form-select edit-position">
                    <option ${transfer.position === "GK" ? "selected" : ""}>GK</option>
                    <option ${transfer.position === "CB" ? "selected" : ""}>CB</option>
                    <option ${transfer.position === "MID" ? "selected" : ""}>MID</option>
                    <option ${transfer.position === "ST" ? "selected" : ""}>ST</option>
                </select>
            </td>
            <td><input type="number" class="form-control edit-age" value="${transfer.age}"></td>
            <td><input type="text" class="form-control edit-fee" value="${transfer.fee}"></td>
            <td><input type="number" class="form-control edit-likelihood" min="1" max="10" value="${transfer.likelihood}"></td>
            <td><input type="text" class="form-control edit-source" value="${transfer.source}"></td>
            <td>
                <button class="btn btn-sm btn-success save-btn" data-index="${index}">Save</button>
                <button class="btn btn-sm btn-secondary cancel-btn">Cancel</button>
            </td>
        </tr>
    `;

    tableBody.insertAdjacentHTML("beforeend", row);
}

// =============================
// TABLE CLICK EVENTS (Edit/Delete/Save)
// =============================

tableBody.addEventListener("click", function (e) {

    const index = parseInt(e.target.dataset.index);

    if (e.target.classList.contains("delete-btn")) {
        transfers.splice(index, 1);
        saveToLocalStorage();
        renderTable();
    }

    if (e.target.classList.contains("edit-btn")) {
        editingIndex = index;
        renderTable();
    }

    if (e.target.classList.contains("cancel-btn")) {
        editingIndex = null;
        renderTable();
    }

    if (e.target.classList.contains("save-btn")) {

        const row = e.target.closest("tr");

        const name = row.querySelector(".edit-name").value.trim();
        const club = row.querySelector(".edit-club").value.trim();
        const position = row.querySelector(".edit-position").value;
        const age = parseInt(row.querySelector(".edit-age").value);
        const fee = row.querySelector(".edit-fee").value.trim();
        const likelihood = parseInt(row.querySelector(".edit-likelihood").value);
        const source = row.querySelector(".edit-source").value.trim();

        if (name.length < 3) return alert("Name must be at least 3 characters.");
        if (club.length < 2) return alert("Club must be valid.");
        if (isNaN(age) || age < 16 || age > 45) return alert("Age must be between 16 and 45.");
        if (!/^£\d+/.test(fee)) return alert("Fee must start with £ and contain number.");
        if (isNaN(likelihood) || likelihood < 1 || likelihood > 10) return alert("Likelihood 1-10 only.");
        if (source.length < 3) return alert("Source too short.");

        transfers[index] = { name, club, position, age, fee, likelihood, source };

        editingIndex = null;
        saveToLocalStorage();
        renderTable();
    }

});

// =============================
// ADD NEW TRANSFER
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

    if (!/^£\d+/.test(fee)) {
        feeInput.classList.add("is-invalid");
        isValid = false;
    }

    if (source.length < 3) {
        sourceInput.classList.add("is-invalid");
        isValid = false;
    }

    if (!isValid) return;

    transfers.push({ name, club, position, age, fee, likelihood, source });

    saveToLocalStorage();
    renderTable();

    form.reset();
    likelihoodInput.value = "5";
    likelihoodValue.textContent = "5";

});

// =============================
// FILTERS
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
renderTable();