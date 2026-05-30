// Chrome Extension - content.js

(function () {
  // Prevent duplicate injection
  if (window.__characterCounterInjected) return;
  window.__characterCounterInjected = true;

  class CharCounterTooltipManager {
    constructor() {
      // Create wrapper element and attach shadow DOM
      this.element = document.createElement('div');
      this.element.id = 'char-counter-tooltip-host';
      
      // Inline styles for the host to ensure absolute isolation
      Object.assign(this.element.style, {
        position: 'absolute',
        zIndex: '2147483647',
        pointerEvents: 'none',
        opacity: '0',
        transform: 'translate(-50%, -10px) scale(0.95)',
        transition: 'opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        display: 'none'
      });

      // Shadow DOM support check
      if (typeof this.element.attachShadow === 'function') {
        this.shadowRoot = this.element.attachShadow({ mode: 'open' });
      } else {
        // Fallback for environments without shadow DOM (highly unlikely in modern Chrome)
        this.shadowRoot = this.element;
      }

      this.visible = false;
      this.config = {
        enabled: true,
        ignoreWhitespace: false,
        ignoreLineBreaks: false,
        theme: 'dark'
      };

      // Load config initially
      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(this.config, (items) => {
          this.config = { ...this.config, ...items };
          this.render();
        });
        
        // Listen for config changes
        chrome.storage.onChanged.addListener((changes, areaName) => {
          if (areaName === 'local') {
            let changed = false;
            for (let key in changes) {
              if (key in this.config) {
                this.config[key] = changes[key].newValue;
                changed = true;
              }
            }
            if (changed) {
              this.render();
              this.updateCount();
            }
          }
        });
      } else {
        this.render();
      }
    }

    render() {
      const isDark = this.config.theme === 'dark';
      this.shadowRoot.innerHTML = `
        <style>
          .tooltip-container {
            background: ${isDark ? 'rgba(28, 28, 30, 0.85)' : 'rgba(255, 255, 255, 0.85)'};
            backdrop-filter: blur(12px) saturate(180%);
            -webkit-backdrop-filter: blur(12px) saturate(180%);
            border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)'};
            color: ${isDark ? '#FFFFFF' : '#1C1C1E'};
            padding: 8px 14px;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2), 0 1px 3px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            gap: 12px;
            font-size: 13px;
            font-weight: 500;
            white-space: nowrap;
            user-select: none;
          }
          .count-section {
            display: flex;
            flex-direction: column;
            line-height: 1.2;
          }
          .count-value {
            font-size: 16px;
            font-weight: 700;
            color: #007AFF;
            display: flex;
            align-items: baseline;
            gap: 2px;
          }
          .count-label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            opacity: 0.6;
          }
          .divider {
            width: 1px;
            height: 24px;
            background: ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'};
          }
          .details-section {
            display: flex;
            gap: 8px;
            opacity: 0.8;
            font-size: 11px;
          }
          .detail-item {
            display: flex;
            flex-direction: column;
          }
          .detail-num {
            font-weight: 600;
          }
          .toggle-btn {
            background: none;
            border: none;
            padding: 4px;
            margin: -4px;
            border-radius: 6px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0.5;
            transition: opacity 0.15s, background-color 0.15s;
            color: ${isDark ? '#FFF' : '#000'};
          }
          .toggle-btn:hover {
            opacity: 1;
            background: ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
          }
          .toggle-btn.active {
            opacity: 1;
            color: #007AFF;
          }
          .arrow {
            position: absolute;
            bottom: -6px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 6px solid ${isDark ? 'rgba(28, 28, 30, 0.85)' : 'rgba(255, 255, 255, 0.85)'};
            pointer-events: none;
          }
        </style>
        <div class="tooltip-container">
          <div class="count-section">
            <span class="count-value" id="main-count">0<span style="font-size:10px; font-weight:500;">文字</span></span>
            <span class="count-label" id="main-label">選択文字数</span>
          </div>
          <div class="divider"></div>
          <div class="details-section" id="sub-details"></div>
          <button class="toggle-btn" id="toggle-space" title="スペース・改行を除外してカウント">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 16h18v2H3zM3 6h18v2H3zM3 11h18v2H3z" style="opacity: 0.3;"></path>
              <line x1="3" y1="12" x2="21" y2="12"></line>
            </svg>
          </button>
        </div>
        <div class="arrow"></div>
      `;

      const toggleSpaceBtn = this.shadowRoot.getElementById('toggle-space');
      if (toggleSpaceBtn) {
        if (this.config.ignoreWhitespace) {
          toggleSpaceBtn.classList.add('active');
        } else {
          toggleSpaceBtn.classList.remove('active');
        }
        toggleSpaceBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.config.ignoreWhitespace = !this.config.ignoreWhitespace;
          this.config.ignoreLineBreaks = this.config.ignoreWhitespace;
          
          if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.set({
              ignoreWhitespace: this.config.ignoreWhitespace,
              ignoreLineBreaks: this.config.ignoreLineBreaks
            });
          } else {
            this.render();
            this.updateCount();
          }
        });
      }
    }

    updateCount(selectedText) {
      if (selectedText !== undefined) {
        this.currentText = selectedText;
      }
      if (!this.currentText) return;

      const text = this.currentText;
      const totalLen = text.length;
      const noWhitespaceLen = text.replace(/\s/g, '').length;
      
      let displayCount = totalLen;
      let label = '選択文字数';

      if (this.config.ignoreWhitespace) {
        displayCount = noWhitespaceLen;
        label = '文字数 (空白除外)';
      }

      const mainCountEl = this.shadowRoot.getElementById('main-count');
      const mainLabelEl = this.shadowRoot.getElementById('main-label');
      const subDetailsEl = this.shadowRoot.getElementById('sub-details');

      if (mainCountEl) {
        mainCountEl.innerHTML = `${displayCount}<span style="font-size:10px; font-weight:500; margin-left: 2px;">字</span>`;
      }
      if (mainLabelEl) {
        mainLabelEl.textContent = label;
      }

      if (subDetailsEl) {
        if (this.config.ignoreWhitespace) {
          subDetailsEl.innerHTML = `
            <div class="detail-item">
              <span class="detail-num">${totalLen}</span>
              <span class="count-label">全体</span>
            </div>
          `;
        } else {
          subDetailsEl.innerHTML = `
            <div class="detail-item">
              <span class="detail-num">${noWhitespaceLen}</span>
              <span class="count-label">空白除く</span>
            </div>
          `;
        }
      }
    }

    show(rect, text) {
      if (!this.config.enabled) return;
      this.updateCount(text);

      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      const targetLeft = rect.left + rect.width / 2 + scrollLeft;
      const targetTop = rect.top + scrollTop;

      this.element.style.left = `${targetLeft}px`;
      this.element.style.top = `${targetTop}px`;

      if (!this.visible) {
        this.visible = true;
        this.element.style.display = 'block';
        // Force reflow for animation
        this.element.offsetHeight;
        this.element.style.opacity = '1';
        this.element.style.transform = 'translate(-50%, -18px) scale(1)';
        this.element.style.pointerEvents = 'auto';
      }
    }

    hide() {
      if (this.visible) {
        this.visible = false;
        this.element.style.opacity = '0';
        this.element.style.transform = 'translate(-50%, -10px) scale(0.95)';
        this.element.style.pointerEvents = 'none';
        
        // Hide display after transition completes
        setTimeout(() => {
          if (!this.visible) {
            this.element.style.display = 'none';
          }
        }, 200);
      }
    }
  }

  // Ensure body exists before appending
  function init() {
    if (!document.body) {
      setTimeout(init, 50);
      return;
    }

    const tooltip = new CharCounterTooltipManager();
    document.body.appendChild(tooltip.element);

    let selectionTimeout = null;

    function handleSelection() {
      if (selectionTimeout) clearTimeout(selectionTimeout);

      selectionTimeout = setTimeout(() => {
        const selection = window.getSelection();
        if (!selection) return;

        const text = selection.toString();

        if (!text || text.trim() === '') {
          tooltip.hide();
          return;
        }

        if (selection.rangeCount === 0) {
          tooltip.hide();
          return;
        }

        const range = selection.getRangeAt(0);
        const rects = range.getClientRects();
        if (rects.length === 0) {
          tooltip.hide();
          return;
        }

        const rect = range.getBoundingClientRect();
        tooltip.show(rect, text);
      }, 80);
    }

    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('keyup', handleSelection);

    document.addEventListener('mousedown', (e) => {
      // Check if click is inside the tooltip
      const path = e.composedPath();
      if (path.includes(tooltip.element)) {
        return;
      }
      tooltip.hide();
    });
  }

  init();
})();
