"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type LoginDTO = {
  id: string;
  username: string;
  credits_balance: number;
  terms_accepted: boolean;
  app_id: string;
};

export type Product = { id: string; name: string; description: string; price_in_pi: number; total_quantity: number; is_active: boolean; created_at: string; };
export type ProductList = { products: Product[]; };

interface PiAuthContextType {
  isAuthenticated: boolean;
  authMessage: string;
  hasError: boolean;
  piAccessToken: string | null;
  userData: LoginDTO | null;
  error: string | null;
  reinitialize: () => Promise<void>;
  appId: string | null;
  products: Product[] | null;
}

const PiAuthContext = createContext<PiAuthContextType | undefined>(undefined);

const loadPiSDK = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && (window as any).Pi) { resolve(); return; }
    const script = document.createElement("script");
    script.src = "https://sdk.minepi.com/pi-sdk.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Pi SDK"));
    document.head.appendChild(script);
  });
};

export function PiAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMessage, setAuthMessage] = useState("جارٍ التهيئة...");
  const [hasError, setHasError] = useState(false);
  const [piAccessToken, setPiAccessToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<LoginDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [appId, setAppId] = useState<string | null>(null);
  const [products] = useState<Product[] | null>([]);

  const initializePiAndAuthenticate = async () => {
    setError(null);
    setHasError(false);
    try {
      setAuthMessage("جارٍ تحميل Pi SDK...");
      await loadPiSDK();
      const Pi = (window as any).Pi;
      if (!Pi) throw new Error("Pi SDK غير متاح");

      setAuthMessage("جارٍ المصادقة...");
      await Pi.init({ version: "2.0", sandbox: false });

      const auth = await Pi.authenticate(
        ["username", "payments"],
        async (payment: any) => {
          // تجاهل الـ incomplete payments تماماً
          console.log("Skipping incomplete payment:", payment?.identifier);
        }
      );

      if (!auth?.accessToken) throw new Error("فشل الحصول على Access Token");

      setPiAccessToken(auth.accessToken);
      setUserData({
        id: auth.user?.uid || "user",
        username: auth.user?.username || "pi_user",
        credits_balance: 0,
        terms_accepted: true,
        app_id: process.env.NEXT_PUBLIC_PI_APP_ID || "dhualqarnayn",
      });
      setAppId(process.env.NEXT_PUBLIC_PI_APP_ID || "dhualqarnayn");
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error("Pi auth error:", err);
      setHasError(true);
      const msg = `Authentication error: ${err?.message || "Request failed"}`;
      setAuthMessage(msg);
      setError(msg);
    }
  };

  useEffect(() => { initializePiAndAuthenticate(); }, []);

  return (
    <PiAuthContext.Provider value={{
      isAuthenticated, authMessage, hasError,
      piAccessToken, userData, error,
      reinitialize: initializePiAndAuthenticate,
      appId, products,
    }}>
      {children}
    </PiAuthContext.Provider>
  );
}

export function usePiAuth() {
  const context = useContext(PiAuthContext);
  if (!context) throw new Error("usePiAuth must be used within PiAuthProvider");
  return context;
}
