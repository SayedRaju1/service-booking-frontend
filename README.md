# Service Booking System - Frontend

A modern, responsive frontend for the Service Booking System built with Next.js 15, React 19, TypeScript, and shadcn/ui. This comprehensive booking management system supports customers, service providers, and administrators with real-time booking capabilities, staff management, and analytics.

## 🚀 Tech Stack

- **Next.js 15.4.5** - React framework with App Router
- **React 19.1.0** - Latest React with enhanced features
- **TypeScript 5** - Type safety and better developer experience
- **Tailwind CSS 4** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components built on Radix UI
- **React Hook Form** - Performant form management
- **Zustand** - Lightweight state management
- **TanStack Query** - Powerful data synchronization for React
- **Axios** - HTTP client for API requests
- **Zod** - TypeScript-first schema validation
- **date-fns** - Modern JavaScript date utility library
- **NextAuth.js** - Authentication library

## 📋 Features

### Core Features

- ✅ **User Authentication** - Registration, login, and role-based access control (Customer, Business Owner, Admin)
- ✅ **Business Discovery** - Browse businesses with search, filters, and category navigation
- ✅ **Service Management** - Service listings with categories, pricing, and descriptions
- ✅ **Multi-Step Booking Flow** - Complete booking wizard with:
  - Service selection with search and filtering
  - Staff member selection with availability checking
  - Date and time slot selection
  - Booking confirmation and summary
- ✅ **Staff-Based Bookings** - Assign bookings to specific staff members with availability management
- ✅ **Dashboard System** - Role-specific dashboards:
  - **Customer Dashboard** - View and manage bookings, booking history
  - **Business Dashboard** - Manage services, staff, bookings, and analytics
  - **Admin Dashboard** - System-wide management and analytics
- ✅ **Booking Management** - View, filter, cancel, and manage bookings
- ✅ **Responsive Design** - Mobile-first approach with full tablet and desktop support

### Advanced Features

- 🔄 **Real-time Availability** - Dynamic time slot generation based on staff availability
- 🔄 **Staff Management** - Create and manage staff members with schedules
- 🔄 **Service Categories** - Organize services by categories
- 🔄 **Analytics & Reporting** - Business metrics and booking analytics
- 🔄 **Booking Modifications** - Reschedule and cancel bookings
- 🔄 **Search & Filtering** - Advanced search with multiple filter options

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (recommended: Node.js 20+)
- npm or yarn package manager
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

The application will be available at `http://localhost:3000`

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Optional: Stripe Integration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key

# Optional: App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📁 Project Structure

```
src/
├── app/                      # Next.js App Router
│   ├── (auth)/              # Authentication routes
│   │   ├── login/           # Login page
│   │   └── register/        # Registration page
│   ├── (dashboard)/         # Dashboard routes (protected)
│   │   ├── admin/           # Admin dashboard pages
│   │   ├── business/        # Business owner dashboard
│   │   ├── customer/        # Customer dashboard
│   │   └── dashboard/       # Unified dashboard
│   ├── api/                 # API routes (if needed)
│   ├── booking/             # Booking flow pages
│   │   ├── confirmation/    # Booking confirmation
│   │   └── success/         # Booking success page
│   ├── businesses/          # Business listing and detail pages
│   ├── categories/          # Service category pages
│   ├── services/            # Service listing and detail pages
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── components/              # Reusable UI components
│   ├── admin/               # Admin-specific components
│   ├── auth/                # Authentication components
│   ├── booking/             # Booking flow components
│   │   ├── booking-flow.tsx         # Main booking wizard
│   │   ├── service-selector.tsx     # Service selection
│   │   ├── staff-selector.tsx       # Staff selection
│   │   ├── date-selector.tsx        # Date selection
│   │   ├── time-slot-selector.tsx   # Time slot selection
│   │   └── booking-confirmation.tsx # Confirmation step
│   ├── business/            # Business-related components
│   ├── dashboard/           # Dashboard components
│   ├── layout/              # Layout components
│   ├── services/            # Service-related components
│   ├── staff/               # Staff management components
│   └── ui/                  # shadcn/ui components
├── lib/                     # Utility libraries
│   ├── api/                 # API service layer
│   │   ├── admin.ts         # Admin API functions
│   │   ├── auth.ts          # Authentication API
│   │   ├── bookings.ts      # Booking API
│   │   ├── business.ts      # Business API
│   │   ├── services.ts      # Service API
│   │   ├── staff.ts         # Staff API
│   │   ├── staff-booking.ts # Staff booking API
│   │   └── client.ts        # HTTP client configuration
│   ├── auth/                # Authentication utilities
│   ├── utils/               # Helper functions
│   │   └── date-time.ts     # Date/time utilities
│   ├── validations/         # Form validation schemas
│   ├── config.ts            # App configuration
│   └── providers.tsx        # React providers
├── hooks/                   # Custom React hooks
│   └── useStaffBooking.ts   # Staff booking hook
├── stores/                   # Zustand stores
│   └── auth.ts              # Authentication store
└── types/                    # TypeScript type definitions
    └── api.ts                # API type definitions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server on `http://localhost:3000`
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check code quality

