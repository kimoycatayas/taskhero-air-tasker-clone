import { authApi } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface Offer {
  id: string;
  task_id: string;
  user_id: string;
  amount: number;
  currency: string;
  message?: string;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  created_at: string;
  updated_at: string;
}

export interface CreateOfferRequest {
  task_id: string;
  amount: number;
  currency?: string;
  message?: string;
}

export interface UpdateOfferRequest {
  amount?: number;
  message?: string;
  status?: "pending" | "accepted" | "rejected" | "withdrawn";
}

export interface ApiResponse<T> {
  status: "success" | "error";
  message?: string;
  data?: T;
  count?: number;
}

class OffersApi {
  private getHeaders(includeAuth: boolean = true): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    };

    if (includeAuth) {
      const token = authApi.getAccessToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async getOffersByTask(taskId: string): Promise<Offer[]> {
    const response = await fetch(
      `${API_BASE_URL}/api/offers/task/${taskId}`,
      {
        method: "GET",
        headers: this.getHeaders(),
      }
    );

    const result: ApiResponse<Offer[]> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch offers");
    }

    return result.data || [];
  }

  async getMyOffers(): Promise<Offer[]> {
    const response = await fetch(`${API_BASE_URL}/api/offers/my-offers`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    const result: ApiResponse<Offer[]> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch offers");
    }

    return result.data || [];
  }

  async getOfferById(id: string): Promise<Offer> {
    const response = await fetch(`${API_BASE_URL}/api/offers/${id}`, {
      method: "GET",
      headers: this.getHeaders(),
    });

    const result: ApiResponse<Offer> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to fetch offer");
    }

    if (!result.data) {
      throw new Error("Offer not found");
    }

    return result.data;
  }

  async createOffer(data: CreateOfferRequest): Promise<Offer> {
    const response = await fetch(`${API_BASE_URL}/api/offers`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    const result: ApiResponse<Offer> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to create offer");
    }

    if (!result.data) {
      throw new Error("Failed to create offer");
    }

    return result.data;
  }

  async updateOffer(id: string, data: UpdateOfferRequest): Promise<Offer> {
    const response = await fetch(`${API_BASE_URL}/api/offers/${id}`, {
      method: "PUT",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    const result: ApiResponse<Offer> = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Failed to update offer");
    }

    if (!result.data) {
      throw new Error("Failed to update offer");
    }

    return result.data;
  }

  async deleteOffer(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/offers/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const result: ApiResponse<void> = await response.json();
      throw new Error(result.message || "Failed to delete offer");
    }
  }
}

export const offersApi = new OffersApi();

