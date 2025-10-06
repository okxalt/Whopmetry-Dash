import { useGameStore } from '../store/gameStore';
import { Vector2D, Obstacle, Collectible, Particle } from '../types/game';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private animationId: number | null = null;
  private lastTime = 0;
  private gravity = 0.8;
  private jumpForce = -15;
  private groundY = 400;
  private obstacleSpawnTimer = 0;
  private obstacleSpawnInterval = 120; // frames
  private collectibleSpawnTimer = 0;
  private collectibleSpawnInterval = 200; // frames

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get 2D context');
    this.ctx = ctx;
    
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        this.jump();
      }
    });

    // Touch controls
    this.canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.jump();
    });

    // Mouse controls
    this.canvas.addEventListener('click', (e) => {
      e.preventDefault();
      this.jump();
    });
  }

  private jump() {
    const { player, isPlaying, isPaused } = useGameStore.getState();
    
    if (!isPlaying || isPaused || player.isDead) return;
    
    if (!player.isJumping) {
      useGameStore.getState().updatePlayer({
        velocity: { ...player.velocity, y: this.jumpForce },
        isJumping: true
      });
    }
  }

  private updatePlayer(deltaTime: number) {
    const { player, speed, updatePlayer, updateScore, updateLives, endGame } = useGameStore.getState();
    
    if (player.isDead) return;

    // Apply gravity
    const newVelocity = {
      x: speed,
      y: player.velocity.y + this.gravity
    };

    // Update position
    const newPosition = {
      x: player.position.x + newVelocity.x * deltaTime,
      y: player.position.y + newVelocity.y * deltaTime
    };

    // Check ground collision
    if (newPosition.y >= this.groundY - player.size.y) {
      newPosition.y = this.groundY - player.size.y;
      newVelocity.y = 0;
      useGameStore.getState().updatePlayer({ isJumping: false });
    }

    // Check ceiling collision
    if (newPosition.y <= 0) {
      newPosition.y = 0;
      newVelocity.y = 0;
    }

    // Update player
    updatePlayer({
      position: newPosition,
      velocity: newVelocity
    });

    // Update score based on distance
    updateScore(Math.floor(speed * deltaTime * 0.1));

    // Check if player fell off screen
    if (newPosition.y > this.canvas.height) {
      this.handlePlayerDeath();
    }
  }

  private handlePlayerDeath() {
    const { lives, updateLives, endGame } = useGameStore.getState();
    
    if (lives > 1) {
      updateLives(-1);
      this.respawnPlayer();
    } else {
      endGame();
    }
  }

  private respawnPlayer() {
    const { resetPlayer, updatePlayer } = useGameStore.getState();
    
    resetPlayer();
    updatePlayer({
      position: { x: 100, y: 300 },
      isDead: false
    });
  }

  private updateObstacles(deltaTime: number) {
    const { obstacles, updateObstacle, removeObstacle, speed, camera } = useGameStore.getState();
    
    obstacles.forEach(obstacle => {
      // Move obstacle
      const newPosition = {
        x: obstacle.position.x - speed * deltaTime,
        y: obstacle.position.y
      };

      // Update moving obstacles
      if (obstacle.type === 'moving' && obstacle.velocity) {
        newPosition.y += obstacle.velocity.y * deltaTime;
        
        // Bounce off screen edges
        if (newPosition.y <= 0 || newPosition.y >= this.groundY - obstacle.size.y) {
          obstacle.velocity.y *= -1;
        }
      }

      // Update rotating obstacles
      if (obstacle.type === 'rotating') {
        const rotation = (obstacle.rotation || 0) + deltaTime * 0.1;
        updateObstacle(obstacle.id, { 
          position: newPosition, 
          rotation 
        });
      } else {
        updateObstacle(obstacle.id, { position: newPosition });
      }

      // Remove obstacles that are off screen
      if (newPosition.x + obstacle.size.x < camera.x - 100) {
        removeObstacle(obstacle.id);
      }
    });
  }

  private updateCollectibles(deltaTime: number) {
    const { collectibles, updateCollectible, removeCollectible, speed, camera } = useGameStore.getState();
    
    collectibles.forEach(collectible => {
      if (collectible.collected) return;

      // Animate collectible
      const animation = collectible.animation + deltaTime * 0.01;
      updateCollectible(collectible.id, { animation });

      // Remove collected items off screen
      if (collectible.position.x + collectible.size.x < camera.x - 100) {
        removeCollectible(collectible.id);
      }
    });
  }

  private updateParticles(deltaTime: number) {
    const { particles, updateParticle, removeParticle } = useGameStore.getState();
    
    particles.forEach(particle => {
      const newPosition = {
        x: particle.position.x + particle.velocity.x * deltaTime,
        y: particle.position.y + particle.velocity.y * deltaTime
      };

      const newLife = particle.life - deltaTime;
      
      updateParticle(particle.id, {
        position: newPosition,
        life: newLife
      });

      if (newLife <= 0) {
        removeParticle(particle.id);
      }
    });
  }

  private spawnObstacle() {
    const { addObstacle, level, speed } = useGameStore.getState();
    const obstacleTypes: Array<'spike' | 'platform' | 'moving' | 'rotating'> = ['spike', 'platform'];
    
    // Add more obstacle types as level increases
    if (level >= 3) obstacleTypes.push('moving');
    if (level >= 5) obstacleTypes.push('rotating');

    const type = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
    const x = this.canvas.width + 50;
    const y = this.groundY - 40;
    
    const obstacle: Obstacle = {
      id: `obstacle_${Date.now()}_${Math.random()}`,
      position: { x, y },
      size: { x: 30, y: 40 },
      type,
      color: this.getObstacleColor(type)
    };

    // Add special properties for moving and rotating obstacles
    if (type === 'moving') {
      obstacle.velocity = { x: 0, y: Math.random() * 2 - 1 };
    }

    addObstacle(obstacle);
  }

  private spawnCollectible() {
    const { addCollectible } = useGameStore.getState();
    const types: Array<'coin' | 'gem' | 'powerup'> = ['coin', 'coin', 'coin', 'gem', 'powerup'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const x = this.canvas.width + 50;
    const y = this.groundY - 60 - Math.random() * 100;
    
    const collectible: Collectible = {
      id: `collectible_${Date.now()}_${Math.random()}`,
      position: { x, y },
      size: { x: 20, y: 20 },
      type,
      value: type === 'coin' ? 1 : type === 'gem' ? 5 : 10,
      collected: false,
      animation: 0
    };

    addCollectible(collectible);
  }

  private getObstacleColor(type: string): string {
    const colors = {
      spike: '#ff4757',
      platform: '#2f3542',
      moving: '#ffa502',
      rotating: '#ff6348'
    };
    return colors[type as keyof typeof colors] || '#ff4757';
  }

  private checkCollisions() {
    const { player, obstacles, collectibles, collectItem, addParticle } = useGameStore.getState();
    
    // Check obstacle collisions
    obstacles.forEach(obstacle => {
      if (this.isColliding(player, obstacle)) {
        this.handlePlayerDeath();
        this.createExplosionParticles(player.position);
      }
    });

    // Check collectible collisions
    collectibles.forEach(collectible => {
      if (!collectible.collected && this.isColliding(player, collectible)) {
        collectItem(collectible.id);
        this.createCollectionParticles(collectible.position);
      }
    });
  }

  private isColliding(rect1: any, rect2: any): boolean {
    return rect1.position.x < rect2.position.x + rect2.size.x &&
           rect1.position.x + rect1.size.x > rect2.position.x &&
           rect1.position.y < rect2.position.y + rect2.size.y &&
           rect1.position.y + rect1.size.y > rect2.position.y;
  }

  private createExplosionParticles(position: Vector2D) {
    const { addParticle } = useGameStore.getState();
    
    for (let i = 0; i < 10; i++) {
      const particle: Particle = {
        id: `particle_${Date.now()}_${i}`,
        position: { ...position },
        velocity: {
          x: (Math.random() - 0.5) * 10,
          y: (Math.random() - 0.5) * 10
        },
        size: Math.random() * 5 + 2,
        color: '#ff6b6b',
        life: 1,
        maxLife: 1
      };
      addParticle(particle);
    }
  }

  private createCollectionParticles(position: Vector2D) {
    const { addParticle } = useGameStore.getState();
    
    for (let i = 0; i < 5; i++) {
      const particle: Particle = {
        id: `particle_${Date.now()}_${i}`,
        position: { ...position },
        velocity: {
          x: (Math.random() - 0.5) * 5,
          y: (Math.random() - 0.5) * 5
        },
        size: Math.random() * 3 + 1,
        color: '#4ecdc4',
        life: 0.5,
        maxLife: 0.5
      };
      addParticle(particle);
    }
  }

  private updateCamera() {
    const { player, updateCamera } = useGameStore.getState();
    const targetX = player.position.x - 200; // Keep player 200px from left edge
    updateCamera({ x: Math.max(0, targetX), y: 0 });
  }

  private render() {
    const { player, obstacles, collectibles, particles, camera, isPaused } = useGameStore.getState();
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Save context for camera transform
    this.ctx.save();
    this.ctx.translate(-camera.x, -camera.y);

    // Draw ground
    this.ctx.fillStyle = '#2f3542';
    this.ctx.fillRect(0, this.groundY, this.canvas.width + camera.x, this.canvas.height - this.groundY);

    // Draw obstacles
    obstacles.forEach(obstacle => {
      this.ctx.save();
      this.ctx.translate(obstacle.position.x, obstacle.position.y);
      
      if (obstacle.rotation) {
        this.ctx.rotate(obstacle.rotation);
      }
      
      this.ctx.fillStyle = obstacle.color;
      this.ctx.fillRect(0, 0, obstacle.size.x, obstacle.size.y);
      
      this.ctx.restore();
    });

    // Draw collectibles
    collectibles.forEach(collectible => {
      if (collectible.collected) return;
      
      this.ctx.save();
      this.ctx.translate(collectible.position.x, collectible.position.y);
      
      // Animate collectible
      const scale = 1 + Math.sin(collectible.animation) * 0.2;
      this.ctx.scale(scale, scale);
      
      this.ctx.fillStyle = collectible.type === 'coin' ? '#ffd700' : 
                          collectible.type === 'gem' ? '#4ecdc4' : '#ff6b6b';
      this.ctx.beginPath();
      this.ctx.arc(collectible.size.x / 2, collectible.size.y / 2, collectible.size.x / 2, 0, Math.PI * 2);
      this.ctx.fill();
      
      this.ctx.restore();
    });

    // Draw particles
    particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.position.x, particle.position.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.globalAlpha = 1;
    });

    // Draw player
    this.ctx.fillStyle = player.color;
    this.ctx.fillRect(player.position.x, player.position.y, player.size.x, player.size.y);

    // Restore context
    this.ctx.restore();

    // Draw pause overlay
    if (isPaused) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      this.ctx.fillStyle = 'white';
      this.ctx.font = '48px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
    }
  }

  public update(currentTime: number) {
    if (!useGameStore.getState().isPlaying) return;

    const deltaTime = (currentTime - this.lastTime) / 16.67; // Normalize to 60fps
    this.lastTime = currentTime;

    // Update game objects
    this.updatePlayer(deltaTime);
    this.updateObstacles(deltaTime);
    this.updateCollectibles(deltaTime);
    this.updateParticles(deltaTime);
    this.updateCamera();

    // Spawn new objects
    this.obstacleSpawnTimer += deltaTime;
    if (this.obstacleSpawnTimer >= this.obstacleSpawnInterval) {
      this.spawnObstacle();
      this.obstacleSpawnTimer = 0;
    }

    this.collectibleSpawnTimer += deltaTime;
    if (this.collectibleSpawnTimer >= this.collectibleSpawnInterval) {
      this.spawnCollectible();
      this.collectibleSpawnTimer = 0;
    }

    // Check collisions
    this.checkCollisions();

    // Render
    this.render();
  }

  public start() {
    const gameLoop = (currentTime: number) => {
      this.update(currentTime);
      this.animationId = requestAnimationFrame(gameLoop);
    };
    this.animationId = requestAnimationFrame(gameLoop);
  }

  public stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  public resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.groundY = height - 100;
  }
}