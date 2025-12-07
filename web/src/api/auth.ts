import type {
  AuthResponse,
  LoginRequest,
  SignupRequest,
  ResetPasswordRequest,
  ApiResponse,
  AuthUser,
  AuthSession,
} from "@/src/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

class AuthApi {
  private getHeaders(includeAuth: boolean = false): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (includeAuth) {
      const token = this.getAccessToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  getAccessToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  }

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refresh_token");
  }

  private saveTokens(session: AuthSession): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("access_token", session.access_token);
    localStorage.setItem("refresh_token", session.refresh_token);
    localStorage.setItem("expires_at", session.expires_at.toString());
  }

  private clearTokens(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_at");
  }

  async signup(data: SignupRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    const result: ApiResponse<AuthResponse> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Signup failed");
    }

    // Check if email confirmation is required
    if (result.data && "requiresEmailConfirmation" in result.data) {
      // User created but needs email confirmation
      throw new Error(result.message || "Please check your email to confirm your account.");
    }

    if (result.data) {
      this.saveTokens(result.data.session);
    }

    return result.data!;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    const result: ApiResponse<AuthResponse> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Login failed");
    }

    if (result.data) {
      this.saveTokens(result.data.session);
    }

    return result.data!;
  }

  async logout(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        headers: this.getHeaders(true),
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.clearTokens();
    }
  }

  async resetPassword(data: ResetPasswordRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    const result: ApiResponse<void> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Password reset request failed");
    }
  }

  async refreshSession(): Promise<AuthSession> {
    const refreshToken = this.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const result: ApiResponse<AuthSession> = await response.json();

    if (!response.ok) {
      this.clearTokens();
      throw new Error(result.message || "Session refresh failed");
    }

    if (result.data) {
      this.saveTokens(result.data);
    }

    return result.data!;
  }

  async getProfile(): Promise<AuthUser> {
    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: "GET",
      headers: this.getHeaders(true),
    });

    const result: ApiResponse<AuthUser> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch profile");
    }

    return result.data!;
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const expiresAt = localStorage.getItem("expires_at");

    if (!token || !expiresAt) return false;

    // Check if token is expired
    const now = Math.floor(Date.now() / 1000);
    return parseInt(expiresAt) > now;
  }
}

export const authApi = new AuthApi();

// Legacy exports for backward compatibility
export const Api = {
  LoginUser: (loginData: { email: string | null; password: string | null }) => {
    if (!loginData.email || !loginData.password) {
      console.error("Email and password are required");
      return;
    }
    return authApi.login({
      email: loginData.email,
      password: loginData.password,
    });
  },
  SignupUser: (signupData: { email: string | null; password: string | null }) => {
    if (!signupData.email || !signupData.password) {
      console.error("Email and password are required");
      return;
    }
    return authApi.signup({
      email: signupData.email,
      password: signupData.password,
    });
  },
};
