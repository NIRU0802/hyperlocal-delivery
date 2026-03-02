<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status">
</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0E7CFF&height=180&section=header&text=THE%20QUICK&fontSize=60&animation=fadeIn&fontAlignY=40" width="100%"/>
</p>

<h1 align="center">Hyperlocal Delivery Platform</h1>

<p align="center">
  A comprehensive food & grocery delivery application built with Next.js, featuring real-time tracking, multiple user roles, and instant delivery capabilities.
</p>

---

## 📋 Table of Features

| Feature | Description | Status |
|---------|-------------|--------|
| 🔐 Authentication | Login with role-based access (Customer, Rider, Admin) | ✅ |
| 🍔 QuickBite | Order food from nearby restaurants | ✅ |
| 🛒 QuickMart | Instant grocery delivery | ✅ |
| 🔍 Search | Search restaurants, dishes, and products | ✅ |
| 🛒 Shopping Cart | Add/remove items with quantity management | ✅ |
| 💳 Checkout | Multiple payment methods | ✅ |
| 📍 Order Tracking | Real-time order status updates | ✅ |
| 🛵 Rider Dashboard | Delivery partner interface | ✅ |
| 👨‍💼 Admin Panels | Restaurant & grocery management | ✅ |
| 📱 Responsive | Mobile-first design | ✅ |
| 🎨 Animations | Smooth UI transitions | ✅ |
| 🗺️ Maps | Location-based delivery tracking | ✅ |

---

## 🔄 How It Works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            USER FLOW                                         │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
  │  Visit   │ ───► │  Login   │ ───► │  Home    │ ───► │ Browse   │
  │   App    │      │  Page    │      │  Page    │      │  Items   │
  └──────────┘      └──────────┘      └──────────┘      └──────────┘
                                                              │
                                                              ▼
  ┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
  │ Delivered│ ◄─── │  Track   │ ◄─── │  Order   │ ◄─── │  Add to  │
  │  🎉      │      │  Order   │      │ Placed   │      │  Cart    │
  └──────────┘      └──────────┘      └──────────┘      └──────────┘
```

### Step-by-Step Flow

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

---

## 👥 User Roles

| Role | Access | Dashboard |
|------|--------|-----------|
| 👤 **Customer** | QuickBite, QuickMart, Orders | Home → Browse → Order |
| 🛵 **Rider** | Delivery requests, Earnings | /rider/dashboard |
| 👨‍💼 **QuickBite Admin** | Restaurants, Menu, Orders | /admin/quickbite |
| 👩‍💼 **QuickMart Admin** | Products, Categories, Orders | /admin/quickmart |

---

## 🛠️ Tech Stack

### Frontend
<p>
  <img src="https://skillicons.dev/icons?i=nextjs,react,typescript,tailwind,framer" />
</p>

### Backend & Tools
<p>
  <img src="https://skillicons.dev/icons?i=nodejs,vercel,git,vscode" />
</p>

### Libraries Used
- **Zustand** - State management
- **Framer Motion** - Animations
- **Leaflet** - Maps & tracking
- **TanStack Query** - Data fetching

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
│   ├── pages/
│   │   ├── login/              # Login page
│   │   ├── home/               # Main landing (post-login)
│   │   ├── quickbite/          # Food ordering
│   │   ├── quickmart/          # Grocery delivery
│   │   ├── cart/               # Shopping cart
│   │   ├── checkout/           # Checkout flow
│   │   ├── track-order/        # Order tracking
│   │   ├── rider/              # Rider dashboard
│   │   └── admin/              # Admin dashboards
│   │
├── components/
│   ├── store/                  # Zustand stores
│   │   ├── authStore.ts        # Authentication state
│   │   ├── cartStore.ts        # Cart management
│   │   └── orderStore.ts       # Order state
│   │
│   ├── lib/                    # Utilities
│   ├── hooks/                  # Custom hooks
│   ├── data/                   # Mock data
│   └── types/                  # TypeScript types
│
├── stores/                     # Root store
├── lib/                       # Utilities
└── public/                    # Static assets
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

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License">
</p>

<p align="center">
  MIT License - Feel free to use this project for learning and development.
</p>

---

<p align="center">
  <strong>Made with ❤️ by <a href="https://github.com/NIRU0802">Niraj Kathe</a></strong>
</p>

<p align="center">
  ⭐ If you found this useful, please give it a star!
</p>
