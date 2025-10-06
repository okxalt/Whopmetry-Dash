import { create } from 'zustand';
import { GameState, Player, Obstacle, Collectible, Particle, GameSettings, ShopItem } from '../types/game';

interface GameStore extends GameState {
  player: Player;
  obstacles: Obstacle[];
  collectibles: Collectible[];
  particles: Particle[];
  settings: GameSettings;
  shopItems: ShopItem[];
  
  // Actions
  setPlaying: (playing: boolean) => void;
  setPaused: (paused: boolean) => void;
  setGameOver: (gameOver: boolean) => void;
  updateScore: (points: number) => void;
  updateCoins: (coins: number) => void;
  updateLives: (lives: number) => void;
  setLevel: (level: number) => void;
  updateSpeed: (speed: number) => void;
  updateCamera: (camera: { x: number; y: number }) => void;
  
  // Player actions
  updatePlayer: (player: Partial<Player>) => void;
  resetPlayer: () => void;
  
  // Game objects
  addObstacle: (obstacle: Obstacle) => void;
  removeObstacle: (id: string) => void;
  updateObstacle: (id: string, updates: Partial<Obstacle>) => void;
  clearObstacles: () => void;
  
  addCollectible: (collectible: Collectible) => void;
  removeCollectible: (id: string) => void;
  collectItem: (id: string) => void;
  clearCollectibles: () => void;
  
  addParticle: (particle: Particle) => void;
  removeParticle: (id: string) => void;
  updateParticle: (id: string, updates: Partial<Particle>) => void;
  clearParticles: () => void;
  
  // Settings
  updateSettings: (settings: Partial<GameSettings>) => void;
  
  // Shop
  purchaseItem: (itemId: string) => void;
  equipItem: (itemId: string) => void;
  updateShopItems: (items: ShopItem[]) => void;
  
  
  // Game control
  resetGame: () => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
}

const initialPlayer: Player = {
  position: { x: 100, y: 300 },
  velocity: { x: 0, y: 0 },
  size: { x: 30, y: 30 },
  isJumping: false,
  isDead: false,
  color: '#ff6b6b',
  skin: 'default'
};

const initialSettings: GameSettings = {
  soundEnabled: true,
  musicEnabled: true,
  soundVolume: 0.5,
  musicVolume: 0.3,
  difficulty: 'normal',
  graphics: 'high'
};

const initialShopItems: ShopItem[] = [
  {
    id: 'skin_rainbow',
    name: 'Rainbow Skin',
    description: 'A colorful rainbow skin for your character',
    price: 100,
    type: 'skin',
    unlocked: false,
    equipped: false
  },
  {
    id: 'skin_neon',
    name: 'Neon Skin',
    description: 'A glowing neon skin',
    price: 200,
    type: 'skin',
    unlocked: false,
    equipped: false
  },
  {
    id: 'powerup_shield',
    name: 'Shield Powerup',
    description: 'Protects you from one hit',
    price: 50,
    type: 'powerup',
    unlocked: false,
    equipped: false
  },
  {
    id: 'cosmetic_trail',
    name: 'Particle Trail',
    description: 'Adds a cool particle trail',
    price: 75,
    type: 'cosmetic',
    unlocked: false,
    equipped: false
  }
];

