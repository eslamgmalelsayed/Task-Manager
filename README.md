# Task Manager

A modern task management application built with Next.js, TypeScript, Supabase, and Tailwind CSS.

## Features

- 🔐 User authentication with Supabase
- 📝 Task management with priorities and categories
- 🎨 Modern UI with shadcn/ui components
- 📱 Responsive design
- 🔄 Real-time updates

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

## Project Structure

```
├── app/                 # Next.js app directory
│   ├── (auth)/         # Authentication pages
│   ├── dashboard/      # Dashboard pages
│   └── todos/          # Todo management pages
├── components/         # Reusable UI components
├── lib/               # Utility functions and configurations
├── types/             # TypeScript type definitions
└── public/            # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
