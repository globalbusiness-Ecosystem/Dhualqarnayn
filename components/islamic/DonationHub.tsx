'use client';

import React, { useState } from 'react';
import { usePiAuth } from '@/contexts/pi-auth-context';
import { pay } from '@/lib/pi-payment';

interface DonationOption {
  id: string;
  label: string;
  amount: number;
  emoji: string;
}

const DONATION_OPTIONS: DonationOption[] = [
  { id: 'small', label: 'Small', amount: 0.5, emoji: '🌱' },
  { id: 'medium', label: 'Medium', amount: 1.0, emoji: '🌳' },
  { id: 'large', label: 'Large', amount: 2.0, emoji: '🌲' },
  { id: 'custom', label: 'Custom', amount: 0, emoji: '✨' },
];

export default function DonationHub() {
  const { userData, isAuthenticated } = usePiAuth();
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedDonation, setSelectedDonation] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDonate = async (option: DonationOption) => {
    if (!isAuthenticated || !userData) {
      setPaymentStatus('Please authenticate first');
      return;
    }

    let amount = option.amount;

    if (option.id === 'custom') {
      const parsed = parseFloat(customAmount);
      if (!parsed || parsed <= 0) {
        setPaymentStatus('Please enter a valid amount');
        return;
      }
      amount = parsed;
    }

    setLoading(true);
    setSelectedDonation(option.id);

    try {
      await pay({
        amount,
        memo: `Donation: Support Dhualqarnayn`,
        metadata: {
          donation_type: option.id,
          donation_amount: amount,
          user_id: userData.id,
          transaction_type: 'donation',
          timestamp: new Date().toISOString(),
          message: 'Supporting Islamic knowledge on Pi Network',
        },
        onComplete: (metadata) => {
          setPaymentStatus(`✓ Thank you for donating ${amount} π!`);
          setCustomAmount('');
          setSelectedDonation(null);
          setTimeout(() => setPaymentStatus(null), 4000);
        },
        onError: (error) => {
          setPaymentStatus(`Donation failed: ${error.message}`);
          setSelectedDonation(null);
        },
      });
    } catch (error) {
      setPaymentStatus('Donation error occurred');
      setSelectedDonation(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '16px', paddingTop: 0 }}>
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <h2 style={{
          fontFamily: "'Amiri', serif",
          fontSize: 22,
          color: '#C9A84C',
          marginBottom: 8,
        }}>
          Support Dhualqarnayn
        </h2>
        <p style={{
          fontFamily: "'Tajawal', sans-serif",
          fontSize: 12,
          color: '#8A7A68',
        }}>
          Help us preserve and share Islamic knowledge on Pi Network
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        marginBottom: 20,
      }}>
        {DONATION_OPTIONS.slice(0, 3).map((option) => (
          <button
            key={option.id}
            onClick={() => handleDonate(option)}
            disabled={loading && selectedDonation === option.id}
            style={{
              padding: '14px 12px',
              borderRadius: 8,
              border: selectedDonation === option.id ? '2px solid #1B6B3A' : '1px solid rgba(201,168,76,0.2)',
              backgroundColor: selectedDonation === option.id ? 'rgba(27,107,58,0.15)' : 'rgba(27,107,58,0.08)',
              color: '#F5ECD7',
              fontFamily: "'Tajawal', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              cursor: loading && selectedDonation === option.id ? 'wait' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span style={{ fontSize: 24 }}>{option.emoji}</span>
            {selectedDonation === option.id && loading ? (
              <span style={{ fontSize: 11, color: '#8A7A68' }}>Processing...</span>
            ) : (
              <>
                <span>{option.label}</span>
                <span style={{ fontSize: 11, color: '#8A7A68' }}>{option.amount} π</span>
              </>
            )}
          </button>
        ))}

        <button
          onClick={() => {
            if (selectedDonation === 'custom' && customAmount) {
              handleDonate(DONATION_OPTIONS[3]);
            } else {
              setSelectedDonation('custom');
            }
          }}
          style={{
            padding: '14px 12px',
            borderRadius: 8,
            border: selectedDonation === 'custom' ? '2px solid #1B6B3A' : '1px solid rgba(201,168,76,0.2)',
            backgroundColor: selectedDonation === 'custom' ? 'rgba(27,107,58,0.15)' : 'rgba(27,107,58,0.08)',
            color: '#F5ECD7',
            fontFamily: "'Tajawal', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 6,
            gridColumn: '1 / -1'
          }}
        >
          <span style={{ fontSize: 24 }}>✨</span>
          <span>Custom Amount</span>
        </button>
      </div>

      {selectedDonation === 'custom' && (
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 20,
        }}>
          <input
            type="number"
            placeholder="Enter amount in Pi"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 12px',
              borderRadius: 6,
              border: '1px solid rgba(201,168,76,0.2)',
              backgroundColor: 'rgba(13,27,42,0.8)',
              color: '#F5ECD7',
              fontFamily: "'Tajawal', sans-serif",
              fontSize: 12,
            }}
          />
          <button
            onClick={() => {
              if (customAmount && parseFloat(customAmount) > 0) {
                handleDonate(DONATION_OPTIONS[3]);
              }
            }}
            disabled={loading || !customAmount || parseFloat(customAmount) <= 0}
            style={{
              padding: '10px 16px',
              borderRadius: 6,
              border: 'none',
              backgroundColor: customAmount && parseFloat(customAmount) > 0 ? '#1B6B3A' : '#2E3A2E',
              color: customAmount && parseFloat(customAmount) > 0 ? '#F5ECD7' : '#4A5A48',
              fontFamily: "'Tajawal', sans-serif",
              fontSize: 12,
              fontWeight: 600,
              cursor: customAmount && parseFloat(customAmount) > 0 ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
            }}
          >
            Donate
          </button>
        </div>
      )}

      {paymentStatus && (
        <div style={{
          marginBottom: 16,
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

      <div style={{
        padding: 14,
        borderRadius: 8,
        backgroundColor: 'rgba(201,168,76,0.06)',
        border: '1px solid rgba(201,168,76,0.1)',
        marginBottom: 16,
      }}>
        <p style={{
          fontFamily: "'Tajawal', sans-serif",
          fontSize: 11,
          color: '#8A7A68',
          margin: 0,
          lineHeight: 1.6,
        }}>
          Every donation supports Islamic knowledge preservation and helps us bring the Quran to more people on Pi Network.
        </p>
      </div>

      {isAuthenticated && userData && (
        <div style={{
          padding: 12,
          borderRadius: 6,
          backgroundColor: 'rgba(27,107,58,0.08)',
          border: '1px solid rgba(27,107,58,0.2)',
        }}>
          <p style={{
            fontFamily: "'Tajawal', sans-serif",
            fontSize: 11,
            color: '#8A7A68',
            margin: 0,
          }}>
            Your Balance: <span style={{ color: '#7ACB7F', fontWeight: 600 }}>{userData.credits_balance || 0} π</span>
          </p>
        </div>
      )}
    </div>
  );
}
