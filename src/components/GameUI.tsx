import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Play, Pause, ShoppingCart, Heart, Coins } from 'lucide-react';

interface GameUIProps {
  onPause: () => void;
  onOpenShop: () => void;
}

export const GameUI: React.FC<GameUIProps> = ({ onPause, onOpenShop }) => {
  const { score, coins, lives, isPaused } = useGameStore();

  return (
    <div className="ui-overlay">
      {/* Score */}
      <div className="ui-element score">
        Score: {score.toLocaleString()}
      </div>

      {/* Coins */}
      <div className="ui-element coins">
        <Coins size={20} />
        {coins}
      </div>

      {/* Lives */}
      <div className="ui-element lives">
        <Heart size={18} />
        {lives}
      </div>

      {/* Pause Button */}
      <button
        className="ui-element"
        style={{
          top: '20px',
          right: '80px',
          background: 'rgba(0, 0, 0, 0.5)',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white'
        }}
        onClick={onPause}
      >
        {isPaused ? <Play size={24} /> : <Pause size={24} />}
      </button>

      {/* Shop Button */}
      <button
        className="ui-element"
        style={{
          top: '20px',
          right: '140px',
          background: 'rgba(0, 0, 0, 0.5)',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'white'
        }}
        onClick={onOpenShop}
      >
        <ShoppingCart size={24} />
      </button>
    </div>
  );
};