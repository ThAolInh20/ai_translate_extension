// Load setting
chrome.storage.sync.get("targetLang", (data) => {
  document.getElementById("targetLang").value = data.targetLang || "vi";
});

// Save setting
document.getElementById("targetLang").addEventListener("input", (e) => {
  chrome.storage.sync.set({ targetLang: e.target.value });
  document.getElementById("status").innerText = "Đã lưu ✔";
  setTimeout(() => (document.getElementById("status").innerText = ""), 1000);
});
