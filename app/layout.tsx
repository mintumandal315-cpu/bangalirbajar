import "./globals.css";

export const metadata = {
  title: "Bangalir Bajar — Hyderabad Bengali Community",
  description: "Hyderabad er Bengali community r jonno — fish shops, priests, tutors, caterers and more.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: '#FDF8F0', color: '#1C1917' }}>
        <nav style={{
          backgroundColor: '#7A1515',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          boxShadow: '0 2px 20px rgba(122,21,21,0.3)'
        }}>
          <a href="/" style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '22px',
            fontWeight: 700,
            color: '#FDF8F0',
            textDecoration: 'none',
            letterSpacing: '0.02em'
          }}>
            বাঙালির বাজার
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
            <a href="/" style={{ color: '#F5D9A0', fontSize: '14px', fontWeight: 500, textDecoration: 'none', letterSpacing: '0.03em' }}>Your Bajar</a>
            <a href="/chat" style={{ color: '#F5D9A0', fontSize: '14px', fontWeight: 500, textDecoration: 'none', letterSpacing: '0.03em' }}>Chat</a>
            <a href="/provider-login" style={{
              backgroundColor: '#D4A017',
              color: '#1C1917',
              padding: '8px 18px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              textDecoration: 'none',
              letterSpacing: '0.02em'
            }}>List Your Business</a>
            <a href="/login" style={{
              border: '1.5px solid #F5D9A0',
              color: '#F5D9A0',
              padding: '7px 16px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              textDecoration: 'none'
            }}>Customer Login</a>
            <a href="/about" style={{ color: '#F5D9A0', fontSize: '14px', fontWeight: 500, textDecoration: 'none', letterSpacing: '0.03em' }}>About</a>
          </div>
        </nav>
        {children}
        <footer style={{
          backgroundColor: '#1C1917',
          color: '#A8A29E',
          padding: '40px 24px',
          textAlign: 'center',
          marginTop: '80px'
        }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#FDF8F0', marginBottom: '8px' }}>বাঙালির বাজার</p>
          <p style={{ fontSize: '13px', marginBottom: '16px' }}>Hyderabad er Bengali community r jonno</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', fontSize: '13px' }}>
            <a href="/" style={{ color: '#A8A29E', textDecoration: 'none' }}>Your Bajar</a>
            <a href="/chat" style={{ color: '#A8A29E', textDecoration: 'none' }}>Chat</a>
            <a href="/provider-login" style={{ color: '#A8A29E', textDecoration: 'none' }}>List Business</a>
            <a href="/login" style={{ color: '#A8A29E', textDecoration: 'none' }}>Login</a>
            <a href="/about" style={{ color: '#A8A29E', textDecoration: 'none' }}>About</a>
          </div>
          <p style={{ fontSize: '12px', marginTop: '24px', color: '#57534E' }}>© 2025 Bangalir Bajar. Made with ♥ for the Bengali community in Hyderabad.</p>
        </footer>
      </body>
    </html>
  );
}