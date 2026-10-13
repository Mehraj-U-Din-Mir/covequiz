import React from 'react';

export interface MoneyVisualizerProps {
  price: number;
  paid: number;
}

export const MoneyVisualizer: React.FC<MoneyVisualizerProps> = ({ price, paid }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.25rem 1.5rem',
        marginBottom: '1.25rem',
      }}
    >
      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.8rem' }}>
        Currency & Change Visualizer
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Paid Note */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
          <div
            style={{
              width: '130px',
              height: '65px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              border: '2px solid #6ee7b7',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '6px 8px',
              color: 'white',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800 }}>
              <span>₹{paid}</span>
              <span>BANK</span>
            </div>
            <div style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 900 }}>
              ₹{paid}
            </div>
            <div style={{ fontSize: '0.65rem', textAlign: 'right', opacity: 0.8 }}>
              LEGAL TENDER
            </div>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 800 }}>
            Money Paid
          </div>
        </div>

        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-muted)' }}>-</div>

        {/* Item Price Tag */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
          <div
            style={{
              width: '110px',
              height: '65px',
              borderRadius: '6px',
              background: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 100%)',
              border: '2px dashed #fda4af',
              boxShadow: '0 4px 12px rgba(244, 63, 94, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', fontWeight: 700 }}>Item Cost</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>
              ₹{price}
            </div>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#f43f5e', fontWeight: 800 }}>
            Price Tag
          </div>
        </div>

        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-muted)' }}>=</div>

        {/* Change Wanted */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
          <div
            style={{
              width: '90px',
              height: '65px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '2px dotted #38bdf8',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
            }}
          >
            <div style={{ fontSize: '1.3rem', fontWeight: 900, fontFamily: 'var(--font-mono)' }}>
              ₹ ?
            </div>
          </div>
          <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 800 }}>
            Your Change
          </div>
        </div>
      </div>
    </div>
  );
};