export const useGameStore = create<GameStore>((set) => ({
  // Initial state
  isPlaying: false,
  isPaused: false,
  isGameOver: false,
  score: 0,
  coins: 0,
  lives: 3,
  level: 1,
  speed: 2,
  camera: { x: 0, y: 0 },
  
  player: initialPlayer,
  obstacles: [],
  collectibles: [],
  particles: [],
  settings: initialSettings,
  shopItems: initialShopItems,
  
  // Actions
  setPlaying: (playing) => set({ isPlaying: playing }),
  setPaused: (paused) => set({ isPaused: paused }),
  setGameOver: (gameOver) => set({ isGameOver: gameOver }),
  updateScore: (points) => set((state) => ({ score: state.score + points })),
  updateCoins: (coins) => set((state) => ({ coins: Math.max(0, state.coins + coins) })),
  updateLives: (lives) => set((state) => ({ lives: Math.max(0, state.lives + lives) })),
  setLevel: (level) => set({ level }),
  updateSpeed: (speed) => set({ speed }),
  updateCamera: (camera) => set({ camera }),
  
  // Player actions
  updatePlayer: (updates) => set((state) => ({ 
    player: { ...state.player, ...updates } 
  })),
  resetPlayer: () => set({ player: initialPlayer }),
  
  // Game objects
  addObstacle: (obstacle) => set((state) => ({ 
    obstacles: [...state.obstacles, obstacle] 
  })),
  removeObstacle: (id) => set((state) => ({ 
    obstacles: state.obstacles.filter(o => o.id !== id) 
  })),
  updateObstacle: (id, updates) => set((state) => ({
    obstacles: state.obstacles.map(o => 
      o.id === id ? { ...o, ...updates } : o
    )
  })),
  clearObstacles: () => set({ obstacles: [] }),
  
  addCollectible: (collectible) => set((state) => ({ 
    collectibles: [...state.collectibles, collectible] 
  })),
  removeCollectible: (id) => set((state) => ({ 
    collectibles: state.collectibles.filter(c => c.id !== id) 
  })),
  collectItem: (id) => set((state) => {
    const item = state.collectibles.find(c => c.id === id);
    if (item) {
      return {
        collectibles: state.collectibles.map(c => 
          c.id === id ? { ...c, collected: true } : c
        ),
        coins: state.coins + item.value,
        score: state.score + item.value * 10
      };
    }
    return state;
  }),
  clearCollectibles: () => set({ collectibles: [] }),
  
  addParticle: (particle) => set((state) => ({ 
    particles: [...state.particles, particle] 
  })),
  removeParticle: (id) => set((state) => ({ 
    particles: state.particles.filter(p => p.id !== id) 
  })),
  updateParticle: (id, updates) => set((state) => ({
    particles: state.particles.map(p => 
      p.id === id ? { ...p, ...updates } : p
    )
  })),
  clearParticles: () => set({ particles: [] }),
  
  // Settings
  updateSettings: (updates) => set((state) => ({ 
    settings: { ...state.settings, ...updates } 
  })),
  
  // Shop
  purchaseItem: (itemId) => set((state) => {
    const item = state.shopItems.find(i => i.id === itemId);
    if (item && !item.unlocked && state.coins >= item.price) {
      return {
        shopItems: state.shopItems.map(i => 
          i.id === itemId ? { ...i, unlocked: true } : i
        ),
        coins: state.coins - item.price
      };
    }
    return state;
  }),
  equipItem: (itemId) => set((state) => {
    const item = state.shopItems.find(i => i.id === itemId);
    if (item && item.unlocked) {
      return {
        shopItems: state.shopItems.map(i => ({
          ...i,
          equipped: i.id === itemId && i.type === 'skin'
        })),
        player: { ...state.player, skin: itemId }
      };
    }
    return state;
  }),
  
  updateShopItems: (items) => set({ shopItems: items }),
  
  
  // Game control
  resetGame: () => set({
    isPlaying: false,
    isPaused: false,
    isGameOver: false,
    score: 0,
    lives: 3,
    level: 1,
    speed: 2,
    camera: { x: 0, y: 0 },
    player: initialPlayer,
    obstacles: [],
    collectibles: [],
    particles: []
  }),
  startGame: () => set({ 
    isPlaying: true, 
    isPaused: false, 
    isGameOver: false 
  }),
  pauseGame: () => set({ isPaused: true }),
  resumeGame: () => set({ isPaused: false }),
  endGame: () => set({ 
    isPlaying: false, 
    isGameOver: true 
  })
}));