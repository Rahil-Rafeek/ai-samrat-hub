const BASE_URL = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('aisamrat_token');
}

export function setAuthToken(token: string): void {
  localStorage.setItem('aisamrat_token', token);
}

export function removeAuthToken(): void {
  localStorage.removeItem('aisamrat_token');
  localStorage.removeItem('aisamrat_user');
}

export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    removeAuthToken();
    window.dispatchEvent(new Event('auth:unauthorized'));
    throw new Error('Session expired or unauthorized. Please login again.');
  }

  if (!response.ok) {
    const errorText = await response.text();
    let errorMsg = `Error ${response.status}: ${response.statusText}`;
    try {
      const parsed = JSON.parse(errorText);
      if (parsed.message) errorMsg = parsed.message;
    } catch {
      if (errorText) errorMsg = errorText;
    }
    throw new Error(errorMsg);
  }

  if (response.headers.get('Content-Type')?.includes('application/json')) {
    return (await response.json()) as T;
  }

  return (await response.text()) as unknown as T;
}

export async function downloadBlob(endpoint: string, defaultFilename: string): Promise<void> {
  const token = getAuthToken();
  const headers = new Headers();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `Failed to download file (HTTP ${response.status})`);
  }

  const blob = await response.blob();
  const contentDisposition = response.headers.get('Content-Disposition');
  let filename = defaultFilename;
  if (contentDisposition && contentDisposition.includes('filename=')) {
    const match = contentDisposition.match(/filename="?([^";]+)"?/);
    if (match && match[1]) filename = match[1];
  }

  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(downloadUrl);
}

