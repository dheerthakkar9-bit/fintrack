const API_BASE = "/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("fintrack-token");
}

function setToken(token: string) {
  localStorage.setItem("fintrack-token", token);
}

function clearToken() {
  localStorage.removeItem("fintrack-token");
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!data.success) throw new Error(data.error || "API error");
  return data.data;
}

export const api = {
  token: { get: getToken, set: setToken, clear: clearToken },

  auth: {
    login: (email: string, password: string) =>
      apiRequest<{ user: any; token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),
    register: (name: string, email: string, password: string) =>
      apiRequest<{ user: any; token: string }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      }),
    me: () => apiRequest<any>("/auth/me"),
  },

  transactions: {
    list: (params?: Record<string, string>) => {
      const qs = params ? "?" + new URLSearchParams(params).toString() : "";
      return apiRequest<any[]>(`/transactions${qs}`);
    },
    create: (data: any) =>
      apiRequest<any>("/transactions", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      apiRequest<any>(`/transactions/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      apiRequest<void>(`/transactions/${id}`, { method: "DELETE" }),
  },

  categories: {
    list: () => apiRequest<any[]>("/categories"),
    create: (data: any) =>
      apiRequest<any>("/categories", { method: "POST", body: JSON.stringify(data) }),
  },

  accounts: {
    list: () => apiRequest<any[]>("/accounts"),
    create: (data: any) =>
      apiRequest<any>("/accounts", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      apiRequest<any>(`/accounts/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      apiRequest<void>(`/accounts/${id}`, { method: "DELETE" }),
  },

  budgets: {
    list: () => apiRequest<any[]>("/budgets"),
    create: (data: any) =>
      apiRequest<any>("/budgets", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      apiRequest<any>(`/budgets/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      apiRequest<void>(`/budgets/${id}`, { method: "DELETE" }),
  },

  bills: {
    list: () => apiRequest<any[]>("/bills"),
    create: (data: any) =>
      apiRequest<any>("/bills", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      apiRequest<any>(`/bills/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      apiRequest<void>(`/bills/${id}`, { method: "DELETE" }),
  },

  savings: {
    list: () => apiRequest<any[]>("/savings"),
    create: (data: any) =>
      apiRequest<any>("/savings", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: any) =>
      apiRequest<any>(`/savings/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      apiRequest<void>(`/savings/${id}`, { method: "DELETE" }),
  },

  user: {
    updateSettings: (data: { name?: string; email?: string; currency?: string; theme?: string }) =>
      apiRequest<any>("/user/settings", { method: "PUT", body: JSON.stringify(data) }),
  },

  export: {
    all: () => apiRequest<any>("/export/all"),
  },
};
