let box = null;
console.log("CONTENT SCRIPT LOADED");
function showBox(html) {
  if (!box) {
    box = document.createElement("div");
    box.style.position = "fixed";
    box.style.top = "20px";
    box.style.right = "20px";
    box.style.background = "#111827";
    box.style.color = "#fff";
    box.style.padding = "16px";
    box.style.maxWidth = "360px";
    box.style.borderRadius = "10px";
    box.style.fontSize = "14px";
    box.style.boxShadow = "0 8px 20px rgba(0,0,0,.3)";
    box.style.zIndex = "999999999";
    box.style.fontFamily = "Arial, sans-serif";

    document.body.appendChild(box);
  }
  box.innerHTML = html;
}

// nhận message từ background
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "TRANSLATE_START") {
    showBox(`
      <div style="color:#ccc;font-size:12px;margin-bottom:5px">Đang dịch...</div>
      <div>${msg.original}</div>
    `);
  }

  if (msg.type === "TRANSLATE_DONE") {
    showBox(`
      <div style="color:#ccc;font-size:12px">Bản gốc:</div>
      <div>${msg.original}</div>

      <hr style="opacity:.2;margin:10px 0">

      <div style="color:#ccc;font-size:12px">Dịch:</div>
      <div><b>${msg.translated}</b></div>
    `);
  }

  if (msg.type === "TRANSLATE_ERROR") {
    showBox(`<span style="color:#f87171">Lỗi: ${msg.error}</span>`);
  }
});
