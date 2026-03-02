# THE QUICK - Hyperlocal Delivery Platform

A full-stack hyperlocal delivery application for food and grocery delivery built with Next.js.

## Features

### For Customers
- **QuickBite** - Order hot meals from nearby restaurants
- **QuickMart** - Instant grocery delivery
- Real-time order tracking
- Multiple payment methods (UPI, Card, Cash on Delivery, Wallet)
- Search functionality across restaurants and products

### For Riders
- Delivery dashboard
- Order management
- Live delivery tracking

### For Admins
- QuickBite Admin Dashboard
- QuickMart Admin Dashboard
- Restaurant & product management

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Maps**: Leaflet (OpenStreetMap)

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Customer | user@quickbite.com | 123456 |
| Rider | rider@quickbite.com | 123456 |
| QuickBite Admin | quickbite@admin.com | 123456 |
| QuickMart Admin | quickmart@admin.com | 123456 |

## Project Structure

```
app/
├── api/              # API routes
├── login/            # Login page
├── quickbite/        # Restaurant food ordering
├── quickmart/       # Grocery delivery
├── cart/            # Shopping cart
├── checkout/        # Checkout flow
├── track-order/     # Order tracking
├── rider/           # Rider dashboard
└── admin/           # Admin dashboards
```

## License

MIT
