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
// 🎤 Voice Input
const micBtn = document.getElementById("mic");

if (micBtn) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    micBtn.onclick = () => recognition.start();

    recognition.onresult = (e) => {
      document.getElementById("input").value =
        e.results[0][0].transcript;
    };
  } else {
    micBtn.style.display = "none";
  }
}

// 🔊 Speak AI Reply
function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 1;
  utter.pitch = 1;
  utter.voice = speechSynthesis.getVoices()[0];
  speechSynthesis.speak(utter);
}
const IMAGE_API = "https://zeklo.onrender.com/docs#/Zeklo%20Chat/image_api_image_post";

async function generateImage() {
  if (!localStorage.getItem("token")) {
    alert("Login required to generate images");
    return;
  }

  const prompt = prompt("Describe the image:");
  if (!prompt) return;

  const res = await fetch(IMAGE_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    },
    body: JSON.stringify({ prompt })
  });

  const data = await res.json();

  if (data.image_url) {
    addMessage("🖼 Image generated:", "ai");
    const img = document.createElement("img");
    img.src = data.image_url;
    img.className = "gen-img";
    document.getElementById("messages").appendChild(img);
  }
}

