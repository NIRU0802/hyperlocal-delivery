# 🚀 Hyperlocal Delivery

<p align="center">
  <a href="https://github.com/NIRU0802/hyperlocal-delivery/blob/main/LICENSE" target="_blank"><img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License"></a>
  <img src="https://img.shields.io/github/repo-size/NIRU0802/hyperlocal-delivery?style=for-the-badge" alt="Repo Size">
  <img src="https://img.shields.io/github/contributors/NIRU0802/hyperlocal-delivery?style=for-the-badge" alt="Contributors">
  <img src="https://img.shields.io/github/forks/NIRU0802/hyperlocal-delivery?style=for-the-badge" alt="Forks">
  <img src="https://img.shields.io/github/stars/NIRU0802/hyperlocal-delivery?style=for-the-badge" alt="Stars">
</p>

---

> A modern hyperlocal delivery platform for food and groceries built with Next.js 15, React 19, and Tailwind CSS

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🍔 **Food Delivery** | Browse and order from multiple restaurants (McDonald's, Domino's, etc.) |
| 🛒 **Quickmart** | Grocery delivery with category filtering |
| ⚡ **Instamart** | Quick delivery for urgent needs |
| 🗺️ **Live Tracking** | Real-time order tracking with Leaflet maps |
| 🛵 **Delivery Partners** | View delivery partner information |
| 🚴 **Rider Dashboard** | Dedicated dashboard for delivery partners with order stats |
| 👤 **User Authentication** | Secure login/logout system |
| 📱 **Responsive Design** | Works seamlessly on all devices |
| 🎯 **Search** | Search restaurants and products |
| ⭐ **Ratings & Reviews** | Restaurant ratings and review counts |
| 📦 **Order Management** | Cart, checkout, and order tracking |
| 🏪 **Admin Panels** | Admin pages for Quickmart and Quickbite management |

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org)** - React framework with App Router
- **[React 19](https://react.dev)** - UI library
- **[TypeScript 5.7](https://www.typescriptlang.org)** - Type safety
- **[Tailwind CSS 3.4](https://tailwindcss.com)** - Styling

### State Management & Data
- **[Zustand 5](https://zustand-demo.pmnd.rs)** - Lightweight state management
- **[React Query](https://tanstack.com/query/latest)** - Server state management

### Maps & Visualization
- **[Leaflet](https://leafletjs.com)** - Interactive maps for order tracking
- **[Recharts](https://recharts.org)** - Data visualization for rider dashboard

### Animation
- **[Framer Motion](https://www.framer.com/motion)** - Smooth animations

---

## 🚦 Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/NIRU0802/hyperlocal-delivery.git

# Navigate to project directory
cd hyperlocal-delivery

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```
hyperlocal-delivery/
├── app/                         # Next.js App Router
│   ├── api/                    # API Routes
│   │   ├── auth/              # Authentication
│   │   ├── menu/              # Menu API
│   │   ├── orders/            # Orders API
│   │   ├── products/          # Products API
│   │   └── restaurants/       # Restaurants API
│   ├── admin/                 # Admin Panels
│   │   ├── quickbite/        # Quickbite Admin
│   │   └── quickmart/         # Quickmart Admin
│   ├── cart/                  # Shopping Cart
│   ├── checkout/              # Checkout Page
│   ├── delivery/              # Delivery Page
│   ├── instamart/             # Instant Delivery
│   ├── login/                 # Authentication
│   ├── quickbite/             # Food Delivery
│   ├── quickmart/             # Grocery Delivery
│   │   └── category/[slug]/  # Category Pages
│   ├── restaurant/[id]/       # Restaurant Details
│   ├── restaurants/           # Restaurant List
│   ├── rider/dashboard/       # Rider Dashboard
│   └── track-order/           # Order Tracking
├── components/                 # React Components
│   ├── data/                  # Mock Data (JSON)
│   ├── hooks/                 # Custom Hooks
│   ├── lib/                   # Utilities
│   ├── store/                 # Zustand Stores
│   │   ├── authStore.ts      # Auth State
│   │   ├── cartStore.ts      # Cart State
│   │   ├── orderStore.ts     # Order State
│   │   └── uiStore.ts        # UI State
│   ├── types/                 # TypeScript Types
│   ├── CartSidebar.tsx       # Cart Sidebar
│   ├── Navbar.tsx            # Navigation Bar
│   ├── OrderTrackingMap.tsx  # Order Map
│   ├── RiderMap.tsx          # Rider Map
│   └── SearchModal.tsx       # Search Modal
├── lib/                       # Helper Functions
│   ├── search.ts             # Search Utilities
│   └── timeUtils.ts          # Time Utilities
├── stores/                    # Additional Stores
│   ├── authStore.ts
│   └── systemStore.ts
├── middleware.ts              # Next.js Middleware
├── next.config.js             # Next.js Config
├── tailwind.config.cjs        # Tailwind Config
├── postcss.config.cjs         # PostCSS Config
└── tsconfig.json             # TypeScript Config
```

---

## 🔑 Key Features Explained

### 🍔 Food Ordering
Browse restaurants with ratings, delivery times, and fees. View menus and add items to cart.

### 🛒 Quickmart
Grocery delivery with category-based filtering (e.g., Fruits & Vegetables, Dairy, Snacks).

### ⚡ Instamart
Fast delivery section for urgent ordering needs.

### 🗺️ Live Order Tracking
Interactive Leaflet maps showing delivery status and real-time tracking.

### 🚴 Rider Dashboard
Stats dashboard for delivery partners showing orders, earnings, and performance.

### 👤 Authentication
Login system with protected routes and user session management.

---

## 📦 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth` | POST | User authentication |
| `/api/restaurants` | GET | List all restaurants |
| `/api/menu` | GET | Get restaurant menu |
| `/api/orders` | GET/POST | Manage orders |
| `/api/products` | GET | Get products |

---

## 🖼️ Pages

| Route | Description |
|-------|-------------|
| `/` | Home page |
| `/restaurants` | Restaurant listing |
| `/restaurant/[id]` | Restaurant details & menu |
| `/quickbite` | Quickbite delivery |
| `/quickmart` | Grocery delivery |
| `/quickmart/category/[slug]` | Category products |
| `/instamart` | Instant delivery |
| `/cart` | Shopping cart |
| `/checkout` | Checkout page |
| `/delivery` | Delivery information |
| `/track-order` | Order tracking with map |
| `/login` | User login |
| `/rider/dashboard` | Rider dashboard |
| `/admin/quickbite` | Quickbite admin |
| `/admin/quickmart` | Quickmart admin |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**NIRU0802**
- GitHub: [@NIRU0802](https://github.com/NIRU0802)

---

<p align="center">
  ⭐ Star this repository if you found it helpful!
</p>
