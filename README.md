# Service Booking System - Frontend

A modern, responsive frontend for the Service Booking System built with Next.js, TypeScript, and shadcn/ui.

## 🚀 Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful UI components
- **React Hook Form** - Form management
- **Zustand** - State management

## 📋 Features

### Core Features

- ✅ User authentication (customers & service providers)
- ✅ Business profile management
- ✅ Service management with categories
- ✅ Real-time booking system
- ✅ Payment integration (Stripe)
- ✅ Notification system
- ✅ Responsive design

### Advanced Features

- 🔄 Staff management
- 🔄 Availability management
- 🔄 Booking modifications
- 🔄 Analytics & reporting

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Git

### Installation

```bash
# Clone the repository
git clone <your-frontend-repo-url>
cd service-booking-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── (auth)/         # Authentication pages
│   ├── (dashboard)/    # Dashboard pages
│   ├── api/            # API routes
│   └── globals.css     # Global styles
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── forms/          # Form components
│   └── layout/         # Layout components
├── lib/                # Utility functions
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 UI Components

This project uses shadcn/ui components:

- Button, Card, Input, Form
- Calendar, Dialog, Select
- And more...

## 🔗 API Integration

The frontend connects to the backend API for:

- User authentication
- Business management
- Service management
- Booking operations
- Payment processing

## 📱 Responsive Design

- Mobile-first approach
- Tablet and desktop optimization
- Progressive Web App (PWA) features

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm run build
# Deploy to Vercel
```

### Other Platforms

- Netlify
- Railway
- DigitalOcean App Platform

## 📝 Development

### Code Style

- ESLint configuration
- Prettier formatting
- TypeScript strict mode

### Git Workflow

- Feature branches
- Pull request reviews
- Conventional commits

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is for portfolio purposes.

---

**Author:** Abu Sayed  
**Project Type:** Portfolio Project for Mid-Level Frontend Developer Position  
**Last Updated:** December 19, 2024
