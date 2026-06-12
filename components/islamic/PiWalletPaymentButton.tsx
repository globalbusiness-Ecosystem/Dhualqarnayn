'use client';

import React, { useState } from 'react';
import { usePiAuth } from '@/contexts/pi-auth-context';

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
  const { isAuthenticated, userData } = usePiAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amount = priceOverride ?? 1;
  const displayName = productName ?? productId;

  const handlePayment = async () => {
    if (!isAuthenticated || !userData) {
      setError('Please authenticate first');
      if (onError) onError({ code: 'auth_required', message: 'Please authenticate first' });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const Pi = (window as any).Pi;
      if (!Pi) throw new Error('Pi SDK not initialized');

      Pi.createPayment(
        {
          amount,
          memo: `${displayName} - Dhualqarnayn`,
          metadata: { productId, userId: userData.id },
        },
        {
          onReadyForServerApproval: async (paymentId: string) => {
            try {
              await fetch(`/api/payments/${paymentId}/approve`, { method: 'POST' });
            } catch (e) {
              console.error('Approve error:', e);
            }
          },
          onReadyForServerCompletion: async (paymentId: string, txid: string) => {
            try {
              await fetch(`/api/payments/${paymentId}/complete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ txid }),
              });
              if (onSuccess) onSuccess({ productId, paymentId, txid });
            } catch (e) {
              console.error('Complete error:', e);
            } finally {
              setLoading(false);
            }
          },
          onCancel: (_paymentId: string) => {
            setLoading(false);
            setError('Payment cancelled');
          },
          onError: (err: Error) => {
            setLoading(false);
            setError(err.message);
            if (onError) onError({ code: 'payment_error', message: err.message });
          },
        }
      );
    } catch (err: any) {
      setLoading(false);
      setError(err.message);
      if (onError) onError({ code: 'payment_error', message: err.message });
    }
  };

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
    backgroundColor: loading ? '#5A4A38' : '#C9A84C',
    color: loading ? '#8A7A68' : '#0D1B2A',
    fontFamily: "'Tajawal', sans-serif",
    fontWeight: 600,
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.6 : 1,
    whiteSpace: 'nowrap',
    width: fullWidth ? '100%' : 'auto',
  };

  return (
    <div>
      <button onClick={handlePayment} disabled={loading || !isAuthenticated} style={buttonStyle}>
        {loading ? 'Processing...' : `Pay ${amount} π`}
      </button>
      {error && (
        <p style={{ fontFamily: "'Tajawal', sans-serif", fontSize: 10, color: '#D67C78', marginTop: 4, textAlign: 'center' }}>
          {error}
        </p>
      )}
    </div>
  );
}
