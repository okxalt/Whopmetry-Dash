export interface Vector2D {
  x: number;
  y: number;
}

export interface Player {
  position: Vector2D;
  velocity: Vector2D;
  size: Vector2D;
  isJumping: boolean;
  isDead: boolean;
  color: string;
  skin: string;
}

export interface Obstacle {
  id: string;
  position: Vector2D;
  size: Vector2D;
  type: 'spike' | 'platform' | 'moving' | 'rotating';
  color: string;
  rotation?: number;
  velocity?: Vector2D;
}

export interface Collectible {
  id: string;
  position: Vector2D;
  size: Vector2D;
  type: 'coin' | 'gem' | 'powerup';
  value: number;
  collected: boolean;
  animation: number;
}

export interface Particle {
  id: string;
  position: Vector2D;
  velocity: Vector2D;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

export interface GameState {
  isPlaying: boolean;
  isPaused: boolean;
  isGameOver: boolean;
  score: number;
  coins: number;
  lives: number;
  level: number;
  speed: number;
  camera: Vector2D;
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundVolume: number;
  musicVolume: number;
  difficulty: 'easy' | 'normal' | 'hard' | 'expert';
  graphics: 'low' | 'medium' | 'high';
}

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'skin' | 'powerup' | 'cosmetic';
  unlocked: boolean;
  equipped: boolean;
}
