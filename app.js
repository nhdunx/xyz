// Mobile menu toggle
const btn = document.getElementById("mobileMenuBtn");
const menu = document.getElementById("mobileMenu");

btn?.addEventListener("click", () => {
  const isOpen = btn.getAttribute("aria-expanded") === "true";
  btn.setAttribute("aria-expanded", String(!isOpen));
  menu.hidden = isOpen;
});

// Close mobile menu when click link
document.querySelectorAll(".mobile-link").forEach((a) => {
  a.addEventListener("click", () => {
    if (!menu.hidden) {
      menu.hidden = true;
      btn.setAttribute("aria-expanded", "false");
    }
  });
});

// Tabs filter
const tabs = document.querySelectorAll(".tab");
const cards = document.querySelectorAll(".card");

tabs.forEach((t) => {
  t.addEventListener("click", () => {
    tabs.forEach((x) => x.classList.remove("is-active"));
    t.classList.add("is-active");

    const filter = t.dataset.filter;
    cards.forEach((c) => {
      const ok = filter === "all" || c.dataset.category === filter;
      c.style.display = ok ? "" : "none";
    });
  });
});

// Highlight active pill by hash
function setActivePill() {
  const hash = location.hash || "#home";
  document.querySelectorAll(".pill").forEach((p) => p.classList.remove("is-active"));
  const target = document.querySelector(`.pill[href="${hash}"]`);
  if (target) target.classList.add("is-active");
}
window.addEventListener("hashchange", setActivePill);
setActivePill();

let __sending = false;

async function sendContact() {
  if (__sending) return;

  const nameEl = document.getElementById("c_name");
  const phoneEl = document.getElementById("c_phone");
  const msgEl = document.getElementById("c_message");
  const btn = document.getElementById("btnSend");
  const note = document.getElementById("contactNote");

  const name = (nameEl?.value || "").trim();
  const phone = (phoneEl?.value || "").trim();
  const message = (msgEl?.value || "").trim();

  if (!name || !phone || !message) {
    note.textContent = "⚠️ Điền đủ Họ tên / SĐT / Nội dung giúp đại ca nha.";
    return;
  }

  __sending = true;
  const oldText = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Đang gửi...";
  note.textContent = "⏳ Đang gửi yêu cầu...";

  try {
    const r = await fetch("https://tele.zunbaoo21.workers.dev/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, message }),
    });

    const data = await r.json().catch(() => ({}));

    if (r.ok && data.ok) {
      note.textContent = "✅ Gửi thành công! Đại ca sẽ phản hồi sớm.";
      nameEl.value = "";
      phoneEl.value = "";
      msgEl.value = "";
    } else {
      note.textContent = "❌ Gửi thất bại: " + (data.error || `HTTP ${r.status}`);
      console.log("Contact error:", data);
    }
  } catch (e) {
    note.textContent = "❌ Không kết nối được server. Thử lại sau.";
    console.error(e);
  } finally {
    btn.disabled = false;
    btn.textContent = oldText;
    __sending = false;
  }
}
