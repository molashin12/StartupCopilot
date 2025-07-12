# StartupCopilot 🚀

> AI-powered startup consultant platform with Firebase authentication, business plan generation, and comprehensive startup guidance tools

## 🌟 Features

> **Latest Update (December 2024)**: Complete UI transformation with professional blue/emerald color scheme and Firebase Firestore database optimization for enhanced performance and reliability.

### 🔐 Authentication System
- **Email/Password Authentication** - Secure user registration and login
- **Google OAuth Integration** - One-click social authentication
- **Password Reset** - Email-based password recovery
- **Session Management** - Persistent user sessions with automatic token refresh
- **Protected Routes** - Role-based access control

### 🤖 AI-Powered Tools
- **Business Plan Generator** - AI-driven comprehensive business plan creation
- **Market Analysis** - Intelligent market research and competitor analysis
- **Financial Projections** - Automated financial modeling and forecasting
- **Startup Guidance** - Personalized recommendations and insights

### 🚀 Performance & Reliability
- **Optimized Database** - Firebase Firestore with composite indexes for fast queries
- **Error-Free Dashboard** - Resolved all Firebase index errors for seamless operation
- **Scalable Architecture** - Built to handle high-volume operations
- **Real-time Updates** - Instant data synchronization across all devices

### 🎨 Modern UI/UX
- **Professional Design** - Blue/emerald color scheme for business credibility
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Component Library** - Reusable UI components with consistent design
- **Dark/Light Mode** - Theme switching capability
- **Accessibility** - WCAG compliant interface
- **Glass Morphism** - Modern visual effects and smooth animations

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **AI Integration**: Google Gemini API
- **State Management**: React Context + Hooks
- **Form Handling**: React Hook Form
- **Deployment**: Vercel (recommended)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Firebase project with Authentication and Firestore enabled
- Google Gemini API key (optional, for AI features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/molashin12/StartupCopilot.git
   cd StartupCopilot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Update `.env.local` with your credentials:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
   
   # AI Configuration (Optional)
   GOOGLE_GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Deploy Firebase indexes (first time setup)**
   ```bash
   firebase deploy --only firestore:indexes
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Protected dashboard pages
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── ui/               # Base UI components
│   └── layout/           # Layout components
├── contexts/             # React Context providers
│   └── AuthContext.tsx  # Authentication context
├── config/               # Configuration files
│   └── firebase.ts       # Firebase configuration
├── lib/                  # Utility libraries
│   ├── ai.ts            # AI integration utilities
│   ├── firebase.ts      # Firebase service functions
│   └── utils.ts         # General utilities
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── store/                # State management
```

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password and Google providers
3. Create a Firestore database
4. Copy your Firebase config to `.env.local`

For detailed setup instructions, see [FIREBASE_SETUP_GUIDE.md](./FIREBASE_SETUP_GUIDE.md)

### Google Gemini API (Optional)

1. Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to your `.env.local` file

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy automatically on every push

### Other Platforms

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🔒 Security Features

- **Environment Variable Validation** - Prevents deployment with missing configs
- **Firebase Security Rules** - Database-level access control
- **Input Sanitization** - XSS protection on all user inputs
- **CSRF Protection** - Built-in Next.js CSRF protection
- **Rate Limiting** - API endpoint protection
- **Optimized Database Queries** - Composite indexes prevent unauthorized data access
- **Performance Monitoring** - Real-time error tracking and resolution

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📋 Documentation

- **Setup Guide**: [README.md](./README.md) - Quick start and installation
- **Architecture**: [docs/SYSTEM_ARCHITECTURE.md](./docs/SYSTEM_ARCHITECTURE.md) - System design and structure
- **UI/UX Guide**: [docs/UI_UX_DESIGN.md](./docs/UI_UX_DESIGN.md) - Design system and components
- **Development Rules**: [docs/PROJECT_RULES.md](./docs/PROJECT_RULES.md) - Coding standards and best practices
- **Database Design**: [docs/DATABASE_DESIGN.md](./docs/DATABASE_DESIGN.md) - Data models and relationships
- **AI Functions**: [docs/AI_FUNCTIONS.md](./docs/AI_FUNCTIONS.md) - AI integration details
- **Changelog**: [CHANGELOG.md](./CHANGELOG.md) - Version history and updates

## 🆘 Support

- **Documentation**: Check our [docs](./docs/) folder for comprehensive guides
- **Issues**: Report bugs via [GitHub Issues](https://github.com/molashin12/StartupCopilot/issues)
- **Discussions**: Join our [GitHub Discussions](https://github.com/molashin12/StartupCopilot/discussions)
- **Updates**: See [CHANGELOG.md](./CHANGELOG.md) for latest changes

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Firebase](https://firebase.google.com/) for backend services
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Google Gemini](https://deepmind.google/technologies/gemini/) for AI capabilities

---

**Built with ❤️ for the startup community**
