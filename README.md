<p align="center">
  <a href="https://recode.appwrite.network" target="_blank" rel="noopener noreferrer">
    <img src="https://cdn.hashnode.com/res/hashnode/image/upload/v1761310827175/a7f4639e-61aa-4098-9d7a-0ffe3181df2e.png?w=1600&h=840&fit=crop&crop=entropy&auto=compress,format&format=webp" alt="Regexly Banner" width="900"/>
  </a>
</p>

<h1 align="center">recode</h1>
<p align="center">
  <b>Your Personal Snippet Brain.</b><br>
  <i>Save. Search. Share.</i><br><br>
</p>

<p align="center">
  <a href="https://omarcodes.io/recode" target="_blank" rel="noopener noreferrer">
    Read the launch story →
  </a>
</p>

---

## 🚀 Features

- 🗂️ **Organized Snippet Library:** Save, tag, and filter your go‑to code snippets in seconds.
- 🔍 **Command Palette Search:** Open the global search (`⌘/Ctrl + K`) to jump straight to the snippet you need.
- 🔐 **Secure by Default:** Appwrite Auth protects every snippet with per-user permissions.
- 🎯 **Built for Flow:** Fast, responsive dashboard with syntax highlighting and keyboard shortcuts.
- 💻 **Open Source:** MIT licensed. Fork it, remix it, ship it.

---

## 🛠️ Getting Started

```bash
git clone https://github.com/omar8345/recode.git
cd recode
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

Need to connect your own Appwrite project? Follow the [Appwrite setup guide](APPWRITE_SETUP.md) to configure API keys, database IDs, and environment variables.

---

## 📤 Import / Export JSON format

The dashboard lets you export all snippets to a `.json` file and bulk import from the same format. Each snippet in the JSON array uses this shape:

```json
[
  {
    "title": "Readable snippet title",
    "code": "// raw code as a single string",
    "language": "typescript",
    "tags": ["ui", "hooks"]
  }
]
```

- `title` (string) – required.
- `code` (string) – required.
- `language` (string) – optional; when omitted we auto-detect the language during import.
- `tags` (string array) – optional; defaults to an empty list when missing.

Any invalid entries are skipped; you’ll get a toast with the number of imported snippets once processing completes.

---

## 📦 Tech Stack

- **Next.js 15**
- **TypeScript**
- **Tailwind CSS & shadcn/ui**
- **Appwrite**
- **Framer Motion**

---

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first so we can align on direction before you dive in.

---

## 📧 Contact

- **Project Maintainer**
  - Twitter: [@DevOmar100](https://x.com/DevOmar100)
  - GitHub: [Omar8345](https://github.com/Omar8345)
  - Email: yo@omarcodes.io

---

<p align="center">
  <a href="https://appwrite.io/" target="_blank" rel="noopener noreferrer" style="display:inline-flex;align-items:center;gap:4px;">
    <img src="https://appwrite.io/assets/logomark/logo.svg" alt="Appwrite" width="18" height="18" style="vertical-align:middle;"/> Powered by Appwrite
  </a>
</p>
