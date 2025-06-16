# TaskFlow - Task Manager

A modern, intuitive task management application built with Next.js, TypeScript, Supabase, and Tailwind CSS. Streamline your workflow, boost productivity, and achieve your goals with our beautiful and responsive interface.

## 🚀 Live Demo

**[Try TaskFlow Live](https://taske-manager.netlify.app/)**

Experience the full functionality of TaskFlow with our live demo. Create an account, manage your todos, and explore all the features!

## ✨ Features

### 🔐 **Complete Authentication System**
- **Email & Password** login/registration
- **OAuth Integration** with Google & GitHub  
- **Email Verification** for new accounts
- **Password Reset** with secure email links
- **User Profiles** with avatars and personalization

### 📝 **Advanced Todo Management**
- **Create, Edit, Delete** todos with ease
- **Mark Complete/Incomplete** with beautiful animations
- **Real-time Updates** across all sessions
- **Smart Filtering** (All, Active, Completed)
- **Search Functionality** to find todos quickly
- **Creation & Update Timestamps** for tracking

### 📊 **Productivity Dashboard**
- **Real-time Statistics** showing your progress
- **Completion Rate** tracking and motivation
- **Active vs Completed** todo counts
- **Beautiful Data Visualization** with charts and metrics

### 🎨 **Modern User Experience**
- **Responsive Design** that works on all devices
- **Dark/Light Mode** adaptive interface
- **Smooth Animations** and transitions
- **Glass-morphism Effects** for modern modals
- **Intuitive Navigation** with user-friendly design
- **Loading States** and error handling

### 🔒 **Security & Performance**
- **Row Level Security** with Supabase
- **Protected Routes** and authentication guards
- **Optimized Performance** with Next.js 15
- **Type Safety** with TypeScript throughout

## Getting Started

### Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Supabase account

### Environment Setup

Create a `.env.local` file in the project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_SECRET_KEY=your_supabase_anon_key

# Optional: For enhanced email uniqueness checking (recommended)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables (see above)
4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

## 📁 Project Structure

```
├── app/                 # Next.js app directory (App Router)
│   ├── (auth)/         # Authentication pages (login, register, etc.)
│   ├── todos/          # Todo management interface
│   ├── auth/           # Auth callback handlers
│   └── page.tsx        # Home page with stats dashboard
├── components/         # Reusable UI components
│   ├── AuthGuard.tsx   # Route protection component
│   └── Navigation.tsx  # Main navigation component
├── contexts/           # React context providers
│   └── AuthContext.tsx # Authentication state management
├── lib/               # Utility functions and configurations
│   └── supabase.ts    # Supabase client configuration
├── types/             # TypeScript type definitions
│   ├── auth.ts        # Authentication types
│   ├── todo.ts        # Todo-related types
│   └── database.ts    # Database schema types
├── supabase/          # Database migrations and config
│   └── migrations/    # SQL migration files
└── public/            # Static assets
```

## 🚀 Deployment

This application is deployed on **Netlify** with automatic deployments from the main branch.

### **Live Application**: [https://taske-manager.netlify.app/](https://taske-manager.netlify.app/)

### Deploy Your Own

1. **Fork this repository**
2. **Connect to Netlify** and deploy from your GitHub
3. **Set Environment Variables** in Netlify:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Configure Supabase** redirect URLs for your domain
5. **Deploy!** 🎉

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint linting
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🛠️ Database Setup

1. **Create Supabase Project** at [supabase.com](https://supabase.com)
2. **Run the migration** in SQL Editor:
   ```sql
   -- Copy and paste the SQL from supabase/migrations/001_create_todos_table.sql
   ```
3. **Configure Authentication** providers (Google, GitHub)
4. **Set up RLS policies** (included in migration)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📚 Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [Supabase Documentation](https://supabase.com/docs) - Database and authentication
- [Tailwind CSS](https://tailwindcss.com/docs) - Utility-first CSS framework
- [TypeScript](https://www.typescriptlang.org/docs/) - Type safety and developer experience
- [Lucide React](https://lucide.dev/) - Beautiful & consistent icon pack

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
