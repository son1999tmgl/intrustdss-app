import { AuthSession, UserProfile } from '@superapp/core-contracts';

/**
 * Quản lý phiên đăng nhập SSO tập trung của Super App
 */
class AuthStorageService {
  private session: AuthSession | null = null;
  private listeners: Array<(session: AuthSession | null) => void> = [];

  setSession(session: AuthSession): void {
    this.session = session;
    this.notifyListeners();
  }

  getSession(): AuthSession | null {
    return this.session;
  }

  getAccessToken(): string | null {
    return this.session?.accessToken || null;
  }

  getUser(): UserProfile | null {
    return this.session?.user || null;
  }

  isAuthenticated(): boolean {
    return !!this.session?.accessToken;
  }

  clearSession(): void {
    this.session = null;
    this.notifyListeners();
  }

  subscribe(listener: (session: AuthSession | null) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.session));
  }
}

export const authStorage = new AuthStorageService();
