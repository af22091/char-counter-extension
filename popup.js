// Chrome Extension Popup Logic - popup.js

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const quickInput = document.getElementById('quick-input');
  const valTotal = document.getElementById('val-total');
  const valNoSpace = document.getElementById('val-no-space');

  const setEnabled = document.getElementById('setting-enabled');
  const setIgnoreSpace = document.getElementById('setting-ignore-space');
  const setTheme = document.getElementById('setting-theme');

  const bodyEl = document.body;

  // Defaults
  const defaultConfig = {
    enabled: true,
    ignoreWhitespace: false,
    ignoreLineBreaks: false,
    theme: 'dark'
  };

  // Load and apply configurations
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    chrome.storage.local.get(defaultConfig, (items) => {
      applyConfig(items);
    });
  } else {
    // Fallback if opened as standard webpage (for testing)
    applyConfig(defaultConfig);
  }

  function applyConfig(config) {
    setEnabled.checked = config.enabled;
    setIgnoreSpace.checked = config.ignoreWhitespace;
    setTheme.checked = config.theme === 'dark';
    
    updateThemeClass(config.theme);
  }

  function updateThemeClass(theme) {
    if (theme === 'dark') {
      bodyEl.classList.remove('theme-light');
      bodyEl.classList.add('theme-dark');
    } else {
      bodyEl.classList.remove('theme-dark');
      bodyEl.classList.add('theme-light');
    }
  }

  // Save config on toggle change
  function saveConfig() {
    const config = {
      enabled: setEnabled.checked,
      ignoreWhitespace: setIgnoreSpace.checked,
      ignoreLineBreaks: setIgnoreSpace.checked, // Link these for simplified toggle
      theme: setTheme.checked ? 'dark' : 'light'
    };

    updateThemeClass(config.theme);

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set(config);
    }
  }

  setEnabled.addEventListener('change', saveConfig);
  setIgnoreSpace.addEventListener('change', saveConfig);
  setTheme.addEventListener('change', saveConfig);

  // Quick Counter Textbox logic
  function runQuickCount() {
    const text = quickInput.value || '';
    const totalCount = text.length;
    const noSpaceCount = text.replace(/\s/g, '').length;

    valTotal.textContent = totalCount;
    valNoSpace.textContent = noSpaceCount;
  }

  quickInput.addEventListener('input', runQuickCount);
});
