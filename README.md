# Whopmetry Dash 🎮

A Geometry Dash-inspired endless runner game built for Whop with integrated monetization features. Jump, dodge obstacles, collect coins, and unlock new skins and powerups!

![Game Preview](https://via.placeholder.com/800x400/667eea/ffffff?text=Whopmetry+Dash+Game)

## 🚀 Features

### Core Gameplay
- **Endless Runner**: Jump over obstacles and collect coins in an endless scrolling world
- **Physics-Based Movement**: Realistic gravity and jump mechanics
- **Progressive Difficulty**: Game speed increases as you progress
- **Multiple Obstacle Types**: Spikes, platforms, moving obstacles, and rotating challenges
- **Collectible System**: Coins, gems, and powerups to enhance gameplay

### Visual & Audio
- **Smooth Animations**: 60fps gameplay with fluid character movement
- **Particle Effects**: Explosion and collection particles for visual feedback
- **Procedural Audio**: Generated sound effects and background music
- **Responsive Design**: Works on desktop and mobile devices

### Monetization & Whop Integration
- **In-Game Shop**: Purchase skins, powerups, and cosmetics with earned coins
- **Premium Features**: Special content for Whop premium users
- **Leaderboards**: Compete with other players globally
- **Progress Tracking**: Sync your progress with Whop API
- **Analytics**: Track player behavior and engagement

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **State Management**: Zustand
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Deployment**: Vercel
- **Audio**: Web Audio API

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd whopmetry-dash
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your Whop API credentials:
   ```env
   VITE_WHOP_API_BASE=https://api.whop.com/api/v2
   VITE_WHOP_API_KEY=your_whop_api_key_here
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎮 How to Play

### Controls
- **Space Bar** or **Arrow Up**: Jump
- **Click/Tap**: Jump (mobile)
- **Escape**: Pause/Resume game

### Gameplay
1. **Jump** over obstacles to avoid collision
2. **Collect coins** to earn currency for the shop
3. **Avoid spikes** and other dangerous obstacles
4. **Use powerups** to enhance your gameplay
5. **Unlock new skins** and cosmetics in the shop

### Scoring
- **Distance**: Earn points for every unit traveled
- **Coins**: Each coin collected adds to your score
- **Survival**: Longer runs = higher scores

## 🛒 Shop System

### Available Items
- **Skins**: Change your character's appearance
  - Rainbow Skin (100 coins)
  - Neon Skin (200 coins)
- **Powerups**: Temporary gameplay enhancements
  - Shield Powerup (50 coins) - Protects from one hit
- **Cosmetics**: Visual effects
  - Particle Trail (75 coins)

### Premium Features
- **Exclusive Skins**: Special skins for Whop premium users
- **Double Coins**: Earn 2x coins for premium users
- **Ad-Free Experience**: No interruptions for premium users

## 🔧 Configuration

### Game Settings
- **Sound Volume**: Adjust sound effects volume (0-1)
- **Music Volume**: Adjust background music volume (0-1)
- **Difficulty**: Easy, Normal, Hard, Expert
- **Graphics**: Low, Medium, High quality settings

### Whop API Integration
The game integrates with Whop API for:
- User authentication and data sync
- Purchase processing
- Leaderboard management
- Analytics tracking
- Premium feature validation

## 📱 Mobile Support

The game is fully responsive and works on:
- **iOS Safari**: Touch controls supported
- **Android Chrome**: Touch controls supported
- **Desktop Browsers**: Keyboard and mouse controls

## 🚀 Deployment

### Vercel Deployment

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables**
   In Vercel dashboard, add:
   - `VITE_WHOP_API_BASE`
   - `VITE_WHOP_API_KEY`

### Manual Build
```bash
npm run build
# Deploy the 'dist' folder to your hosting provider
```

## 🎨 Customization

### Adding New Obstacles
1. Add obstacle type to `Obstacle` interface in `src/types/game.ts`
2. Implement rendering logic in `GameEngine.ts`
3. Add spawn logic in `spawnObstacle()` method

### Adding New Skins
1. Add skin to `ShopItem` array in `src/store/gameStore.ts`
2. Implement skin rendering in `GameEngine.ts`
3. Add skin preview in `Shop.tsx`

### Adding New Audio
1. Add sound to `AudioManager` in `src/utils/audioManager.ts`
2. Generate procedural sound or load audio file
3. Play sound in appropriate game events

## 🐛 Troubleshooting

### Common Issues

**Audio not playing:**
- Check browser autoplay policies
- Ensure user has interacted with the page first
- Check console for audio context errors

**Game not loading:**
- Verify all dependencies are installed
- Check browser console for errors
- Ensure environment variables are set

**Whop API errors:**
- Verify API key is correct
- Check API endpoint URLs
- Ensure user authentication is working

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Geometry Dash by RobTop Games
- Built for the Whop community
- Uses Web Audio API for procedural sound generation
- Icons by Lucide React

## 📞 Support

For support, email support@whop.com or join our Discord community.

---

**Happy Gaming! 🎮✨**