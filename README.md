# 🖼️ Furniture E-Commerce - Frontend

A modern, responsive, and visually stunning frontend for the Furniture E-Commerce store, built with **React** and **Vite**.

## 🎨 Design Philosophy
- **Premium Aesthetics:** Uses 00s-inspired minimalist design with smooth Tailwind transitions.
- **Micro-interactions:** Hover effects and dynamic state changes.
- **Responsive:** Fully optimized for Mobile, Tablet, and Desktop.

## 🚀 Technologies Used
- **React 18**
- **Vite** (Fast Build Tool)
- **Vanilla CSS** (Custom Design System)
- **Axios** (API Requests)
- **Lucide React** (Icons)

## 💡 Key Features
- **Dynamic Homepage:** Hero section, Featured Products, and Categories.
- **Product Filter:** Search and filter by category (Sofa, Bed, Chair, etc.).
- **Real-time Cart:** Instant updates to cart subtotal and quantities.
- **Admin Dashboard:** Simple UI to track total sales, products, and users.
- **Auto-Auth:** Uses `localStorage` to keep you logged in across refreshes.

## ⚙️ Setup & Installation
1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Run Locally:**
    ```bash
    npm run dev
    ```
3.  **Access App:**
    - Open `http://localhost:5173`.

## 🔗 Connection to Backend
The frontend is configured to talk to the backend via a **Vite Proxy**. It automatically appends the `username` to requests from `localStorage`, ensuring the backend knows which user is active.

## 👤 Sample Credentials
- **Admin:** `admin` / `admin123`
- **User:** Register your own account via the UI!
