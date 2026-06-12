export const PI_NETWORK_CONFIG = {
  SDK_URL: "https://sdk.minepi.com/pi-sdk.js",
  SANDBOX: true,
} as const;

export const BACKEND_CONFIG = {
  BASE_URL: "/api",
  BLOCKCHAIN_BASE_URL: "https://api.mainnet.minepi.com",
} as const;

export const BACKEND_URLS = {
  LOGIN: `/api/auth/login`,
  LOGIN_PREVIEW: `/api/auth/login`,
  GET_PRODUCTS: (_appId: string) => `/api/products`,
  GET_PAYMENT: (paymentId: string) => `/api/payments/${paymentId}`,
  APPROVE_PAYMENT: (paymentId: string) => `/api/payments/${paymentId}/approve`,
  COMPLETE_PAYMENT: (paymentId: string) => `/api/payments/${paymentId}/complete`,
} as const;

export const PI_PLATFORM_URLS = {} as const;

export const PI_BLOCKCHAIN_URLS = {
  GET_TRANSACTION: (txid: string) =>
    `${BACKEND_CONFIG.BLOCKCHAIN_BASE_URL}/transactions/${txid}/effects`,
} as const;
