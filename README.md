# Project-0

A modern, full-stack React + Vite web application with real-time database integration, professional UI components, and production-ready architecture.

## 🎯 Overview

Project-0 is a sophisticated full-stack web application built with the latest React 19 and Vite, designed to deliver high performance and exceptional user experiences. It features seamless Supabase integration for real-time data management, authentication, and a carefully curated UI component library using shadcn/ui with Tailwind CSS for beautiful, responsive interfaces.

This project serves as a modern template for building scalable web applications with real-time capabilities, comprehensive form handling, data visualization, and export functionalities.

## ✨ Key Features

- ⚡ **Lightning-Fast Development** - Vite's HMR for instant feedback
- 🎨 **Beautiful UI** - shadcn/ui components with Tailwind CSS
- 🗄️ **Real-Time Database** - Supabase PostgreSQL integration
- 📊 **Data Visualization** - Recharts and Chart.js support
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🔐 **Secure Authentication** - Built-in Supabase auth
- 📄 **Export Capabilities** - PDF generation and screenshots
- 📝 **Robust Forms** - React Hook Form with Zod validation
- 🧭 **Client-Side Routing** - React Router for smooth navigation
- 🎯 **TypeScript Support** - Full type safety with Zod schemas
- 🔧 **Code Quality** - ESLint with React best practices
- ⚙️ **Optimized Performance** - Babel React Compiler enabled

## 📦 Tech Stack

### Frontend Core
- **React** 19.2 - Modern UI library with hooks and latest features
- **Vite** 8.0 - Next-generation build tool with HMR
- **React Router** 7.13 - Client-side routing solution
- **TypeScript** - Full type safety throughout the project

### Styling & Components
- **Tailwind CSS** 4.2 - Utility-first CSS framework for rapid UI development
- **shadcn/ui** - High-quality, customizable React components
- **Radix UI** 1.4.3 - Accessible, unstyled component primitives
- **Lucide React** 0.577 - Beautiful, consistent icon library
- **PostCSS & Autoprefixer** - Advanced CSS processing

### State Management & Forms
- **React Hook Form** 7.71 - Performant, flexible form validation
- **Zod** 4.3 - TypeScript-first schema validation
- **date-fns** 4.1 - Modern date utility library

### Data & Backend
- **Supabase** 2.98 - PostgreSQL database with real-time features
- **Real-Time Subscriptions** - Live data synchronization
- **Authentication** - Built-in user management and sessions

### Visualization & Export
- **Recharts** 2.15 - React charting library for data visualization
- **Chart.js** 4.5 - Flexible charting library
- **react-chartjs-2** 5.3.1 - React wrapper for Chart.js
- **html2canvas** 1.4 - Convert DOM to PNG/screenshots
- **jsPDF** 4.2 - PDF document generation

### UI Enhancements
- **Sonner** 2.0 - Toast notifications for user feedback
- **cmdk** 1.1 - Fast command menu component
- **class-variance-authority** - CSS class composition utility
- **clsx** 2.1.1 - Utility for conditional CSS classes
- **tailwind-merge** 3.5 - Intelligent Tailwind CSS merging
- **@fontsource-variable/geist** 5.2.8 - Variable font support

### Development Tools
- **ESLint** 9.39 - Code quality and best practices
- **@eslint/js** - ESLint JavaScript plugin
- **eslint-plugin-react-hooks** - React hooks linting rules
- **eslint-plugin-react-refresh** - React refresh validation
- **Babel React Compiler** 1.0 - Automatic component optimization
- **Vite** (beta) - Cutting-edge build performance

## 📁 Project Structure

```
Project-0/
├── src/                          # Source code directory
│   ├── components/               # React components
│   │   ├── ui/                  # shadcn/ui component library
│   │   ├── shared/              # Shared/reusable components
│   │   └── features/            # Feature-specific components
│   ├── pages/                    # Page components for routes
│   ├── hooks/                    # Custom React hooks
│   ├── utils/                    # Utility functions and helpers
│   │   ├── supabase.js          # Supabase client configuration
│   │   ├── validation.ts        # Zod schema definitions
│   │   └── formatting.ts        # Data formatting utilities
│   ├── types/                    # TypeScript type definitions
│   ├── styles/                   # Global styles and themes
│   │   └── globals.css          # Global Tailwind CSS
│   ├── App.jsx                   # Main App component
│   ├── main.jsx                  # Entry point
│   └── index.css                 # Root styles
├── public/                        # Static assets
│   ├── favicon.ico               # Website favicon
│   └── assets/                   # Images, fonts, etc.
├── supabase/                      # Supabase configuration
│   ├── migrations/               # Database migrations
│   └── seed.sql                  # Sample data seeding
├── .vscode/                       # VS Code settings
│   └── settings.json             # Workspace settings
├── node_modules/                 # Dependencies (auto-generated)
├── dist/                          # Build output (auto-generated)
├── index.html                     # HTML entry point
├── vite.config.js                # Vite configuration
├── jsconfig.json                 # JavaScript configuration
├── components.json               # shadcn/ui configuration
├── eslint.config.js              # ESLint configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── postcss.config.js             # PostCSS configuration
├── package.json                  # Project metadata and dependencies
├── package-lock.json             # Locked dependency versions
├── .gitignore                     # Git ignore rules
├── README.md                      # This file
└── .env.example                  # Environment variables template
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 16.0.0 or higher
- **npm** 7.0.0 or higher (or yarn/pnpm)
- **Git** for version control
- A **Supabase account** (free tier available at supabase.com)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/AlaranUmar/Project-0.git
   cd Project-0
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   # Copy the example environment file
   cp .env.example .env.local
   
   # Edit .env.local with your Supabase credentials
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173` (or the URL shown in terminal)

