// ================= CREATE RATING BUTTONS =================

// This function creates rating buttons from 1 to 10.
// Instead of writing 10 buttons in HTML for every player,
// we generate them automatically using a loop.
function createRatingButtons() {

    let html = '<div class="btn-group flex-wrap">';

    // Loop from 1 to 10 to create buttons
    for (let i = 1; i <= 10; i++) {
        html += `<button class="btn rating-btn">${i}</button>`;
    }

    html += '</div>';

    return html; // Return the generated buttons as HTML
}

// Insert the generated rating buttons into every player card
// We find all elements with class "rating-buttons"
document.querySelectorAll(".rating-buttons").forEach(container => {
    container.innerHTML = createRatingButtons();
});


// ================= CLICK HANDLER =================

// We listen for all click events on the page.
// This is called "event delegation".
// It allows us to handle clicks for many buttons in one place.
document.addEventListener("click", function (e) {

    // ================= RATING BUTTON CLICK =================

    // Check if the clicked element has class "rating-btn"
    if (e.target.classList.contains("rating-btn")) {

        // Find the group of buttons inside the same player card
        const group = e.target.closest(".rating-buttons");

        // Remove "rating-selected" class from all buttons in that group
        group.querySelectorAll(".rating-btn").forEach(btn => {
            btn.classList.remove("rating-selected");
        });

        // Add "rating-selected" to the clicked button
        e.target.classList.add("rating-selected");
    }


    // ================= MOTM BUTTON CLICK =================

    // Check if the clicked element is inside a MOTM button
    if (e.target.closest(".motm-btn")) {

        // Reset all MOTM buttons first
        document.querySelectorAll(".motm-btn").forEach(btn => {

            btn.classList.remove("btn-warning");
            btn.classList.add("btn-light");

            // Change filled star back to empty star
            const icon = btn.querySelector("i");
            icon.classList.remove("bi-star-fill");
            icon.classList.add("bi-star");
        });

        // Select the clicked MOTM button
        const selectedBtn = e.target.closest(".motm-btn");

        selectedBtn.classList.remove("btn-light");
        selectedBtn.classList.add("btn-warning");

        // Change star icon to filled version
        const star = selectedBtn.querySelector("i");
        star.classList.remove("bi-star");
        star.classList.add("bi-star-fill");
    }
});


// ================= RESET FUNCTION =================

// We store the chart in a variable so we can remove it later
let chart;

// When reset button is clicked
$("#reset-ratings").click(function () {

    // Remove selected ratings
    $(".rating-btn").removeClass("rating-selected");

    // Reset MOTM button styling
    $(".motm-btn")
        .removeClass("btn-warning")
        .addClass("btn-light");

    // Reset star icons
    $(".motm-btn i")
        .removeClass("bi-star-fill")
        .addClass("bi-star");

    // Reset average display
    $("#average-rating").text("0");

    // Clear MOTM display
    $("#motm-display").text("");

    // Show "No ratings yet" message again
    $("#no-data-message").show();

    // Destroy chart if it exists
    if (chart) {
        chart.destroy();
    }
});


// ================= SUBMIT RATINGS =================

// When submit button is clicked
$("#submit-ratings").click(function () {

    let ratings = [];

    // Loop through each player's rating buttons
    $(".rating-buttons").each(function () {

        // Find selected rating inside this player card
        const selected = $(this).find(".rating-selected").text();

        // If a rating was selected, add it to array
        if (selected) {
            ratings.push(parseInt(selected));
        }
    });

    // If no ratings were selected
    if (ratings.length === 0) {

        // Show message
        $("#no-data-message").text("No ratings yet.").show();

        // Remove existing chart if present
        if (chart) chart.destroy();

        return; // Stop here
    }

    // Hide "No ratings" message
    $("#no-data-message").hide();


    // ================= CALCULATE DISTRIBUTION =================

    // Create array with 10 positions (for ratings 1–10)
    let distribution = new Array(10).fill(0);

    // Count how many times each rating was selected
    ratings.forEach(rating => {
        distribution[rating - 1]++;
    });


    // ================= CALCULATE AVERAGE =================

    const sum = ratings.reduce((a, b) => a + b, 0);

    const average = (sum / ratings.length).toFixed(2);

    // Display average rating
    $("#average-rating").text(average);


    // ================= FIND MOTM =================

    let motmPlayer = "";

    // Loop through MOTM buttons
    $(".motm-btn").each(function () {

        // Check if this one is selected
        if ($(this).hasClass("btn-warning")) {

            // Get the player name from same card
            motmPlayer = $(this)
                .closest(".card")
                .find("h5, h6")
                .first()
                .text();
        }
    });

    // Display selected MOTM
    if (motmPlayer) {
        $("#motm-display").text("Your MOTM – " + motmPlayer);
    } else {
        $("#motm-display").text("No MOTM selected.");
    }


    // ================= CREATE BAR CHART =================

    // Destroy old chart before creating a new one
    if (chart) {
        chart.destroy();
    }

    // Get canvas context
    const ctx = document.getElementById("ratingsChart").getContext("2d");

    // Create new Chart.js bar chart
    chart = new Chart(ctx, {
        type: "bar",

        data: {
            labels: ["1","2","3","4","5","6","7","8","9","10"],
            datasets: [{
                label: "Number of Players",
                data: distribution,

                // Change bar color depending on dark mode
                backgroundColor: document.body.classList.contains("dark-mode")
                    ? "#22c55e"
                    : "#dc3545"
            }]
        },

        options: {
            responsive: true,

            plugins: {
                legend: {
                    labels: {
                        color: document.body.classList.contains("dark-mode")
                            ? "white"
                            : "black"
                    }
                }
            },

            scales: {
                x: {
                    ticks: {
                        color: document.body.classList.contains("dark-mode")
                            ? "white"
                            : "black"
                    }
                },
                y: {
                    ticks: {
                        color: document.body.classList.contains("dark-mode")
                            ? "white"
                            : "black"
                    }
                }
            }
        }
    });
});