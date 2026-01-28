// ================== ZEKLO APP ==================

// 🔑 Guest ID (auto, anonymous)
let guestId = localStorage.getItem("guest_id");

if (!guestId) {
  guestId = crypto.randomUUID();
  localStorage.setItem("guest_id", guestId);
}

// 🔗 LIVE BACKEND URL (IMPORTANT)
const API_CHAT = "https://zeklo.onrender.com/docs#/Zeklo%20Chat/chat_api_chat_post";
const API_IMAGE = "https://zeklo.onrender.com/docs#/Zeklo%20Chat/image_api_image_post";

const messagesDiv = document.getElementById("messages");
const input = document.getElementById("input");
const sendBtn = document.getElementById("send");
const imageBtn = document.getElementById("imageBtn");

// 🚫 Disable image for guests
imageBtn.disabled = true;
imageBtn.title = "Login required for image generation";

// ---------------- SEND MESSAGE ----------------
async function send() {
  const msg = input.value.trim();
  if (!msg) return;

  addMessage(msg, "user");
  input.value = "";

  showTyping();

  try {
    const res = await fetch(API_CHAT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: msg,
        guest_id: guestId
      })
    });

    const data = await res.json();
    removeTyping();

    // 🚫 Free limit reached
    if (data.reply && data.reply.includes("Free limit")) {
      addMessage(data.reply, "ai");
      showLoginPopup();
      return;
    }

    typeReply(data.reply);

  } catch (err) {
    removeTyping();
    addMessage("⚠️ Zeklo is having trouble. Try again.", "ai");
  }
}

// ---------------- IMAGE GENERATION ----------------
async function generateImage() {
  alert("🔒 Please login to generate images");
}

// ---------------- UI HELPERS ----------------
function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  div.innerText = text;
  messagesDiv.appendChild(div);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Typing dots
function showTyping() {
  const div = document.createElement("div");
  div.id = "typing";
  div.className = "msg ai";
  div.innerText = "Zeklo is thinking…";
  messagesDiv.appendChild(div);
}

function removeTyping() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

// Streaming / typing effect
function typeReply(text) {
  const div = document.createElement("div");
  div.className = "msg ai";
  messagesDiv.appendChild(div);

  let i = 0;
  const interval = setInterval(() => {
    div.innerText += text[i];
    i++;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
    if (i >= text.length) clearInterval(interval);
  }, 15);
}

// Login popup trigger
function showLoginPopup() {
  document.getElementById("authModal").style.display = "block";
}

// ---------------- EVENTS ----------------
sendBtn.onclick = send;
imageBtn.onclick = generateImage;

input.addEventListener("keydown", e => {
  if (e.key === "Enter") send();
});
