# 🚀 Hyperlocal Delivery

<p align="center">
  <a href="https://nodejs.org" target="_blank"><img src="https://img.shields.io/badge/Node.js-20-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"></a>
  <a href="https://nextjs.org" target="_blank"><img src="https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"></a>
  <a href="https://react.dev" target="_blank"><img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"></a>
  <a href="https://www.typescriptlang.org" target="_blank"><img src="https://img.shields.io/badge/TypeScript_5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
  <a href="https://tailwindcss.com" target="_blank"><img src="https://img.shields.io/badge/Tailwind_CSS_3.4-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"></a>
  <a href="https://zustand-demo.pmnd.rs" target="_blank"><img src="https://img.shields.io/badge/Zustand_5-764ABC?style=for-the-badge&logo=react&logoColor=white" alt="Zustand"></a>
  <a href="https://tanstack.com/query/latest" target="_blank"><img src="https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white" alt="React Query"></a>
  <a href="https://leafletjs.com" target="_blank"><img src="https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white" alt="Leaflet"></a>
  <a href="https://recharts.org" target="_blank"><img src="https://img.shields.io/badge/Recharts-00D2D3?style=for-the-badge&logo=recharts&logoColor=white" alt="Recharts"></a>
  <a href="https://www.framer.com/motion" target="_blank"><img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion"></a>
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

## 🔑 Key Features Explained

### 🍔 Food Delivery
Browse restaurants with ratings, delivery times, and fees. View detailed menus with categories and pricing. Add items to cart and place orders seamlessly.

### 🛒 Quickmart
Grocery delivery platform with category-based filtering (Fruits & Vegetables, Dairy, Snacks, Beverages, etc.). Browse products and add to cart.

### ⚡ Instamart
Fast delivery section for urgent ordering needs with quick access to essential items.

### 🗺️ Live Order Tracking
Interactive Leaflet maps showing real-time delivery status. Track your order from restaurant to your doorstep with live updates.

### 🚴 Rider Dashboard
Comprehensive dashboard for delivery partners featuring:
- Order statistics and earnings
- Performance metrics with Recharts visualizations
- Active order management

### 👤 Authentication System
Secure login/logout functionality with protected routes. User session management for personalized experience.

### 📱 Responsive Design
Mobile-first approach ensuring seamless experience across all devices - desktop, tablet, and mobile.

---

## ⚙️ How It Works

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   User       │────▶│   Browse     │────▶│   Add to    │
│   Visits     │     │   Restaurants│     │   Cart      │
└──────────────┘     └──────────────┘     └──────────────┘
                                                │
                                                ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Delivered  │◀────│   Tracking   │◀────│  Checkout    │
│   to Door    │     │   Live Map   │     │  & Payment   │
└──────────────┘     └──────────────┘     └──────────────┘
```

### User Flow:
1. **Browse** - Users explore restaurants, Quickmart, or Instamart
2. **Select** - Choose items and add to cart
3. **Checkout** - Review cart and place order
4. **Track** - Real-time order tracking via map
5. **Receive** - Order delivered to doorstep

### Admin Flow:
1. **Dashboard** - View and manage orders
2. **Products** - Manage menu items and products

### Rider Flow:
1. **Login** - Access rider dashboard
2. **View Orders** - See available delivery orders
3. **Deliver** - Complete deliveries and update status

---

## 🛠️ Tech Stack

### Core
- **[Node.js 20](https://nodejs.org)** - JavaScript runtime
- **[Next.js 15](https://nextjs.org)** - React framework with App Router
- **[React 19](https://react.dev)** - UI library
- **[TypeScript 5.7](https://www.typescriptlang.org)** - Type safety

### Styling & Build
- **[Tailwind CSS 3.4](https://tailwindcss.com)** - Utility-first CSS framework
- **[PostCSS](https://postcss.org)** - CSS transformations
- **[Autoprefixer](https://github.com/postcss/autoprefixer)** - Vendor prefixer

### State Management
- **[Zustand 5](https://zustand-demo.pmnd.rs)** - Lightweight state management
- **[React Query 5](https://tanstack.com/query/latest)** - Server state management

### Maps & Location
- **[Leaflet](https://leafletjs.com)** - Interactive maps
- **[React Leaflet](https://react-leaflet.js.org)** - React bindings for Leaflet

### Data Visualization
- **[Recharts](https://recharts.org)** - Charts for rider dashboard

### Animation
- **[Framer Motion 11](https://www.framer.com/motion)** - Animations and gestures

### Utilities
- **[clsx](https://github.com/lukeed/clsx)** - Conditional class names
- **[React Virtual](https://tanstack.com/virtual)** - Virtual list rendering

### Development
- **[ESLint](https://eslint.org)** - Code linting
- **[Turbopack](https://turbo.build/pack)** - Rust-based bundler

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

## 👨‍💻 Author

**NIRU0802**
- GitHub: [@NIRU0802](https://github.com/NIRU0802)

---

<p align="center">
  ⭐ Star this repository if you found it helpful!
</p>
