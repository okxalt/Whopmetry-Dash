import React from 'react';
import { Play, RotateCcw, Home, Settings } from 'lucide-react';

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onMainMenu: () => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({ onResume, onRestart, onMainMenu }) => {
  return (
    <div className="menu pause-menu">
      <h3>Game Paused</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <button onClick={onResume}>
          <Play size={20} style={{ marginRight: '10px' }} />
          Resume
        </button>
        
        <button onClick={onRestart}>
          <RotateCcw size={20} style={{ marginRight: '10px' }} />
          Restart
        </button>
        
        <button onClick={onMainMenu}>
          <Home size={20} style={{ marginRight: '10px' }} />
          Main Menu
        </button>
      </div>

      <div style={{ 
        marginTop: '20px', 
        fontSize: '12px', 
        opacity: 0.6,
        textAlign: 'center'
      }}>
        <p>Press ESC to resume</p>
      </div>
    </div>
  );
};