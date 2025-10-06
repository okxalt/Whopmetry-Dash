import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { GameEngine } from '../game/GameEngine';
import { GameUI } from './GameUI';
import { MainMenu } from './MainMenu';
import { GameOverMenu } from './GameOverMenu';
import { PauseMenu } from './PauseMenu';
import { Shop } from './Shop';

export const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const [showShop, setShowShop] = useState(false);
  
  const { 
    isPlaying, 
    isPaused, 
    isGameOver, 
    startGame, 
    pauseGame, 
    resumeGame, 
    resetGame 
  } = useGameStore();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize game engine
    gameEngineRef.current = new GameEngine(canvas);
    
    // Handle window resize
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = rect.width * dpr;
      const height = rect.height * dpr;
      
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      gameEngineRef.current?.resize(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      gameEngineRef.current?.stop();
    };
  }, []);

  useEffect(() => {
    if (isPlaying && !isPaused) {
      gameEngineRef.current?.start();
    } else {
      gameEngineRef.current?.stop();
    }
  }, [isPlaying, isPaused]);

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.code === 'Escape') {
      if (isPlaying && !isPaused) {
        pauseGame();
      } else if (isPlaying && isPaused) {
        resumeGame();
      }
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, isPaused]);

  const handleStartGame = () => {
    resetGame();
    startGame();
  };

  const handleRestartGame = () => {
    resetGame();
    startGame();
  };

  const handleResumeGame = () => {
    resumeGame();
  };

  const handlePauseGame = () => {
    pauseGame();
  };

  const handleOpenShop = () => {
    setShowShop(true);
  };

  const handleCloseShop = () => {
    setShowShop(false);
  };

  return (
    <div className="game-container">
      <canvas
        ref={canvasRef}
        className="game-canvas"
        style={{
          width: '100%',
          maxWidth: '800px',
          height: '600px',
          maxHeight: '80vh'
        }}
      />
      
      <GameUI 
        onPause={handlePauseGame}
        onOpenShop={handleOpenShop}
      />

      {!isPlaying && !isGameOver && (
        <MainMenu 
          onStartGame={handleStartGame}
          onOpenShop={handleOpenShop}
        />
      )}

      {isGameOver && (
        <GameOverMenu 
          onRestart={handleRestartGame}
          onMainMenu={() => {
            resetGame();
            setShowShop(false);
          }}
        />
      )}

      {isPaused && (
        <PauseMenu 
          onResume={handleResumeGame}
          onRestart={handleRestartGame}
          onMainMenu={() => {
            resetGame();
            setShowShop(false);
          }}
        />
      )}

      {showShop && (
        <Shop onClose={handleCloseShop} />
      )}
    </div>
  );
};