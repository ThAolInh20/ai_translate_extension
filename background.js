const API_URL = "https://ai-translate-ai.vercel.app/api/translate";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translate",
    title: "Dịch bằng Gemini",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "translate") return;

  const selectedText = info.selectionText;

  chrome.tabs.sendMessage(tab.id, {
    type: "TRANSLATE_START",
    original: selectedText
  });

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ text: selectedText })
    });

    const data = await res.json();

    chrome.tabs.sendMessage(tab.id, {
      type: "TRANSLATE_DONE",
      original: selectedText,
      translated: data.translated
    });
  } catch (err) {
    chrome.tabs.sendMessage(tab.id, {
      type: "TRANSLATE_ERROR",
      error: err.message
    });
  }
});
// 🔥 BẮT BUỘC — xử lý icon 🌐 click
chrome.runtime.onMessage.addListener(async (msg, sender) => {
  if (msg.type !== "TRANSLATE_REQUEST") return;

  chrome.tabs.sendMessage(sender.tab.id, {
    type: "TRANSLATE_START",
    original: msg.original
  });

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: msg.original })
    });

    const data = await res.json();

    chrome.tabs.sendMessage(sender.tab.id, {
      type: "TRANSLATE_DONE",
      original: msg.original,
      translated: data.translated
    });

  } catch (err) {
    chrome.tabs.sendMessage(sender.tab.id, {
      type: "TRANSLATE_ERROR",
      error: err.message
    });
  }
});
