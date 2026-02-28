document.addEventListener("DOMContentLoaded", function () {

    const footerHTML = `
    <footer class="main-footer py-5">
        <div class="container">
            <div class="row">

                <!-- LEFT COLUMN -->
                <div class="col-md-4 mb-4 text-start">
                    <div class="d-flex align-items-center mb-3">
                        <img src="assets/logo1.png"
                             alt="Red Devils Hub Logo"
                             class="footer-logo me-3">
                        <h5 class="text-white fw-bold mb-0">Red Devils Hub</h5>
                    </div>

                    <p class="text-white mb-2">
                        Your ultimate destination for Manchester United match ratings,
                        transfer news, and predictions.
                    </p>
                </div>

                <!-- MIDDLE COLUMN -->
                <div class="col-md-4 mb-4 text-center">
                    <h5 class="text-white fw-bold mb-3">Quick Links</h5>
                    <ul class="list-unstyled">
                        <li><a href="index.html" class="footer-link">Home</a></li>
                        <li><a href="match.html" class="footer-link">Match Center</a></li>
                        <li><a href="transfers.html" class="footer-link">Transfer Meter</a></li>
                        <li><a href="about.html" class="footer-link">About Us</a></li>
                        <li><a href="contact.html" class="footer-link">Contact</a></li>
                    </ul>
                </div>

                <!-- RIGHT COLUMN -->
                <div class="col-md-4 mb-4 text-md-end text-center">
                    <h5 class="text-white fw-bold mb-3">Connect With Us</h5>

                    <p class="text-white mb-3">
                        <i class="bi bi-envelope me-2"></i>
                        info@reddevilshub.com
                    </p>

                    <div class="d-flex gap-3 mt-3 justify-content-md-end justify-content-center">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="social-icon">
                            <i class="bi bi-facebook"></i>
                        </a>

                        <a href="https://x.com" target="_blank" rel="noopener noreferrer" class="social-icon">
                            <i class="bi bi-twitter-x"></i>
                        </a>

                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="social-icon">
                            <i class="bi bi-instagram"></i>
                        </a>

                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="social-icon">
                            <i class="bi bi-youtube"></i>
                        </a>
                    </div>
                </div>

            </div>

            <hr class="border-secondary mt-4">

            <div class="text-center text-muted small">
                © 2026 Red Devils Hub. All rights reserved.
            </div>
        </div>
    </footer>
    `;

    const footerContainer = document.getElementById("footer");

    if (footerContainer) {
        footerContainer.innerHTML = footerHTML;
    }

});