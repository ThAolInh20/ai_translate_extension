const API_URL = "https://ai-translate-ai.vercel.app/api/translate";

// Tạo menu chuột phải
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translate",
    title: "Dịch bằng Gemini",
    contexts: ["selection"]
  });
});

// Xử lý menu chuột phải
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "translate") return;

  const selectedText = info.selectionText;
  handleTranslation(selectedText, tab.id);
});

// Xử lý icon 🌐 click (từ content-script)
chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "TRANSLATE_REQUEST") {
    handleTranslation(msg.original, sender.tab.id);
  }
});

// ===============================
// 🔥 HÀM DÙNG CHUNG CHO DỊCH
// ===============================
function handleTranslation(text, tabId) {
  // Báo trạng thái đang dịch
  chrome.tabs.sendMessage(tabId, {
    type: "TRANSLATE_START",
    original: text
  });

  // Lấy cấu hình ngôn ngữ đích và model được chọn
  chrome.storage.sync.get(["targetLang", "selectedModel"], async (data) => {
    const target = data.targetLang || "vi";
    const model = data.selectedModel || "gemini-2.5-flash-lite";

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text,
          target: target,
          model: model      // << gửi target và model lên API
        })
      });

      const json = await res.json();

      chrome.tabs.sendMessage(tabId, {
        type: "TRANSLATE_DONE",
        original: text,
        translated: json.translated
      });

    } catch (err) {
      chrome.tabs.sendMessage(tabId, {
        type: "TRANSLATE_ERROR",
        error: err.message
      });
    }
  });
}
