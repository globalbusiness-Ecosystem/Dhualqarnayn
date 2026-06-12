'use client';

import React, { useState, useEffect } from 'react';
import { usePiAuth } from '@/contexts/pi-auth-context';
import { PRODUCT_CONFIG } from '@/lib/product-config';
import { Product } from '@/contexts/pi-auth-context';

interface PiWalletPaymentButtonProps {
  productId: string;
  productName?: string;
  priceOverride?: number;
  onSuccess?: (result: { productId: string; paymentId: string; txid: string }) => void;
  onError?: (error: { code: string; message: string }) => void;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  style?: React.CSSProperties;
}

export default function PiWalletPaymentButton({
  productId,
  productName,
  priceOverride,
  onSuccess,
  onError,
  size = 'md',
  fullWidth = false,
  style,
}: PiWalletPaymentButtonProps) {
  const { products, userData, isAuthenticated } = usePiAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Find the product from products array
  useEffect(() => {
    if (!products || products.length === 0) return;

    const foundProduct = products.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      setError('Product not found');
    }
  }, [products, productId]);

  const handlePayment = async () => {
    if (!isAuthenticated || !userData) {
      const errorMsg = 'Please authenticate first';
      setError(errorMsg);
      if (onError) {
        onError({ code: 'auth_required', message: errorMsg });
      }
      return;
    }

    if (!product) {
      const errorMsg = 'Product not found';
      setError(errorMsg);
      if (onError) {
        onError({ code: 'product_not_found', message: errorMsg });
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Get SDK instance from window
      if (!window.SDKLite) {
        throw new Error('Pi SDK not initialized');
      }

      const sdk = window.SDKLite.init();
      const result = await sdk.makePurchase(product.id);

      if (result.ok) {
        console.log('[v0] Payment successful:', result);
        if (onSuccess) {
          onSuccess({
            productId: result.productId,
            paymentId: result.paymentId,
            txid: result.txid,
          });
        }
        setError(null);
      } else {
        throw new Error(result.message || 'Payment failed');
      }
    } catch (err: any) {
      const errorCode = err.code || 'purchase_error';
      const errorMessage = err.message || 'Payment processing failed';

      console.error('[v0] Payment error:', { code: errorCode, message: errorMessage });

      setError(errorMessage);
      if (onError) {
        onError({ code: errorCode, message: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  // Determine button styling based on size
  const buttonSizes = {
    sm: { padding: '6px 12px', fontSize: 11 },
    md: { padding: '8px 16px', fontSize: 12 },
    lg: { padding: '10px 18px', fontSize: 13 },
  };

  const buttonStyle: React.CSSProperties = {
    ...buttonSizes[size],
    ...style,
    borderRadius: 6,
    border: 'none',
    backgroundColor: !product || error ? '#5A4A38' : '#C9A84C',
    color: !product || error ? '#8A7A68' : '#0D1B2A',
    fontFamily: "'Tajawal', sans-serif",
    fontWeight: 600,
    cursor: loading || !product || error ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    opacity: loading || !product || error ? 0.6 : 1,
    whiteSpace: 'nowrap',
    width: fullWidth ? '100%' : 'auto',
  };

  const displayPrice = priceOverride ?? product?.price_in_pi ?? 0;
  const displayName = productName ?? product?.name ?? 'Product';

  return (
    <div>
      <button
        onClick={handlePayment}
        disabled={loading || !product || !isAuthenticated || error !== null}
        style={buttonStyle}
        onMouseEnter={(e) => {
          if (!loading && product && isAuthenticated && !error) {
            const target = e.currentTarget as HTMLButtonElement;
            target.style.backgroundColor = '#B8963A';
            target.style.transform = 'scale(1.02)';
          }
        }}
        onMouseLeave={(e) => {
          if (!loading && product && isAuthenticated && !error) {
            const target = e.currentTarget as HTMLButtonElement;
            target.style.backgroundColor = '#C9A84C';
            target.style.transform = 'scale(1)';
          }
        }}
      >
        {loading ? 'Processing...' : `Pay ${displayPrice} π`}
      </button>
      {error && (
        <p
          style={{
            fontFamily: "'Tajawal', sans-serif",
            fontSize: 10,
            color: '#D67C78',
            marginTop: 4,
            textAlign: 'center',
          }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

declare global {
  interface Window {
    SDKLite?: any;
  }
}
