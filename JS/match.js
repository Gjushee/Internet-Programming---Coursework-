// Generate 1-10 rating buttons
function createRatingButtons() {
    let html = '<div class="btn-group flex-wrap">';
    for (let i = 1; i <= 10; i++) {
        html += `<button class="btn btn-outline-danger rating-btn">${i}</button>`;
    }
    html += '</div>';
    return html;
}

// Insert rating buttons into every player card
document.querySelectorAll(".rating-buttons").forEach(container => {
    container.innerHTML = createRatingButtons();
});

// Handle clicks (ratings + MOTM)
document.addEventListener("click", function (e) {

    // Rating highlight
    if (e.target.classList.contains("rating-btn")) {
        const group = e.target.closest(".rating-buttons");

        group.querySelectorAll(".rating-btn").forEach(btn => {
            btn.classList.remove("btn-dark");
            btn.classList.add("btn-outline-light");
        });

        e.target.classList.remove("btn-outline-light");
        e.target.classList.add("btn-dark");
    }

    // Only ONE Man of the Match
    if (e.target.closest(".motm-btn")) {
        document.querySelectorAll(".motm-btn i").forEach(icon => {
            icon.classList.remove("bi-star-fill");
            icon.classList.add("bi-star");
        });

        const star = e.target.closest(".motm-btn").querySelector("i");
        star.classList.remove("bi-star");
        star.classList.add("bi-star-fill");
    }
});

// ================= RESET FUNCTION (jQuery) =================

$("#reset-ratings").click(function () {

    // Reset rating buttons
    $(".rating-btn").removeClass("btn-dark")
                    .addClass("btn-outline-light");

    // Reset Man of the Match star
    $(".motm-btn i")
        .removeClass("bi-star-fill")
        .addClass("bi-star");
});


// ================= SUBMIT RATINGS =================

let chart; // store chart instance

$("#submit-ratings").click(function () {

    let ratings = [];

    // Collect selected ratings
    $(".rating-buttons").each(function () {

        const selected = $(this).find(".btn-dark").text();

        if (selected) {
            ratings.push(parseInt(selected));
        }
    });

    if (ratings.length === 0) {
        alert("Please select at least one rating.");
        return;
    }

    // Count ratings distribution (1-10)
    let distribution = new Array(10).fill(0);

    ratings.forEach(rating => {
        distribution[rating - 1]++;
    });

    // Calculate average
    const sum = ratings.reduce((a, b) => a + b, 0);
    const average = (sum / ratings.length).toFixed(2);

    $("#average-rating").text(average);

    // Destroy old chart if exists
    if (chart) {
        chart.destroy();
    }

    // Create new chart
    const ctx = document.getElementById("ratingsChart").getContext("2d");

    chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["1","2","3","4","5","6","7","8","9","10"],
            datasets: [{
                label: "Number of Players",
                data: distribution,
                backgroundColor: "#dc3545"
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: "white"
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: "white" }
                },
                y: {
                    ticks: { color: "white" }
                }
            }
        }
    });

});
