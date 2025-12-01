let box = null;
console.log("CONTENT SCRIPT LOADED");
let translateBtn = null;

// Tạo nút icon dịch khi bôi đen
function createTranslateButton() {
  translateBtn = document.createElement("div");
  translateBtn.innerText = "🌐";
  translateBtn.style.position = "absolute";
  translateBtn.style.background = "#111827";
  translateBtn.style.color = "#fff";
  translateBtn.style.padding = "6px 8px";
  translateBtn.style.fontSize = "14px";
  translateBtn.style.borderRadius = "6px";
  translateBtn.style.cursor = "pointer";
  translateBtn.style.zIndex = "999999999";
  translateBtn.style.boxShadow = "0 4px 10px rgba(0,0,0,.3)";
  translateBtn.style.userSelect = "none";
  translateBtn.style.display = "none";
  translateBtn.style.transition = "0.15s ease";

  translateBtn.onmousedown = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  document.body.appendChild(translateBtn);
}

createTranslateButton();

document.addEventListener("mouseup", () => {
  const selection = window.getSelection();
  const text = selection.toString().trim();

  if (!text) {
    translateBtn.style.display = "none";
    return;
  }

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  // đặt icon dưới vùng highlight
  translateBtn.style.top = window.scrollY + rect.bottom + 5 + "px";
  translateBtn.style.left = window.scrollX + rect.left + "px";
  translateBtn.style.display = "block";

  // khi click icon → gửi request
  translateBtn.onclick = () => {
    chrome.runtime.sendMessage({
      type: "TRANSLATE_REQUEST",
      original: text
    });

    translateBtn.style.display = "none";
  };
});


function showBox(html) {
  if (!box) {
    box = document.createElement("div");
    box.style.position = "fixed";
    box.style.top = "20px";
    box.style.right = "20px";
    box.style.background = "#111827";
    box.style.color = "#fff";
    box.style.padding = "16px 20px";
    box.style.maxWidth = "360px";
    box.style.borderRadius = "12px";
    box.style.fontSize = "14px";
    box.style.boxShadow = "0 8px 20px rgba(0,0,0,.3)";
    box.style.zIndex = "999999999";
    box.style.lineHeight = "1.4";
    box.style.fontFamily = "Arial, sans-serif";
    box.style.position = "fixed";
    box.style.display = "flex";
    box.style.flexDirection = "column";

    // nút X đóng box
    const closeBtn = document.createElement("div");
    closeBtn.innerText = "✕";
    closeBtn.style.position = "absolute";
    closeBtn.style.top = "8px";
    closeBtn.style.right = "12px";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.fontSize = "15px";
    closeBtn.style.color = "#bbb";

    closeBtn.onclick = () => box.remove();

    box.appendChild(closeBtn);
    document.body.appendChild(box);
  }

  box.querySelector(".content")?.remove();

  const content = document.createElement("div");
  content.className = "content";
  content.innerHTML = html;

  box.appendChild(content);
}

// Nhận message từ background
chrome.runtime.onMessage.addListener((msg) => {
  // Icon header
  const icon = `
    <div style="
      font-size:20px;
      margin-bottom:8px;
      display:flex;
      align-items:center;
      gap:6px;
    ">
      🌐 <span style="font-size:14px;color:#aaa">Gemini Translate</span>
    </div>
  `;

  if (msg.type === "TRANSLATE_START") {
    showBox(`
      ${icon}
      <div style="color:#ccc;font-size:12px;margin-bottom:5px">Đang dịch...</div>
      <div>${msg.original}</div>
    `);
  }

  if (msg.type === "TRANSLATE_DONE") {
    showBox(`
      ${icon}
      <div style="color:#ccc;font-size:12px">Bản gốc:</div>
      <div>${msg.original}</div>

      <hr style="opacity:.2;margin:10px 0">

      <div style="color:#ccc;font-size:12px">Dịch:</div>
      <div><b>${msg.translated}</b></div>
    `);
  }

  if (msg.type === "TRANSLATE_ERROR") {
    showBox(`
      ${icon}
      <span style="color:#f87171">Lỗi: ${msg.error}</span>
    `);
  }
});
