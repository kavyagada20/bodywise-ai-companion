// API client for Bodywise AI Companion

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('bw_token');
  }
  return null;
}

export function setToken(token: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('bw_token', token);
  }
}

export function clearToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('bw_token');
    localStorage.removeItem('bw_user');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let errorMsg = 'An error occurred';
    try {
      const errData = await res.json();
      errorMsg = errData.detail || errData.message || JSON.stringify(errData);
    } catch {
      errorMsg = res.statusText;
    }
    throw new Error(errorMsg);
  }

  return res.json();
}

// ----------------- Auth -----------------
export async function apiDemoLogin() {
  const res = await request<any>('/api/auth/demo-login', { method: 'POST' });
  if (res.access_token) {
    setToken(res.access_token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bw_user', JSON.stringify(res.user));
    }
  }
  return res;
}

export async function apiLogin(email: string, password: string) {
  const res = await request<any>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (res.access_token) {
    setToken(res.access_token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bw_user', JSON.stringify(res.user));
    }
  }
  return res;
}

export async function apiRegister(name: string, email: string, password: string) {
  const res = await request<any>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  if (res.access_token) {
    setToken(res.access_token);
    if (typeof window !== 'undefined') {
      localStorage.setItem('bw_user', JSON.stringify(res.user));
    }
  }
  return res;
}

export async function apiGetMe() {
  return request<any>('/api/auth/me');
}

// ----------------- Profile & Onboarding -----------------
export async function apiSubmitOnboarding(data: {
  age_range: string;
  primary_concern: string;
  secondary_concerns?: string;
  current_products?: string;
  routine_frequency?: string;
  reminder_time?: string;
  preferences?: string;
  routine_habits?: string;
}) {
  return request<any>('/api/profile/onboarding', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiGetProfile() {
  return request<any>('/api/profile');
}

export async function apiUpdateProfile(data: any) {
  return request<any>('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

// ----------------- Products -----------------
export async function apiGetProducts(params?: { category?: string; concern?: string; search?: string }) {
  const query = new URLSearchParams();
  if (params?.category && params.category !== 'all') query.set('category', params.category);
  if (params?.concern && params.concern !== 'all') query.set('concern', params.concern);
  if (params?.search) query.set('search', params.search);

  const qs = query.toString();
  return request<any[]>(`/api/products${qs ? `?${qs}` : ''}`);
}

export async function apiGetProduct(id: number) {
  return request<any>(`/api/products/${id}`);
}

export async function apiExplainProduct(id: number) {
  return request<any>(`/api/products/${id}/explain`);
}

// ----------------- Routines & Tasks -----------------
export async function apiGetActiveRoutine() {
  return request<any>('/api/routines/active');
}

export async function apiToggleTask(taskId: number, completed: boolean, notes?: string) {
  return request<any>('/api/tasks/toggle', {
    method: 'POST',
    body: JSON.stringify({
      task_id: taskId,
      completed,
      notes,
    }),
  });
}

// ----------------- Progress -----------------
export async function apiGetProgressStats() {
  return request<any>('/api/progress/stats');
}

export async function apiGetProgressHistory() {
  return request<any[]>('/api/progress/history');
}

export async function apiSubmitCheckIn(feedback: string, condition: string, notes?: string) {
  return request<any>('/api/progress/check-in', {
    method: 'POST',
    body: JSON.stringify({
      feedback,
      skin_hair_condition: condition,
      notes,
    }),
  });
}

export async function apiGetWeeklySummaries() {
  return request<any[]>('/api/progress/summaries');
}

// ----------------- AI Companion -----------------
export async function apiChatWithCompanion(message: string, conversationId?: number) {
  return request<any>('/api/companion/chat', {
    method: 'POST',
    body: JSON.stringify({
      message,
      conversation_id: conversationId,
    }),
  });
}

export async function apiApproveAction(conversationId: number, actionType: string, approved: boolean, actionPayload: any) {
  return request<any>('/api/companion/action/approve', {
    method: 'POST',
    body: JSON.stringify({
      conversation_id: conversationId,
      action_type: actionType,
      approved,
      action_payload: actionPayload,
    }),
  });
}

export async function apiGetCurrentConversation() {
  return request<any>('/api/companion/conversation');
}

export async function apiResetConversation() {
  return request<any>('/api/companion/reset', { method: 'POST' });
}

// ----------------- Support Escalations -----------------
export async function apiGetEscalations() {
  return request<any[]>('/api/escalations');
}

// ----------------- Reminders -----------------
export async function apiGetReminders() {
  return request<any[]>('/api/reminders');
}

export async function apiToggleReminder(id: number) {
  return request<any>(`/api/reminders/${id}/toggle`, { method: 'POST' });
}

// ----------------- Settings -----------------
export async function apiGetSettingsStatus() {
  return request<any>('/api/settings/status');
}

export async function apiUpdateSettings(data: { gemini_api_key?: string; demo_mode?: boolean }) {
  return request<any>('/api/settings', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

