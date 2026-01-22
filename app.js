const API = "https://zeklo-backend.onrender.com"; // change later

let userId = null;

function signup() {
  fetch(`${API}/auth/signup?email=${email.value}&password=${password.value}`, {
    method: "POST"
  })
  .then(r => r.json())
  .then(() => authMsg.innerText = "Account created. Login now.");
}

function login() {
  fetch(`${API}/auth/login?email=${email.value}&password=${password.value}`, {
    method: "POST"
  })
  .then(r => r.json())
  .then(d => {
    userId = d.user_id;
    auth.classList.add("hidden");
    app.classList.remove("hidden");
  });
}

function send() {
  const text = input.value;
  if (!text) return;

  addMsg("You", text, "user");
  input.value = "";

  fetch(`${API}/v1/chat?message=${encodeURIComponent(text)}`, {
    method: "POST",
    headers: { "x-api-key": "YOUR_ZEK_API_KEY" }
  })
  .then(r => r.json())
  .then(d => streamAI(d.reply));
}

function addMsg(sender, text, cls) {
  const div = document.createElement("div");
  div.className = `msg ${cls}`;
  div.innerText = `${sender}: ${text}`;
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function streamAI(text) {
  let i = 0;
  const div = document.createElement("div");
  div.className = "msg ai";
  messages.appendChild(div);

  const interval = setInterval(() => {
    div.innerText = "Zeklo: " + text.slice(0, i++);
    messages.scrollTop = messages.scrollHeight;
    if (i > text.length) clearInterval(interval);
  }, 20);
}

function newChat() {
  messages.innerHTML = "";
}
