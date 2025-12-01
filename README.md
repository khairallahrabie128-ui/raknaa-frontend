# Rakna Frontend - Next.js Parking Management System

A modern, responsive frontend application built with Next.js 14, React, and TailwindCSS for managing parking spaces, bookings, and user interactions.

## 🚀 Features

- **User Dashboard**: Find parking spots, view bookings, and manage reservations
- **Owner Dashboard**: Manage parking garages, view statistics, and track revenue
- **Admin Dashboard**: System-wide management, analytics, and user administration
- **Authentication**: Secure login and registration with role-based access
- **Modern UI**: Clean, responsive design with TailwindCSS
- **TypeScript**: Full type safety and better developer experience

## 📁 Project Structure

```
frontend/
├── app/
│   ├── dashboard/
│   │   ├── admin/          # Admin dashboard page
│   │   ├── owner/          # Owner dashboard page
│   │   └── user/           # User dashboard page
│   ├── login/              # Login page
│   ├── register/          # Registration page
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home/landing page
│   └── globals.css         # Global styles
├── components/
│   ├── Navbar.tsx         # Navigation component
│   └── LanguageSwitcher.tsx # Language switching component
├── public/                # Static assets
├── package.json           # Dependencies
├── tailwind.config.ts     # TailwindCSS configuration
└── tsconfig.json          # TypeScript configuration
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Icons**: Lucide React
- **React**: 18.2.0

## 📦 Installation

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 Pages Overview

### Home Page (`/`)
- Landing page with welcome message
- Quick access to login and registration

### Login Page (`/login`)
- Email and password authentication
- Remember me functionality
- Forgot password link (placeholder)
- Redirects to appropriate dashboard based on user role

### Register Page (`/register`)
- User registration form
- Role selection (User/Driver or Owner)
- Password confirmation
- Redirects to login after successful registration

### User Dashboard (`/dashboard/user`)
- Search for parking spots
- View active and completed bookings
- Statistics: Active bookings, total spent, total bookings
- Booking management interface

### Owner Dashboard (`/dashboard/owner`)
- Manage parking garages
- View statistics: Total spaces, occupied spaces, occupancy rate, revenue
- Parking list with edit/delete actions
- Occupancy trends and monthly revenue charts (placeholders)
- Add new parking functionality

### Admin Dashboard (`/dashboard/admin`)
- System-wide statistics
- User management
- Garage management
- Booking analytics
- System health monitoring
- Recent activity feed
- Quick actions panel

## 🎯 Key Features

### Responsive Design
- Mobile-first approach
- Works seamlessly on desktop, tablet, and mobile devices
- TailwindCSS utility classes for consistent styling

### Role-Based Access
- Different dashboards for different user roles
- Protected routes (to be implemented with backend)
- Role-specific navigation

### Modern UI Components
- Card-based layouts
- Gradient backgrounds
- Smooth transitions and hover effects
- Icon integration with Lucide React

## 🔧 Configuration

### TailwindCSS
The project uses a custom primary color palette defined in `tailwind.config.ts`:
- Primary colors from 50 to 900
- Custom color scheme for brand consistency

### TypeScript
- Strict type checking enabled
- Path aliases configured (`@/components`, `@/app`)

## 📝 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Pages

1. Create a new folder in `app/` directory
2. Add a `page.tsx` file
3. Use the existing components and styling patterns

### Adding New Components

1. Create component file in `components/` directory
2. Export as default or named export
3. Import using `@/components/ComponentName`

## 🔌 Backend Integration (TODO)

The frontend is currently set up with placeholder data and mock API calls. To connect to the backend:

1. Create API service utilities in `lib/api.ts`
2. Replace mock data with actual API calls
3. Implement authentication state management
4. Add error handling and loading states
5. Connect forms to backend endpoints

## 🎨 Design System

### Colors
- **Primary**: Blue shades (#0284c7 to #0c4a6e)
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Font**: Inter (from Google Fonts)
- **Headings**: Bold, various sizes
- **Body**: Regular weight, gray-600/700

### Spacing
- Consistent spacing using Tailwind's spacing scale
- Padding: p-4, p-6, p-8
- Margins: mb-4, mb-6, mb-8

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Configure environment variables
4. Deploy automatically on push

## 📚 Next Steps

- [ ] Connect to backend API
- [ ] Implement authentication state management
- [ ] Add form validation
- [ ] Implement real-time updates
- [ ] Add error boundaries
- [ ] Implement loading states
- [ ] Add unit tests
- [ ] Add E2E tests
- [ ] Implement internationalization (i18n)
- [ ] Add dark mode support

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is part of the Rakna Parking Management System.

---

**Built with ❤️ using Next.js and TailwindCSS**
