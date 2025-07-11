# StartupCopilot 🚀

> AI-powered startup consultant platform with Firebase authentication, business plan generation, and comprehensive startup guidance tools

## 🌟 Features

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

### 🎨 Modern UI/UX
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Component Library** - Reusable UI components with consistent design
- **Dark/Light Mode** - Theme switching capability
- **Accessibility** - WCAG compliant interface

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

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
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

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check our [docs](./docs/) folder
- **Issues**: Report bugs via [GitHub Issues](https://github.com/molashin12/StartupCopilot/issues)
- **Discussions**: Join our [GitHub Discussions](https://github.com/molashin12/StartupCopilot/discussions)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Firebase](https://firebase.google.com/) for backend services
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Radix UI](https://www.radix-ui.com/) for accessible components
- [Google Gemini](https://deepmind.google/technologies/gemini/) for AI capabilities

---

**Built with ❤️ for the startup community**
