// Contact form validation + confirmation popup (Bootstrap modal)

const contactForm = document.querySelector("#contactForm");

const fullName = document.querySelector("#fullName");
const email = document.querySelector("#email");
const subject = document.querySelector("#subject");
const message = document.querySelector("#message");

// Confirmation spans in modal
const cName = document.querySelector("#cName");
const cEmail = document.querySelector("#cEmail");
const cSubject = document.querySelector("#cSubject");
const cMessage = document.querySelector("#cMessage");

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Reset validation UI
  [fullName, email, subject, message].forEach((el) => el.classList.remove("is-invalid"));

  let valid = true;

  // Name: min 3 chars
  if (fullName.value.trim().length < 3) {
    fullName.classList.add("is-invalid");
    valid = false;
  }

  // Email: basic pattern check
  const emailValue = email.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(emailValue)) {
    email.classList.add("is-invalid");
    valid = false;
  }

  // Subject: min 3 chars
  if (subject.value.trim().length < 3) {
    subject.classList.add("is-invalid");
    valid = false;
  }

  // Message: min 10 chars
  if (message.value.trim().length < 10) {
    message.classList.add("is-invalid");
    valid = false;
  }

  if (!valid) return;

  // Fill modal with captured details
  cName.textContent = fullName.value.trim();
  cEmail.textContent = emailValue;
  cSubject.textContent = subject.value.trim();
  cMessage.textContent = message.value.trim();

  // Show Bootstrap modal popup
  const modalEl = document.querySelector("#confirmModal");
  const modal = new bootstrap.Modal(modalEl);
  modal.show();

  // Reset form after successful submit
  contactForm.reset();
});