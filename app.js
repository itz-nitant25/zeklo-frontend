let guestId = localStorage.getItem("guest_id");

if (!guestId) {
  guestId = crypto.randomUUID();
  localStorage.setItem("guest_id", guestId);
}

const API = "https://YOUR-BACKEND-URL/chat";

async function send() {
  const input = document.getElementById("input");
  const msg = input.value.trim();
  if (!msg) return;

  addMessage(msg, "user");
  input.value = "";

  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: msg,
      guest_id: guestId
    })
  });

  const data = await res.json();
  addMessage(data.reply, "ai");
}

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  div.innerText = text;
  document.getElementById("messages").appendChild(div);
}
