document.addEventListener("DOMContentLoaded", function () {

    const toggleBtn = document.querySelector("#darkModeToggle");

    // Load saved preference
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        toggleBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';
    }

    toggleBtn.addEventListener("click", function () {

        document.body.classList.toggle("dark-mode");

        if (document.body.classList.contains("dark-mode")) {
            localStorage.setItem("darkMode", "enabled");
            toggleBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';
        } else {
            localStorage.setItem("darkMode", "disabled");
            toggleBtn.innerHTML = '<i class="bi bi-moon-fill"></i>';
        }

    });

});