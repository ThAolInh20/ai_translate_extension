const statusEl = document.getElementById("status");
let saveTimeout = null;

function showSavedStatus() {
  statusEl.classList.add("show");
  if (saveTimeout) clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    statusEl.classList.remove("show");
  }, 1500);
}

// Load settings
chrome.storage.sync.get(["targetLang", "selectedModel"], (data) => {
  document.getElementById("targetLang").value = data.targetLang || "vi";
  document.getElementById("selectedModel").value = data.selectedModel || "gemini-2.5-flash-lite";
});

// Save targetLang
document.getElementById("targetLang").addEventListener("input", (e) => {
  chrome.storage.sync.set({ targetLang: e.target.value }, () => {
    showSavedStatus();
  });
});

// Save selectedModel
document.getElementById("selectedModel").addEventListener("change", (e) => {
  chrome.storage.sync.set({ selectedModel: e.target.value }, () => {
    showSavedStatus();
  });
});
