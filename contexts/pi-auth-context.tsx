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
  isGuest: boolean;
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

const APP_ID = process.env.NEXT_PUBLIC_PI_APP_ID || "dhualqarnayn";

const isPiBrowser = (): boolean =>
  typeof navigator !== "undefined" && /PiBrowser/i.test(navigator.userAgent);

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
  const [isGuest, setIsGuest] = useState(false);
  const [authMessage, setAuthMessage] = useState("جارٍ التهيئة...");
  const [hasError, setHasError] = useState(false);
  const [piAccessToken, setPiAccessToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<LoginDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [appId, setAppId] = useState<string | null>(null);
  const [products] = useState<Product[] | null>([]);

  const enterAsGuest = () => {
    setUserData({
      id: "guest",
      username: "زائر",
      credits_balance: 0,
      terms_accepted: true,
      app_id: APP_ID,
    });
    setAppId(APP_ID);
    setPiAccessToken(null);
    setHasError(false);
    setError(null);
    setIsGuest(true);
    setIsAuthenticated(true);
  };

  const initializePiAndAuthenticate = async () => {
    setError(null);
    setHasError(false);

    // متصفح عادي (كروم، سفاري، فايرفوكس...): ادخل كزائر بدون Pi
    if (!isPiBrowser()) {
      enterAsGuest();
      return;
    }

    try {
      setAuthMessage("جارٍ تحميل Pi SDK...");
      await loadPiSDK();
      const Pi = (window as any).Pi;
      if (!Pi) throw new Error("Pi SDK غير متاح");

      setAuthMessage("جارٍ المصادقة...");
      await Pi.init({ version: "2.0", sandbox: true });

      const auth = await Pi.authenticate(
        ["username", "payments"],
        async (payment: any) => {
          console.log("Incomplete payment found:", payment?.identifier);
          if (!payment?.identifier) return;
          try {
            await fetch(`/api/payments/${payment.identifier}/approve`, {
              method: "POST",
            });
            if (payment?.transaction?.txid) {
              await fetch(`/api/payments/${payment.identifier}/complete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ txid: payment.transaction.txid }),
              });
            }
          } catch (e) {
            console.log("Could not handle incomplete payment:", e);
          }
        }
      );

      if (!auth?.accessToken) throw new Error("فشل الحصول على Access Token");

      setPiAccessToken(auth.accessToken);
      setUserData({
        id: auth.user?.uid || "user",
        username: auth.user?.username || "pi_user",
        credits_balance: 0,
        terms_accepted: true,
        app_id: APP_ID,
      });
      setAppId(APP_ID);
      setIsGuest(false);
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error("Pi auth error:", err);
      // حتى لو فشل Pi، الموقع يفتح كزائر بدل ما يفضل واقف
      enterAsGuest();
    }
  };

  useEffect(() => { initializePiAndAuthenticate(); }, []);

  return (
    <PiAuthContext.Provider value={{
      isAuthenticated, isGuest, authMessage, hasError,
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
