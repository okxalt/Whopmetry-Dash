import React from 'react';
import { useGameStore } from '../store/gameStore';
import { RotateCcw, Home, Trophy, Share2 } from 'lucide-react';

interface GameOverMenuProps {
  onRestart: () => void;
  onMainMenu: () => void;
}

export const GameOverMenu: React.FC<GameOverMenuProps> = ({ onRestart, onMainMenu }) => {
  const { score, coins, level } = useGameStore();

  const handleShare = async () => {
    const shareText = `I just scored ${score} points in Whopmetry Dash! Can you beat my score? 🎮`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Whopmetry Dash',
          text: shareText,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Score copied to clipboard!');
      } catch (err) {
        console.log('Error copying to clipboard:', err);
      }
    }
  };

  return (
    <div className="menu game-over">
      <h2>Game Over!</h2>
      
      <div className="final-score">
        <div style={{ fontSize: '32px', marginBottom: '10px' }}>
          Final Score: {score.toLocaleString()}
        </div>
        <div style={{ fontSize: '20px', marginBottom: '5px' }}>
          Coins Collected: {coins}
        </div>
        <div style={{ fontSize: '20px', marginBottom: '20px' }}>
          Level Reached: {level}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button onClick={onRestart}>
          <RotateCcw size={20} style={{ marginRight: '10px' }} />
          Play Again
        </button>
        
        <button onClick={onMainMenu}>
          <Home size={20} style={{ marginRight: '10px' }} />
          Main Menu
        </button>
        
        <button onClick={handleShare}>
          <Share2 size={20} style={{ marginRight: '10px' }} />
          Share Score
        </button>
      </div>

      <div style={{ 
        marginTop: '20px', 
        fontSize: '12px', 
        opacity: 0.6,
        textAlign: 'center'
      }}>
        <p>Great job! Try to beat your high score!</p>
      </div>
    </div>
  );
};