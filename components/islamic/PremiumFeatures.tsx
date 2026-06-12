'use client';

import React, { useState } from 'react';
import { usePiAuth } from '@/contexts/pi-auth-context';
import { pay } from '@/lib/pi-payment';
import PiWalletPaymentButton from './PiWalletPaymentButton';
import { PRODUCT_CONFIG } from '@/lib/product-config';

interface Premium {
  id: string;
  name: string;
  icon: string;
  price: number;
  description: string;
}

const PREMIUM_FEATURES: Premium[] = [
  {
    id: 'ad_free',
    name: 'Ad-Free Experience',
    icon: '✨',
    price: 0.5,
    description: 'Remove all ads and enjoy uninterrupted reading'
  },
  {
    id: 'unlimited_bookmarks',
    name: 'Unlimited Bookmarks',
    icon: '📌',
    price: 0.75,
    description: 'Save unlimited Quranic passages and notes'
  },
  {
    id: 'offline_quran',
    name: 'Offline Quran',
    icon: '📵',
    price: 1.0,
    description: 'Download full Quran for offline reading'
  },
  {
    id: 'tafsir_premium',
    name: 'Premium Tafsir',
    icon: '📚',
    price: 1.5,
    description: 'Access to advanced Islamic scholarship and tafsir'
  },
];

export default function PremiumFeatures() {
  const { userData, isAuthenticated } = usePiAuth();
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePurchase = async (feature: Premium) => {
    if (!isAuthenticated || !userData) {
      setPaymentStatus('Please authenticate first');
      return;
    }

    setLoading(true);
    setSelectedFeature(feature.id);

    try {
      await pay({
        amount: feature.price,
        memo: `Purchase: ${feature.name}`,
        metadata: {
          feature_id: feature.id,
          feature_name: feature.name,
          user_id: userData.id,
          transaction_type: 'premium_feature',
          timestamp: new Date().toISOString(),
        },
        onComplete: (metadata) => {
          setPaymentStatus(`✓ ${feature.name} unlocked!`);
          setSelectedFeature(null);
          setTimeout(() => setPaymentStatus(null), 3000);
        },
        onError: (error) => {
          setPaymentStatus(`Payment failed: ${error.message}`);
          setSelectedFeature(null);
        },
      });
    } catch (error) {
      setPaymentStatus('Payment error occurred');
      setSelectedFeature(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '16px', paddingTop: 0 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontFamily: "'Amiri', serif",
          fontSize: 20,
          color: '#C9A84C',
          marginBottom: 8,
          textAlign: 'center'
        }}>
          Premium Features
        </h2>
        <p style={{
          fontFamily: "'Tajawal', sans-serif",
          fontSize: 12,
          color: '#8A7A68',
          textAlign: 'center'
        }}>
          Enhance your Quranic experience with premium features
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {PREMIUM_FEATURES.map((feature) => (
          <div
            key={feature.id}
            style={{
              padding: 14,
              border: '1px solid rgba(201,168,76,0.15)',
              borderRadius: 8,
              backgroundColor: 'rgba(27,107,58,0.04)',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = 'rgba(201,168,76,0.3)';
              el.style.backgroundColor = 'rgba(27,107,58,0.08)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLDivElement;
              el.style.borderColor = 'rgba(201,168,76,0.15)';
              el.style.backgroundColor = 'rgba(27,107,58,0.04)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
              <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 18 }}>{feature.icon}</span>
              <h3 style={{
                fontFamily: "'Tajawal', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: '#F5ECD7',
                margin: 0
              }}>
                {feature.name}
              </h3>
            </div>
            <p style={{
              fontFamily: "'Tajawal', sans-serif",
              fontSize: 11,
              color: '#8A7A68',
              margin: '4px 0 0 26px',
            }}>
              {feature.description}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              onClick={() => handlePurchase(feature)}
              disabled={loading && selectedFeature === feature.id}
              style={{
                padding: '8px 14px',
                borderRadius: 6,
                border: 'none',
                backgroundColor: selectedFeature === feature.id && loading ? '#5A4A38' : '#C9A84C',
                color: selectedFeature === feature.id && loading ? '#8A7A68' : '#0D1B2A',
                fontFamily: "'Tajawal', sans-serif",
                fontSize: 12,
                fontWeight: 600,
                cursor: selectedFeature === feature.id && loading ? 'wait' : 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {selectedFeature === feature.id && loading ? 'Processing...' : `${feature.price} π`}
            </button>
            <PiWalletPaymentButton
              productId={PRODUCT_CONFIG.PRODUCT_6a2bd369e8892886f18efa6f}
              productName={feature.name}
              priceOverride={feature.price}
              size="sm"
              onSuccess={() => {
                setPaymentStatus(`✓ ${feature.name} unlocked!`);
                setTimeout(() => setPaymentStatus(null), 3000);
              }}
              onError={(err) => {
                setPaymentStatus(`Payment failed: ${err.message}`);
              }}
            />
          </div>
            </div>
          </div>
        ))}
      </div>

      {paymentStatus && (
        <div style={{
          marginTop: 16,
          padding: 12,
          borderRadius: 6,
          backgroundColor: paymentStatus.includes('✓') ? 'rgba(27,107,58,0.1)' : 'rgba(201,80,76,0.1)',
          border: `1px solid ${paymentStatus.includes('✓') ? 'rgba(27,107,58,0.3)' : 'rgba(201,80,76,0.3)'}`,
          fontFamily: "'Tajawal', sans-serif",
          fontSize: 12,
          color: paymentStatus.includes('✓') ? '#7ACB7F' : '#D67C78',
          textAlign: 'center'
        }}>
          {paymentStatus}
        </div>
      )}

      {isAuthenticated && userData && (
        <div style={{
          marginTop: 20,
          padding: 12,
          borderRadius: 6,
          backgroundColor: 'rgba(201,168,76,0.06)',
          border: '1px solid rgba(201,168,76,0.1)'
        }}>
          <p style={{
            fontFamily: "'Tajawal', sans-serif",
            fontSize: 11,
            color: '#8A7A68',
            margin: 0
          }}>
            Balance: <span style={{ color: '#C9A84C', fontWeight: 600 }}>{userData.credits_balance || 0} π</span>
          </p>
        </div>
      )}
    </div>
  );
}
