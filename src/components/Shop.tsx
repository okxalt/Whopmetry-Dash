import React, { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';
import { X, Coins, Star, Zap } from 'lucide-react';

interface ShopProps {
  onClose: () => void;
}

export const Shop: React.FC<ShopProps> = ({ onClose }) => {
  const { shopItems, coins, purchaseItem, equipItem, updateShopItems } = useGameStore();

  // Load saved data from localStorage on mount
  useEffect(() => {
    const savedCoins = localStorage.getItem('whopmetry-coins');
    const savedShopItems = localStorage.getItem('whopmetry-shop');
    
    if (savedCoins) {
      useGameStore.getState().updateCoins(parseInt(savedCoins) - coins);
    }
    
    if (savedShopItems) {
      const parsedItems = JSON.parse(savedShopItems);
      updateShopItems(parsedItems);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('whopmetry-coins', coins.toString());
    localStorage.setItem('whopmetry-shop', JSON.stringify(shopItems));
  }, [coins, shopItems]);

  const handlePurchase = (itemId: string) => {
    purchaseItem(itemId);
  };

  const handleEquip = (itemId: string) => {
    equipItem(itemId);
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'skin':
        return <Star size={20} />;
      case 'powerup':
        return <Zap size={20} />;
      case 'cosmetic':
        return <Star size={20} />;
      default:
        return <Star size={20} />;
    }
  };

  return (
    <div className="menu shop">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <h2>Shop</h2>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '5px'
          }}
        >
          <X size={24} />
        </button>
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        marginBottom: '20px',
        fontSize: '18px',
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '10px',
        borderRadius: '10px'
      }}>
        <Coins size={20} style={{ marginRight: '10px' }} />
        Your Coins: {coins}
      </div>

      <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {shopItems.map((item) => (
          <div key={item.id} className="shop-item">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {getItemIcon(item.type)}
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                  {item.name}
                </div>
                <div style={{ fontSize: '12px', opacity: 0.8 }}>
                  {item.description}
                </div>
                <div style={{ fontSize: '14px', color: '#4ecdc4' }}>
                  {item.price} coins
                </div>
              </div>
            </div>
            
            <div>
              {!item.unlocked ? (
                <button
                  onClick={() => handlePurchase(item.id)}
                  disabled={coins < item.price}
                >
                  Buy
                </button>
              ) : item.type === 'skin' ? (
                <button
                  onClick={() => handleEquip(item.id)}
                  style={{
                    background: item.equipped ? '#4ecdc4' : 'rgba(255, 255, 255, 0.2)'
                  }}
                >
                  {item.equipped ? 'Equipped' : 'Equip'}
                </button>
              ) : (
                <div style={{ color: '#4ecdc4', fontSize: '14px' }}>
                  Owned
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '20px', 
        fontSize: '12px', 
        opacity: 0.6,
        textAlign: 'center'
      }}>
        <p>More items coming soon! Earn coins by playing the game.</p>
      </div>
    </div>
  );
};