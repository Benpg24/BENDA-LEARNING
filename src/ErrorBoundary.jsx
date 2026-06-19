import { Component } from 'react';

// Catches any render/runtime error in the tree below it so a single bad
// component can't white-screen the whole app. Shows a friendly fallback
// with a reload button instead.
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Surface in the console for debugging; safe to wire to a logger later.
    console.error('App crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#000', color: '#fafafa', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: "'Geist',sans-serif", textAlign: 'center' }}>
          <img src="/images/BENDAlogo.png" alt="Benda" style={{ height: 44, objectFit: 'contain', filter: 'brightness(0) invert(1)', marginBottom: 28, opacity: 0.9 }} />
          <div style={{ fontFamily: "'Inter',sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Something went wrong</div>
          <div style={{ fontSize: 14, color: '#a1a1aa', marginBottom: 24, maxWidth: 280, lineHeight: 1.5 }}>The app hit an unexpected error. Reloading usually fixes it.</div>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: '12px 28px', background: 'linear-gradient(180deg,#f4d27a 0%,#D4A24A 45%,#b8841f 100%)', color: '#1a1206', border: 'none', borderRadius: 10, fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: "'Geist',sans-serif" }}
          >
            Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
