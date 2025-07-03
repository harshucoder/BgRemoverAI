# 🧠 Background Remover AI

A full-stack web application that removes backgrounds from images using AI.

Built with **Next.js (TypeScript)** for the frontend, **Node.js + Express + Multer** for the backend, and a **Python script with rembg** to perform background removal.

---

## 🚀 Features

- Upload images through a web interface.
- Remove backgrounds from uploaded images using AI.
- Download the processed (transparent) image.
- Seamless integration between frontend, backend, and Python AI script.

---

## 🛠️ Tech Stack

| Layer       | Technology                     |
|-------------|--------------------------------|
| Frontend    | Next.js + TypeScript           |
| Backend     | Node.js, Express, Multer       |
| AI Engine   | Python (`rembg` library)       |

---

## 📂 Project Structure

```
BgRemover
├─ Backend
│  ├─ nodemon.json
│  ├─ output
│  ├─ outputs
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ src
│  │  ├─ index.ts
│  │  └─ routes
│  │     └─ removeBg.ts
│  ├─ tsconfig.json
│  └─ uploads
└─ frontend
   ├─ public/
   ├─ src/
   ├─ .next/
   └─ other Next.js files
```

---

## 🔧 Setup Instructions

### 🧩 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd BgRemover
```

---

### ⚙️ 2. Backend Setup (Node.js + Python)

```bash
cd Backend
npm install
```

#### ➕ Install Python dependencies:

Ensure Python 3 is installed, then:

```bash
pip install rembg
```

---

### 💻 3. Frontend Setup (Next.js)

```bash
cd ../frontend
npm install
npm run dev
```

---

### ▶️ 4. Run the Backend

```bash
cd ../Backend
npm run dev
```

---

## 📸 How it Works

1. User uploads an image from the web app.
2. Backend receives it using `multer` and stores it.
3. Node server runs `app.py` using `child_process`.
4. `rembg` removes the background.
5. Processed image is returned for preview/download.

---

## 📦 .gitignore Recommendations

```gitignore
# Node
node_modules/
uploads/
output/
outputs/

# Python
*.pyc
__pycache__/

# Env
.env
```

---

## 📃 License

This project is open-source and available under the [MIT License](LICENSE).

---

## ✨ Author

**Harsh Kushwaha** – [@harshkk2005](mailto:harshkk2005@gmail.com)