## 🎨 UI Components

This project uses shadcn/ui components built on Radix UI primitives:

- **Form Components**: Button, Input, Textarea, Select, Switch, Slider
- **Layout Components**: Card, Dialog, Avatar, Badge, Progress
- **Navigation**: Breadcrumb, Dropdown Menu
- **Data Display**: Calendar, Skeleton
- **Feedback**: Error Boundary, Mock Notification

All components are fully accessible, customizable, and follow modern design patterns.

## 🔗 API Integration

The frontend connects to the backend API for:

- **Authentication**: User registration, login, logout, profile management
- **Business Management**: Business CRUD operations, search, filtering
- **Service Management**: Service CRUD, category management
- **Booking Operations**: Create, read, update, cancel bookings
- **Staff Management**: Staff CRUD, availability management
- **Admin Operations**: User management, system-wide analytics

### API Structure

All API calls are centralized in `src/lib/api/` with type-safe interfaces:

```typescript
import { bookingsApi, staffBookingApi, businessApi } from "@/lib/api";

// Example usage
const bookings = await bookingsApi.getUserBookings();
const staff = await staffBookingApi.getAvailableStaffForService(
  serviceId,
  date
);
```

## 📱 Responsive Design

- **Mobile-First Approach**: Optimized for mobile devices (320px+)
- **Tablet Optimization**: Enhanced layouts for tablets (768px+)
- **Desktop Experience**: Full-featured desktop layouts (1024px+)
- **Touch-Friendly**: All interactive elements optimized for touch
- **Progressive Enhancement**: Works on all modern browsers

## 🏗️ Architecture

### State Management

- **Zustand**: Global state (authentication, user preferences)
- **TanStack Query**: Server state (API data, caching, synchronization)
- **React Hook Form**: Form state management
- **Local State**: Component-specific state with React hooks

### Data Flow

```
User Action → Component → Hook/Store → API Service → Backend API → Response → State Update → UI Update
```

### Type Safety

- 100% TypeScript coverage
- Strict type checking enabled
- Comprehensive interface definitions
- Type-safe API responses

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub/GitLab/Bitbucket
2. Import the repository to Vercel
3. Configure environment variables
4. Deploy automatically on every push

### Other Platforms

- **Netlify**: Similar to Vercel, supports Next.js out of the box
- **Railway**: Simple deployment with database support
- **DigitalOcean App Platform**: Full-stack deployment solution
- **Docker**: Containerize and deploy anywhere

### Build for Production

```bash
npm run build
npm run start
```

## 📝 Development Guidelines

### Code Style

- **TypeScript**: Strict mode enabled, prefer interfaces over types
- **ESLint**: Configured with Next.js recommended rules
- **Component Structure**: Functional components with hooks
- **Naming Conventions**:
  - Components: PascalCase (e.g., `BookingFlow`)
  - Files: kebab-case (e.g., `booking-flow.tsx`)
  - Functions: camelCase (e.g., `handleSubmit`)

### Best Practices

- Use React Server Components where possible
- Minimize 'use client' directives
- Implement proper error boundaries
- Use Suspense for async operations
- Follow accessibility guidelines (WCAG 2.1 AA)

## 🧪 Testing

The project includes:

- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API integration testing
- **Type Safety**: TypeScript compile-time checks

Test files are located in `src/lib/api/__tests__/`

## 📚 Documentation

Additional documentation files:

- `BOOKING_SYSTEM.md` - Booking system implementation details
- `FRONTEND_DEVELOPMENT_PLAN.md` - Development plan and architecture
- `PHASE_1_IMPLEMENTATION.md` - Phase 1 API and data layer
- `PHASE_2_IMPLEMENTATION.md` - Phase 2 UI components
- `STAFF_MANAGEMENT.md` - Staff management features

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is for portfolio purposes.

## 👤 Author

**Abu Sayed**

- Portfolio Project for Mid-Level Frontend Developer Position
- Built with modern web technologies and best practices

---

**Last Updated:** November 12, 2025  
**Version:** 0.1.0  
**Status:** Active Development
