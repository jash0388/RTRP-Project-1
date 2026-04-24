import { Link } from 'react-router-dom';

export default function BackToHome() {
  return (
    <Link
      to="/"
      title="Back to Home"
      style={{
        position: 'fixed',
        top: '16px',
        left: '16px',
        zIndex: 100,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 14px',
        background: 'rgba(255,255,255,0.95)',
        color: '#1d4ed8',
        borderRadius: '10px',
        fontSize: '13px',
        fontWeight: 700,
        textDecoration: 'none',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 12px rgba(15,23,42,0.08)',
        transition: 'all 180ms ease',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 8px 18px rgba(29,78,216,0.18)';
        e.currentTarget.style.borderColor = '#1d4ed8';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(15,23,42,0.08)';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
    >
      <span style={{ fontSize: '14px', lineHeight: 1 }}>←</span>
      <span>Home</span>
    </Link>
  );
}
