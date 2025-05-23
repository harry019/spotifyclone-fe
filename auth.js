const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");

const loginContainer = document.getElementById("login-container");
const signupContainer = document.getElementById("signup-container");

function toggleForms() {
  loginContainer.classList.toggle("hidden");
  signupContainer.classList.toggle("hidden");
}

// Optional: Handle hash-based redirection (e.g., #signup)
window.addEventListener("load", () => {
  if (window.location.hash === "#signup") {
    loginContainer.classList.add("hidden");
    signupContainer.classList.remove("hidden");
  } else {
    loginContainer.classList.remove("hidden");
    signupContainer.classList.add("hidden");
  }
});

// Save sign-up data
signupForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("signup-name").value.trim();
  const email = document.getElementById("signup-email").value.trim();
  const password = document.getElementById("signup-password").value;

  if (!name || !email || !password) {
    alert("Please fill in all fields.");
    return;
  }

  const userData = { name, email, password };
  localStorage.setItem("spotifyUser", JSON.stringify(userData));

  alert("Account created successfully! Please log in.");
  signupForm.reset();
  toggleForms();
});

// Check login
loginForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value;

  const storedUser = JSON.parse(localStorage.getItem("spotifyUser"));

  if (!storedUser) {
    alert("No user found. Please sign up first.");
    return;
  }

  if (email === storedUser.email && password === storedUser.password) {
    alert(`Welcome back, ${storedUser.name}!`);
    window.location.href = "index.html"; // ✅ Go to homepage
  } else {
    alert("Invalid email or password. Please try again.");
  }
});
