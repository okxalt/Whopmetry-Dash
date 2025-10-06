import { useEffect, useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { whopApi, convertWhopUserToGameUser, mockWhopUser, isWhopApiAvailable } from '../utils/whopApi';
import { WhopUser } from '../types/game';

export const useWhopIntegration = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setWhopUser, whopUser, score, coins, level } = useGameStore();

  // Initialize Whop user
  useEffect(() => {
    const initializeWhopUser = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (isWhopApiAvailable()) {
          // In a real implementation, you would get the user ID from authentication
          const userId = 'current_user_id'; // This would come from your auth system
          const response = await whopApi.getUser(userId);
          
          if (response.success && response.data) {
            const gameUser = convertWhopUserToGameUser(response.data);
            setWhopUser(gameUser);
          } else {
            throw new Error(response.message || 'Failed to fetch user data');
          }
        } else {
          // Use mock data for development
          console.log('Using mock Whop user data for development');
          setWhopUser(mockWhopUser);
        }
      } catch (err) {
        console.error('Failed to initialize Whop user:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        // Fallback to mock data
        setWhopUser(mockWhopUser);
      } finally {
        setIsLoading(false);
      }
    };

    initializeWhopUser();
  }, [setWhopUser]);

  // Sync game data with Whop
  const syncGameData = async () => {
    if (!whopUser || !isWhopApiAvailable()) return;

    try {
      const gameData = {
        score,
        coins,
        level,
        playtime: Date.now(), // This would be actual playtime in a real implementation
      };

      const response = await whopApi.saveGameData(whopUser.id, gameData);
      
      if (!response.success) {
        console.error('Failed to sync game data:', response.message);
      }
    } catch (err) {
      console.error('Error syncing game data:', err);
    }
  };

  // Purchase item through Whop
  const purchaseItem = async (itemId: string, itemType: 'skin' | 'powerup' | 'cosmetic', price: number) => {
    if (!whopUser || !isWhopApiAvailable()) {
      // For development, just use local store
      useGameStore.getState().purchaseItem(itemId);
      return true;
    }

    try {
      const response = await whopApi.purchaseItem(whopUser.id, {
        item_id: itemId,
        item_type: itemType,
        price,
      });

      if (response.success) {
        // Update local store
        useGameStore.getState().purchaseItem(itemId);
        return true;
      } else {
        console.error('Purchase failed:', response.message);
        return false;
      }
    } catch (err) {
      console.error('Error purchasing item:', err);
      return false;
    }
  };

  // Track game events
  const trackEvent = async (eventType: string, eventData: Record<string, any> = {}) => {
    if (!whopUser || !isWhopApiAvailable()) return;

    try {
      await whopApi.trackEvent(whopUser.id, {
        type: eventType,
        data: eventData,
        timestamp: Date.now(),
      });
    } catch (err) {
      console.error('Error tracking event:', err);
    }
  };

  // Get leaderboard
  const getLeaderboard = async (limit: number = 10) => {
    if (!isWhopApiAvailable()) {
      // Return mock leaderboard for development
      return [
        { user_id: '1', username: 'Player1', score: 50000, level: 10, coins: 1000, timestamp: new Date().toISOString() },
        { user_id: '2', username: 'Player2', score: 45000, level: 9, coins: 900, timestamp: new Date().toISOString() },
        { user_id: '3', username: 'Player3', score: 40000, level: 8, coins: 800, timestamp: new Date().toISOString() },
      ];
    }

    try {
      const response = await whopApi.getHighScores(limit);
      return response.success ? response.data : [];
    } catch (err) {
      console.error('Error fetching leaderboard:', err);
      return [];
    }
  };

  // Check premium status
  const checkPremiumStatus = async () => {
    if (!whopUser || !isWhopApiAvailable()) {
      return whopUser?.premium || false;
    }

    try {
      const response = await whopApi.checkPremiumStatus(whopUser.id);
      return response.success ? response.data.premium : false;
    } catch (err) {
      console.error('Error checking premium status:', err);
      return false;
    }
  };

  return {
    whopUser,
    isLoading,
    error,
    syncGameData,
    purchaseItem,
    trackEvent,
    getLeaderboard,
    checkPremiumStatus,
    isApiAvailable: isWhopApiAvailable(),
  };
};