import React from 'react';
import { Play, ShoppingCart, Settings, Trophy } from 'lucide-react';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenShop: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame, onOpenShop }) => {
  return (
    <div className="menu">
      <h1>Whopmetry Dash</h1>
      <p style={{ marginBottom: '30px', fontSize: '18px', opacity: 0.8 }}>
        Jump, dodge, and collect coins in this Geometry Dash inspired game!
      </p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button onClick={onStartGame}>
          <Play size={20} style={{ marginRight: '10px' }} />
          Start Game
        </button>
        
        <button onClick={onOpenShop}>
          <ShoppingCart size={20} style={{ marginRight: '10px' }} />
          Shop
        </button>
        
        <button>
          <Trophy size={20} style={{ marginRight: '10px' }} />
          Leaderboard
        </button>
        
        <button>
          <Settings size={20} style={{ marginRight: '10px' }} />
          Settings
        </button>
      </div>
      
      <div style={{ 
        marginTop: '30px', 
        fontSize: '14px', 
        opacity: 0.6,
        textAlign: 'center'
      }}>
        <p>Press SPACE or click to jump</p>
        <p>Press ESC to pause</p>
      </div>
    </div>
  );
};