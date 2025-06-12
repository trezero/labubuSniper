# Labubu Sniper Chrome Extension

Labubu Sniper is a lightweight Chrome extension that helps collectors quickly uncover hidden **POP MART** product variants.  
Given one known product URL, the extension automatically opens ten additional tabs with sequential SKUs so you can scout drop-only links in seconds.

---

## ✨ Features

| Feature | Description |
| ------- | ----------- |
| One-click variant opener | Enter a base product URL and the extension opens **10** new tabs with incremented SKU numbers. |
| Intelligent SKU parser  | Detects the 4-digit SKU segment *after* `1000` and *before* `600280`, then increments it (e.g. `7802` → `7803` … `7812`). |
| Optional scheduled drop | The background script still supports an alarm (`chrome.alarms`) if another component stores `dropInfo` in `chrome.storage`. |
| Desktop notifications    | Get a heads-up when variant tabs are launched. |

---

## 🛠 Installation

1. Clone or download this repository

```bash
git clone https://github.com/your-username/labubuSniper.git
```

2. In Chrome, open **chrome://extensions** and enable **Developer mode**.
3. Click **Load unpacked** and select the `labubu-sniper` folder.
4. The **Labubu Sniper** icon should now appear in your toolbar.

---

## 🚀 Usage

1. Navigate to any site in Chrome (tab focus is required for extensions to open new tabs).
2. Click the **Labubu Sniper** icon.
3. Paste a POP MART product URL, e.g.

```
https://www.popmart.com/us/pop-now/set/40-10007802600280
```
4. Press **Open Variants**.
5. Ten new tabs will open:

```
https://www.popmart.com/us/pop-now/set/40-10007803600280
https://www.popmart.com/us/pop-now/set/40-10007804600280
...
https://www.popmart.com/us/pop-now/set/40-10007812600280
```

---

## 📂 Project Structure

```
labubu-sniper/
├── background.js   # Handles alarms & notifications
├── popup.html      # Minimal UI (URL field + button)
├── popup.js        # Generates variant URLs and opens tabs
├── popup.css       # Light styling
├── manifest.json   # Chrome extension manifest (v3)
└── icons/          # Extension icons (16×, 48×, 128×)
```

---

## 🔍 How It Works

The extension looks for URLs that match the pattern

```
https://www.popmart.com/us/pop-now/set/40-1000XXXX600280
```

1. `1000` ‑- static marker
2. `XXXX` ‑- four-digit SKU segment (**incremented**)  
3. `600280` ‑- static marker

When you click **Open Variants**, the code:

1. Parses the `XXXX` value.
2. Generates 10 URLs by adding `+1 … +10` to it.
3. Opens each URL in a new tab (`chrome.tabs.create`).

If you ever store a `dropInfo` object in `chrome.storage.sync` (e.g. via a script or DevTools), the background script can trigger at a precise time using `chrome.alarms` and perform the same variant-opening logic.

---

## 🔑 Permissions Explained

| Permission     | Why it is needed |
|---------------|------------------|
| `tabs`        | Create new tabs with the generated URLs. |
| `storage`     | Persist scheduled drop info (optional). |
| `alarms`      | Fire at a given timestamp for scheduled drops. |
| `notifications` | Notify you when tabs are opened. |

---

## 🤝 Contributing

PRs and issues are welcome! Feel free to fork the repo and submit improvements.

---

## 📄 License

This project is licensed under the **MIT License** – see the `LICENSE` file for details.
