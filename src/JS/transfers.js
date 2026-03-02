
// SELECTING IMPORTANT ELEMENTS

// We store references to HTML elements so we can use them later.
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
// DATA + LOCAL STORAGE
// =============================

// This array holds all transfer rumors.
// The table is always built from this array.
let transfers = [
    { name: "Victor Osimhen", club: "Napoli", position: "ST", age: 25, fee: "£100m", likelihood: 7, source: "Sky Sports" },
    { name: "Frenkie de Jong", club: "Barcelona", position: "MID", age: 26, fee: "£70m", likelihood: 5, source: "The Guardian" },
    { name: "Jarrad Branthwaite", club: "Everton", position: "CB", age: 21, fee: "£60m", likelihood: 8, source: "BBC Sport" }
];

// Try to load saved data from browser storage
// LocalStorage allows data to stay saved even after refresh.
const savedTransfers = localStorage.getItem("transfers");

if (savedTransfers) {
    try {
        const parsed = JSON.parse(savedTransfers);

        // Check that saved data is valid
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].name) {
            transfers = parsed; // Replace default data
        }

    } catch (e) {
        console.error("Invalid localStorage data");
    }
}

// This function saves the transfers array into LocalStorage.
// We convert it into a string using JSON.
function saveToLocalStorage() {
    localStorage.setItem("transfers", JSON.stringify(transfers));
}


// STATE VARIABLES

// These keep track of filters and edit mode.
let activeSort = "none";
let activePosition = "ALL";
let editingIndex = null; // Stores which row is being edited



// LIKELIHOOD SLIDER
// When the slider moves, update the number shown next to it.
likelihoodInput.addEventListener("input", () => {
    likelihoodValue.textContent = likelihoodInput.value;
});


// RENDER TABLE FUNCTION

// This function rebuilds the table every time data changes.
function renderTable() {

    // Clear table first
    tableBody.innerHTML = "";

    // Make a copy of transfers array
    let view = [...transfers];

    // Apply position filter
    if (activePosition !== "ALL") {
        view = view.filter(t => t.position === activePosition);
    }

    // Apply sorting
    if (activeSort === "high-low") {
        view.sort((a, b) => b.likelihood - a.likelihood);
    } else if (activeSort === "low-high") {
        view.sort((a, b) => a.likelihood - b.likelihood);
    } else if (activeSort === "position") {
        view.sort((a, b) => a.position.localeCompare(b.position));
    }

    // Loop through each transfer and create table rows
    view.forEach((transfer) => {

        const realIndex = transfers.indexOf(transfer);

        // If this row is being edited, show input fields
        if (editingIndex === realIndex) {
            renderEditRow(transfer, realIndex);
        } else {
            renderNormalRow(transfer, realIndex);
        }

    });

    updateStats(); // Update summary cards
}

// NORMAL ROW


// Creates a normal table row with Edit and Delete buttons.
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
                <button class="btn btn-sm btn-warning edit-btn" data-index="${index}">Edit</button>
                <button class="btn btn-sm btn-danger delete-btn" data-index="${index}">Delete</button>
            </td>
        </tr>
    `;

    tableBody.insertAdjacentHTML("beforeend", row);
}


// EDIT ROW


// Replaces the row with input fields so user can edit data.
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
            <td><input type="number" class="form-control edit-likelihood" value="${transfer.likelihood}"></td>
            <td><input type="text" class="form-control edit-source" value="${transfer.source}"></td>
            <td>
                <button class="btn btn-sm btn-success save-btn" data-index="${index}">Save</button>
                <button class="btn btn-sm btn-secondary cancel-btn">Cancel</button>
            </td>
        </tr>
    `;

    tableBody.insertAdjacentHTML("beforeend", row);
}


// TABLE BUTTON EVENTS


// We use one click listener for the whole table.
tableBody.addEventListener("click", function (e) {

    const index = parseInt(e.target.dataset.index);

    // DELETE
    if (e.target.classList.contains("delete-btn")) {
        transfers.splice(index, 1); // Remove from array
        saveToLocalStorage();
        renderTable();
    }

    // EDIT
    if (e.target.classList.contains("edit-btn")) {
        editingIndex = index;
        renderTable();
    }

    // CANCEL
    if (e.target.classList.contains("cancel-btn")) {
        editingIndex = null;
        renderTable();
    }

    // SAVE
    if (e.target.classList.contains("save-btn")) {

        const row = e.target.closest("tr");

        const name = row.querySelector(".edit-name").value.trim();
        const club = row.querySelector(".edit-club").value.trim();
        const position = row.querySelector(".edit-position").value;
        const age = parseInt(row.querySelector(".edit-age").value);
        const fee = row.querySelector(".edit-fee").value.trim();
        const likelihood = parseInt(row.querySelector(".edit-likelihood").value);
        const source = row.querySelector(".edit-source").value.trim();

        // Replace old object with new values
        transfers[index] = { name, club, position, age, fee, likelihood, source };

        editingIndex = null;
        saveToLocalStorage();
        renderTable();
    }

});


// ADD NEW TRANSFER


// When form is submitted
form.addEventListener("submit", function (e) {

    e.preventDefault(); // Prevent page reload

    const name = document.querySelector("#playerName").value.trim();
    const club = document.querySelector("#currentClub").value.trim();
    const position = document.querySelector("#position").value;
    const age = parseInt(document.querySelector("#age").value);
    const fee = document.querySelector("#fee").value.trim();
    const source = document.querySelector("#source").value.trim();
    const likelihood = parseInt(likelihoodInput.value);

    // Add new object to array
    transfers.push({ name, club, position, age, fee, likelihood, source });

    saveToLocalStorage();
    renderTable();

    form.reset();
    likelihoodValue.textContent = "5";
});



// FILTER BUTTONS

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


// UPDATE STATISTICS

// Updates summary cards below the table.
function updateStats() {

    totalRumors.textContent = transfers.length;

    veryLikely.textContent =
        transfers.filter(t => t.likelihood >= 8).length;

    const avg = transfers.length > 0
        ? (transfers.reduce((sum, t) => sum + t.likelihood, 0) / transfers.length).toFixed(1)
        : 0;

    avgLikelihood.textContent = avg + "/10";
}



// INITIAL RENDER

renderTable(); // Build table when page loads