import type { paths } from "./schema.ts";
import createClient, { type Middleware } from 'openapi-fetch';
import { useAuthStore } from '../stores/auth.ts';

const BASE_URL = "http://localhost:3000";

type TokensResponse = {
  accessToken?: string;
  refreshToken?: string;
};

let refreshPromise: Promise<string | null> | null = null;

const requestTokenRefresh = async (): Promise<string | null> => {
  const { refreshToken, updateTokens, clearTokens } = useAuthStore.getState();

  if (!refreshToken) {
    clearTokens();
    return null;
  }

  const response = await fetch(`${BASE_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    clearTokens();
    return null;
  }

  const data = (await response.json()) as TokensResponse;
  if (!data.accessToken || !data.refreshToken) {
    clearTokens();
    return null;
  }

  updateTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
};

const shouldTryRefresh = (url: string) => {
  const pathname = new URL(url, BASE_URL).pathname;
  return pathname !== '/api/auth/refresh';
};

const authFetch: typeof fetch = async (input, init) => {
  const request = new Request(input, init);
  const retryRequest = request.clone();

  const response = await fetch(request);
  if (response.status !== 401 || !shouldTryRefresh(request.url)) {
    return response;
  }

  const { refreshToken, clearTokens } = useAuthStore.getState();
  if (!refreshToken) {
    clearTokens();
    return response;
  }

  if (!refreshPromise) {
    refreshPromise = requestTokenRefresh().finally(() => {
      refreshPromise = null;
    });
  }

  const nextAccessToken = await refreshPromise;
  if (!nextAccessToken) {
    return response;
  }

  retryRequest.headers.set('Authorization', `Bearer ${nextAccessToken}`);
  return fetch(retryRequest);
};

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    const { accessToken, isAuthenticated } = useAuthStore.getState();

    if (isAuthenticated()) {
      request.headers.set('Authorization', `Bearer ${accessToken}`);
    }

    return request;
  },

  async onResponse({ response }) {
    return response;
  },
};

const client = createClient<paths>({
  baseUrl: BASE_URL,
  fetch: authFetch,
});

client.use(authMiddleware);

export default client;