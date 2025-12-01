// load setting
chrome.storage.sync.get("targetLang", (data) => {
  document.getElementById("lang").value = data.targetLang || "vi";
});

// save setting
document.getElementById("lang").addEventListener("change", (e) => {
  chrome.storage.sync.set({ targetLang: e.target.value });
});