## 📋 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Build optimized production bundle |
| `npm run lint` | Run ESLint to check code quality |
| `npm run preview` | Preview production build locally |

### Detailed Script Explanations

**Development Server:**
```bash
npm run dev
```
Starts the Vite development server with Hot Module Replacement (HMR). Any changes to your code will instantly reflect in the browser without losing state.

**Production Build:**
```bash
npm run build
```
Creates an optimized production bundle in the `dist/` directory. Includes minification, tree-shaking, and all performance optimizations.

**Code Quality Check:**
```bash
npm run lint
```
Runs ESLint across the project to ensure code quality and adherence to best practices. Checks for unused variables, proper React hooks usage, and more.

**Preview Build:**
```bash
npm run preview
```
Starts a local preview server to test the production build before deployment.

## ⚙️ Configuration Files

### `vite.config.js`
Configures Vite's build process and development server, including React plugin setup and optimization options.

### `jsconfig.json`
Defines JavaScript project settings and path aliases for cleaner imports:
```javascript
import Button from "@/components/ui/button"  // Instead of ../../../components/ui/button
```

### `components.json`
shadcn/ui component library configuration, defining default component styles and customization options.

### `eslint.config.js`
ESLint rules configuration for maintaining code quality:
- React best practices
- Hook rules enforcement
- React Refresh compatibility

### `tailwind.config.js`
Tailwind CSS customization:
- Theme colors and spacing
- Font configurations
- Animation settings
- Dark mode setup

### `postcss.config.js`
PostCSS configuration for CSS processing, including Tailwind and Autoprefixer.

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration (Optional)
VITE_API_BASE_URL=http://localhost:3000

# Feature Flags (Optional)
VITE_ENABLE_ANALYTICS=true
VITE_DEBUG_MODE=false
```

**Important:** Always prefix Vite environment variables with `VITE_` to expose them to the client.

## 💡 Development Best Practices

### Component Structure
```jsx
// Good component structure
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function MyComponent() {
  const [state, setState] = useState(null);
  
  return (
    <div className="space-y-4">
      <Button onClick={() => setState(true)}>
        Click me
      </Button>
    </div>
  );
}
```

### Form Handling with React Hook Form & Zod
```jsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  );
}
```

### Real-Time Data with Supabase
```jsx
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

export function RealtimeList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Subscribe to real-time updates
    const subscription = supabase
      .from('items')
      .on('*', (payload) => {
        setItems(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => subscription.unsubscribe();
  }, []);

  return <div>{/* render items */}</div>;
}
```

## 📊 Building & Deployment

### Production Build
```bash
npm run build
```
This creates an optimized production build in the `dist/` directory.

### Deployment Options

**Vercel (Recommended for Vite apps):**
```bash
npm install -g vercel
vercel
```

**Netlify:**
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`

**Traditional Hosting:**
1. Run `npm run build`
2. Upload contents of `dist/` folder to your hosting
3. Configure server to serve `index.html` for all routes

## 🎨 Customization

### Tailwind CSS Theme
Edit `tailwind.config.js` to customize colors, fonts, and spacing:
```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
      },
    },
  },
}
```

### Adding shadcn Components
```bash
npx shadcn-ui@latest add [component-name]
# Example:
npx shadcn-ui@latest add button
```

## 🧪 Testing (Optional)

Consider adding testing libraries for production applications:
```bash
npm install --save-dev vitest @testing-library/react
```

## 📚 Resources & Documentation

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [shadcn/ui Components](https://shadcn-ui.com)
- [Supabase Documentation](https://supabase.com/docs)
- [React Router Documentation](https://reactrouter.com)
- [React Hook Form Guide](https://react-hook-form.com)
- [Zod Validation Library](https://zod.dev)

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code follows the ESLint rules and maintain the project's coding standards.

## 📝 License

This project is open source and available under the MIT License.

## 🆘 Support & Issues

If you encounter any issues or have questions:

1. **Check existing issues** - Search the [Issues page](https://github.com/AlaranUmar/Project-0/issues)
2. **Create a new issue** - Include:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Your environment (OS, Node version, etc.)
3. **Email support** - Contact the project maintainers

## 👨‍💻 Author

**AlaranUmar**
- GitHub: [@AlaranUmar](https://github.com/AlaranUmar)

---

**Happy Coding! 🚀**

*Last updated: April 2, 2026*
