# Deployment Guide for Whopmetry Dash

## 🚀 Vercel Deployment

### Prerequisites
- Vercel account
- GitHub repository with your code
- Whop API credentials

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your GitHub repository

### Step 2: Configure Environment Variables

In your Vercel project dashboard:

1. Go to **Settings** → **Environment Variables**
2. Add the following variables:

```
VITE_WHOP_API_BASE = https://api.whop.com/api/v2
VITE_WHOP_API_KEY = your_whop_api_key_here
VITE_GAME_TITLE = Whopmetry Dash
VITE_DEFAULT_DIFFICULTY = normal
VITE_MAX_LIVES = 3
```

### Step 3: Deploy

1. Click **Deploy** in your Vercel dashboard
2. Wait for the build to complete
3. Your game will be available at `https://your-project-name.vercel.app`

### Step 4: Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS settings as instructed

## 🔧 Local Development

### Quick Start
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Build for Production
```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

## 🎮 Game Features

### Core Gameplay
- **Jump Mechanics**: Space bar or click to jump
- **Obstacle Avoidance**: Dodge spikes, platforms, and moving obstacles
- **Coin Collection**: Collect coins to unlock shop items
- **Progressive Difficulty**: Speed increases as you progress

### Controls
- **Desktop**: Space bar or Arrow Up to jump, Escape to pause
- **Mobile**: Tap screen to jump
- **Universal**: Click anywhere to jump

### Shop System
- **Skins**: Change character appearance
- **Powerups**: Temporary gameplay enhancements
- **Cosmetics**: Visual effects and trails

## 🔌 Whop Integration

### API Setup
1. Get your Whop API key from the Whop dashboard
2. Set up your API endpoints for:
   - User authentication
   - Purchase processing
   - Leaderboard management
   - Analytics tracking

### Features
- **User Data Sync**: Progress saved to Whop
- **Purchase Processing**: Real money transactions
- **Premium Content**: Exclusive items for paid users
- **Analytics**: Player behavior tracking

## 🐛 Troubleshooting

### Common Issues

**Build Fails:**
- Check environment variables are set
- Ensure all dependencies are installed
- Check TypeScript errors in console

**Game Not Loading:**
- Verify browser supports Web Audio API
- Check console for JavaScript errors
- Ensure all assets are loading correctly

**Whop API Errors:**
- Verify API key is correct
- Check API endpoint URLs
- Ensure CORS is configured properly

### Support
- Check the main README.md for detailed documentation
- Review console logs for error messages
- Test in different browsers

## 📱 Mobile Optimization

The game is fully responsive and optimized for:
- **iOS Safari**: Touch controls
- **Android Chrome**: Touch controls
- **Desktop Browsers**: Keyboard and mouse

## 🎯 Performance Tips

- **Audio**: Uses Web Audio API for efficient sound generation
- **Rendering**: 60fps Canvas-based rendering
- **Memory**: Automatic cleanup of off-screen objects
- **Loading**: Optimized bundle size with Vite

---

**Ready to deploy? Follow the steps above and your Whopmetry Dash game will be live! 🎮✨**