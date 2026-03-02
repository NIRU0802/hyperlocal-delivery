<div align="center">

# THE QUICK

### Anything You Crave. Delivered Faster.

---

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)](https://github.com/NIRU0802/hyperlocal-delivery)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

A comprehensive **food & grocery delivery application** built with Next.js, featuring real-time tracking, multiple user roles, and instant delivery capabilities.

</div>

---

## 📋 Features

| Feature | Description |
|---------|-------------|
| 🔐 **Authentication** | Login with role-based access (Customer, Rider, Admin) |
| 🍔 **QuickBite** | Order food from nearby restaurants |
| 🛒 **QuickMart** | Instant grocery delivery |
| 🔍 **Search** | Search restaurants, dishes, and products |
| 🛒 **Shopping Cart** | Add/remove items with quantity management |
| 💳 **Checkout** | Multiple payment methods |
| 📍 **Order Tracking** | Real-time order status updates |
| 🛵 **Rider Dashboard** | Delivery partner interface |
| 👨‍💼 **Admin Panels** | Restaurant & grocery management |
| 📱 **Responsive** | Mobile-first design |
| 🎨 **Animations** | Smooth UI transitions |
| 🗺️ **Maps** | Location-based delivery tracking |

---

## 🔄 How It Works

<div align="center">

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER FLOW                                      │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
  │  Visit   │ ───► │  Login   │ ───► │  Home    │ ───► │ Browse   │
  │   App    │      │  Page    │      │  Page    │      │  Items   │
  └──────────┘      └──────────┘      └──────────┘      └──────────┘
                                                              │
                                                              ▼
  ┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
  │ Delivered│ ◄─── │  Track   │ ◄─── │  Order   │ ◄─── │  Add to  │
  │    🎉    │      │  Order   │      │ Placed   │      │  Cart    │
  └──────────┘      └──────────┘      └──────────┘      └──────────┘
```

</div>

<div align="center">

| Step | Action | Description |
|------|--------|-------------|
| 1 | **Visit App** | User lands on login page |
| 2 | **Login** | Select role and login |
| 3 | **Home** | Choose QuickBite or QuickMart |
| 4 | **Browse** | Explore restaurants/products |
| 5 | **Add to Cart** | Select items and quantities |
| 6 | **Checkout** | Choose address, delivery, payment |
| 7 | **Order Placed** | Order confirmed with tracking |
| 8 | **Track** | Real-time order status |
| 9 | **Delivered** | Order received successfully |

</div>

---

## 👥 User Roles

| Role | Access | Dashboard |
|------|--------|-----------|
| 👤 **Customer** | QuickBite, QuickMart, Orders | Home → Browse → Order |
| 🛵 **Rider** | Delivery requests, Earnings | `/rider/dashboard` |
| 👨‍💼 **QuickBite Admin** | Restaurants, Menu, Orders | `/admin/quickbite` |
| 👩‍💼 **QuickMart Admin** | Products, Categories, Orders | `/admin/quickmart` |

---

## 🛠️ Tech Stack

### Frontend
- **[Next.js](https://nextjs.org)** - React framework for production
- **[React](https://react.dev)** - UI library
- **[TypeScript](https://www.typescriptlang.org)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[PostCSS](https://postcss.org)** - CSS transformations
- **[Autoprefixer](https://github.com/postcss/autoprefixer)** - CSS vendor prefixes
- **[Zustand](https://zustand-demo.pmnd.rs/)** - State management
- **[TanStack React Query](https://tanstack.com/query/latest)** - Async state management
- **[TanStack Virtual](https://tanstack.com/virtual/latest)** - Virtual scrolling
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library
- **[Recharts](https://recharts.org)** - Charts for dashboard
- **[clsx](https://github.com/lukeed/clsx)** - ClassName utility
- **[Leaflet](https://leafletjs.com)** - Interactive maps
- **[React-Leaflet](https://react-leaflet.js.org)** - React Leaflet components

### Backend & Tools
- **[Node.js](https://nodejs.org)** - JavaScript runtime
- **[Vercel](https://vercel.com)** - Deployment platform
- **[ESLint](https://eslint.org)** - Code linting

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/NIRU0802/hyperlocal-delivery.git

# Navigate to project directory
cd hyperlocal-delivery

# Install dependencies
npm install

# Run development server
npm run dev
```

### Open in Browser

```
http://localhost:3000
```

---

## 🔑 Login Credentials

| Role | Email | Password | Redirect |
|------|-------|----------|----------|
| 👤 Customer | `user@quickbite.com` | `123456` | / (Home) |
| 🛵 Rider | `rider@quickbite.com` | `123456` | /rider/dashboard |
| 👨‍💼 QuickBite Admin | `quickbite@admin.com` | `123456` | /admin/quickbite |
| 👩‍💼 QuickMart Admin | `quickmart@admin.com` | `123456` | /admin/quickmart |

---

## 📁 Project Structure

```
├── app/
│   ├── api/                    # API Routes
│   │   ├── auth/               # Authentication
│   │   ├── menu/               # Restaurant menu
│   │   ├── orders/             # Order management
│   │   ├── products/           # QuickMart products
│   │   └── restaurants/        # Restaurant data
│   │
│   ├── login/                  # Login page
│   ├── quickbite/              # Food ordering
│   ├── quickmart/              # Grocery delivery
│   ├── cart/                   # Shopping cart
│   ├── checkout/               # Checkout flow
│   ├── track-order/            # Order tracking
│   ├── rider/                  # Rider dashboard
│   └── admin/                  # Admin dashboards
│
├── components/
│   ├── store/                  # Zustand stores
│   ├── lib/                    # Utilities
│   ├── hooks/                  # Custom hooks
│   ├── data/                   # Mock data
│   └── types/                  # TypeScript types
│
├── stores/                     # Root store
├── lib/                        # Utilities
└── public/                     # Static assets
```

---

## 📱 Key Pages

| Page | Route | Description |
|------|-------|-------------|
| Login | `/login` | Role-based authentication |
| Home | `/` | QuickBite & QuickMart selection |
| QuickBite | `/quickbite` | Restaurant listing |
| Restaurant | `/restaurant/[id]` | Menu & ordering |
| QuickMart | `/quickmart` | Category browsing |
| Category | `/quickmart/category/[slug]` | Product listing |
| Cart | `/cart` | Cart management |
| Checkout | `/checkout` | Address & payment |
| Track Order | `/track-order` | Live tracking |
| Rider Dashboard | `/rider/dashboard` | Delivery management |
| Admin QuickBite | `/admin/quickbite` | Restaurant admin |
| Admin QuickMart | `/admin/quickmart` | Grocery admin |

---

## 🎨 UI Features

- 🌙 **Dark Mode Ready** - Clean design with gradient accents
- 📱 **Responsive** - Works on mobile, tablet, and desktop
- ✨ **Animations** - Smooth transitions with Framer Motion
- 🎯 **Micro-interactions** - Hover effects and feedback
- 🗺️ **Maps** - Interactive delivery tracking

---

## 📄 License

MIT License - Feel free to use this project for learning and development.

---

<div align="center">

**Made with ❤️ by [Niraj Kathe](https://github.com/NIRU0802)**

⭐ If you found this useful, please give it a star!

</div>
