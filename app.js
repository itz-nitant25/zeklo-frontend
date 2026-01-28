// ===============================
// ZEKLO AI — app.js
// ===============================

// 🔐 Generate / restore guest ID
let guestId = localStorage.getItem("guest_id");

if (!guestId) {
  guestId = crypto.randomUUID();
  localStorage.setItem("guest_id", guestId);
}

// 🌐 Backend API
const API_CHAT = "https://zeklo.onrender.com/docs#/Zeklo%20Chat/chat_api_chat_post";

// 📨 Send message
async function send() {
  const input = document.getElementById("input");
  const msg = input.value.trim();
  if (!msg) return;

  addMessage(msg, "user");
  input.value = "";

  // ⏳ Typing indicator
  const typing = addMessage("Zeklo is thinking…", "ai typing");

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
    typing.remove();

    if (!res.ok) {
      addMessage("❌ Server error. Try again.", "ai");
      console.error(data);
      return;
    }

    addMessage(data.reply || "⚠️ No response", "ai");

  } catch (err) {
    typing.remove();
    console.error(err);
    addMessage("❌ Cannot connect to server", "ai");
  }
}

// 🧱 Add message to UI
function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  div.innerText = text;

  const messages = document.getElementById("messages");
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;

  return div;
}

// ⌨️ Enter key support
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("input");
  const sendBtn = document.getElementById("send");

  input.addEventListener("keydown", e => {
    if (e.key === "Enter") send();
  });

  if (sendBtn) sendBtn.onclick = send;
});
