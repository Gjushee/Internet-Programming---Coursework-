// ================= CONTACT FORM VALIDATION + WORD LIMIT =================

const MAX_MESSAGE_WORDS = 200;

const contactForm = document.querySelector("#contactForm");

const fullName = document.querySelector("#fullName");
const email = document.querySelector("#email");
const subject = document.querySelector("#subject");
const message = document.querySelector("#message");

// Live word counter element
const wordCountDisplay = document.querySelector("#wordCount");

// Confirmation spans in modal
const cName = document.querySelector("#cName");
const cEmail = document.querySelector("#cEmail");
const cSubject = document.querySelector("#cSubject");
const cMessage = document.querySelector("#cMessage");

// ================= LIVE WORD COUNTER =================

message.addEventListener("input", () => {

  const words = message.value.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  wordCountDisplay.textContent = wordCount;

  // Change color if limit exceeded
  if (wordCount > MAX_MESSAGE_WORDS) {
    wordCountDisplay.style.color = "red";
  } else {
    wordCountDisplay.style.color = "";
  }
});

// ================= FORM SUBMIT =================

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Reset validation UI
  [fullName, email, subject, message].forEach((el) =>
    el.classList.remove("is-invalid")
  );

  let valid = true;

  // Name: min 3 chars
  if (fullName.value.trim().length < 3) {
    fullName.classList.add("is-invalid");
    valid = false;
  }

  // Email validation
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

  // Message validation
  const messageText = message.value.trim();
  const words = messageText.split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;

  // Minimum characters
  if (messageText.length < 10) {
    message.classList.add("is-invalid");
    valid = false;
  }

  // Maximum word limit
  if (wordCount > MAX_MESSAGE_WORDS) {
    message.classList.add("is-invalid");
    valid = false;
  }

  if (!valid) return;

  // Fill modal
  cName.textContent = fullName.value.trim();
  cEmail.textContent = emailValue;
  cSubject.textContent = subject.value.trim();
  cMessage.textContent = messageText;

  // Show modal
  const modalEl = document.querySelector("#confirmModal");
  const modal = new bootstrap.Modal(modalEl);
  modal.show();

  // Reset form
  contactForm.reset();
  wordCountDisplay.textContent = "0";
});