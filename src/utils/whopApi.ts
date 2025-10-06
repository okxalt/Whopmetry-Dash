import { WhopUser } from '../types/game';

// Whop API configuration
const WHOP_API_BASE = import.meta.env.VITE_WHOP_API_BASE || 'https://api.whop.com/api/v2';
const WHOP_API_KEY = import.meta.env.VITE_WHOP_API_KEY || '';

export interface WhopApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface WhopUserData {
  id: string;
  username: string;
  email: string;
  premium: boolean;
  coins: number;
  unlocked_items: string[];
  equipped_skin: string;
  high_score: number;
  total_playtime: number;
}

export interface WhopPurchaseRequest {
  item_id: string;
  item_type: 'skin' | 'powerup' | 'cosmetic';
  price: number;
}

export interface WhopLeaderboardEntry {
  user_id: string;
  username: string;
  score: number;
  level: number;
  coins: number;
  timestamp: string;
}

class WhopApiClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string) {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<WhopApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return {
        data,
        success: true,
      };
    } catch (error) {
      console.error('Whop API Error:', error);
      return {
        data: null as T,
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // User management
  async getUser(userId: string): Promise<WhopApiResponse<WhopUserData>> {
    return this.makeRequest<WhopUserData>(`/users/${userId}`);
  }

  async updateUser(userId: string, userData: Partial<WhopUserData>): Promise<WhopApiResponse<WhopUserData>> {
    return this.makeRequest<WhopUserData>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  // Game data
  async saveGameData(userId: string, gameData: {
    score: number;
    coins: number;
    level: number;
    playtime: number;
  }): Promise<WhopApiResponse<boolean>> {
    return this.makeRequest<boolean>(`/users/${userId}/game-data`, {
      method: 'POST',
      body: JSON.stringify(gameData),
    });
  }

  async getHighScores(limit: number = 10): Promise<WhopApiResponse<WhopLeaderboardEntry[]>> {
    return this.makeRequest<WhopLeaderboardEntry[]>(`/leaderboard?limit=${limit}`);
  }

  // Shop and monetization
  async purchaseItem(userId: string, purchase: WhopPurchaseRequest): Promise<WhopApiResponse<boolean>> {
    return this.makeRequest<boolean>(`/users/${userId}/purchase`, {
      method: 'POST',
      body: JSON.stringify(purchase),
    });
  }

  async getShopItems(): Promise<WhopApiResponse<any[]>> {
    return this.makeRequest<any[]>(`/shop/items`);
  }

  // Premium features
  async checkPremiumStatus(userId: string): Promise<WhopApiResponse<{ premium: boolean; expires_at?: string }>> {
    return this.makeRequest<{ premium: boolean; expires_at?: string }>(`/users/${userId}/premium`);
  }

  async activatePremiumFeature(userId: string, feature: string): Promise<WhopApiResponse<boolean>> {
    return this.makeRequest<boolean>(`/users/${userId}/premium/activate`, {
      method: 'POST',
      body: JSON.stringify({ feature }),
    });
  }

  // Analytics and tracking
  async trackEvent(userId: string, event: {
    type: string;
    data: Record<string, any>;
    timestamp: number;
  }): Promise<WhopApiResponse<boolean>> {
    return this.makeRequest<boolean>(`/analytics/track`, {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        ...event,
      }),
    });
  }
}

// Create API client instance
export const whopApi = new WhopApiClient(WHOP_API_KEY, WHOP_API_BASE);

// Utility functions for game integration
export const convertWhopUserToGameUser = (whopUser: WhopUserData): WhopUser => ({
  id: whopUser.id,
  username: whopUser.username,
  coins: whopUser.coins,
  premium: whopUser.premium,
  unlockedItems: whopUser.unlocked_items,
  equippedSkin: whopUser.equipped_skin,
});

export const convertGameUserToWhopUser = (gameUser: WhopUser): Partial<WhopUserData> => ({
  id: gameUser.id,
  username: gameUser.username,
  coins: gameUser.coins,
  premium: gameUser.premium,
  unlocked_items: gameUser.unlockedItems,
  equipped_skin: gameUser.equippedSkin,
});

// Mock data for development (when API key is not available)
export const mockWhopUser: WhopUser = {
  id: 'mock_user_123',
  username: 'TestPlayer',
  coins: 1000,
  premium: true,
  unlockedItems: ['skin_rainbow', 'cosmetic_trail'],
  equippedSkin: 'skin_rainbow',
};

export const isWhopApiAvailable = (): boolean => {
  return !!WHOP_API_KEY && WHOP_API_KEY !== '';
};