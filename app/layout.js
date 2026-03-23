'use client'
import { useState } from 'react'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ fontFamily: "'DM Sans', sans-serif", backgroundColor: '#FDF8F0', color: '#1C1917', margin: 0 }}>
        <Navbar />
        {children}
        <footer style={{
          position: 'relative',
          padding: '60px 24px',
          textAlign: 'center',
          marginTop: '80px',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: 'url(https://images.pexels.com/photos/574311/pexels-photo-574311.jpeg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }} />
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.65)'
          }} />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#FDF8F0', marginBottom: '8px' }}>এই শহরে</p>
            <p style={{ fontSize: '13px', color: '#D4A017', marginBottom: '24px', letterSpacing: '0.05em' }}>Hyderabad er Bengali community r jonno</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '28px', fontSize: '13px', marginBottom: '32px', flexWrap: 'wrap' }}>
              <a href="/" style={{ color: '#BAE6FD', textDecoration: 'none' }}>Marketplace</a>
              <a href="/provider-login" style={{ color: '#BAE6FD', textDecoration: 'none' }}>List Business</a>
              <a href="/provider-login" style={{ color: '#BAE6FD', textDecoration: 'none' }}>Business Login</a>
             
          
              <a href="/about" style={{ color: '#BAE6FD', textDecoration: 'none' }}>About</a>
            </div>
            <p style={{ fontSize: '12px', color: '#78716C' }}>© 2025 Bangalir Bajar. Made with ♥ for the Bengali community in Hyderabad.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { label: 'Marketplace', href: '/' },
    { label: 'List Business', href: '/provider-login', gold: true },
    { label: 'Business Login', href: '/provider-login' },
    
    
    { label: 'About', href: '/about' },
  ]

  return (
    <>
      <nav style={{
        backgroundColor: '#0369A1',
        padding: '0 24px',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 20px rgba(3,105,161,0.3)'
      }}>
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
  <img 
    src="/logo.png" 
    alt="Ei Sohore" 
    style={{ height: '44px', width: 'auto', objectFit: 'contain' }}
  />
</a>

        {/* Desktop menu */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }} className="desktop-menu">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              style={{
                color: link.gold ? '#1C1917' : '#BAE6FD',
                fontSize: '13px',
                fontWeight: link.gold ? 600 : 500,
                textDecoration: 'none',
                backgroundColor: link.gold ? '#D4A017' : 'transparent',
                padding: link.gold ? '8px 16px' : '0',
                borderRadius: link.gold ? '6px' : '0',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Hamburger button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="hamburger"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            display: 'none',
            flexDirection: 'column',
            gap: '5px',
            padding: '4px'
          }}
        >
          <span style={{ display: 'block', width: '24px', height: '2px', backgroundColor: '#FDF8F0', borderRadius: '2px' }} />
          <span style={{ display: 'block', width: '24px', height: '2px', backgroundColor: '#FDF8F0', borderRadius: '2px' }} />
          <span style={{ display: 'block', width: '24px', height: '2px', backgroundColor: '#FDF8F0', borderRadius: '2px' }} />
        </button>
      </nav>

      {/* Mobile sidebar overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 98
          }}
        />
      )}

      {/* Mobile sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: menuOpen ? 0 : '-280px',
        width: '260px',
        height: '100vh',
        backgroundColor: '#0C4A6E',
        zIndex: 99,
        transition: 'left 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        paddingTop: '80px',
        boxShadow: menuOpen ? '4px 0 20px rgba(0,0,0,0.3)' : 'none'
      }}>
        <div style={{ padding: '0 24px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#FDF8F0', marginBottom: '4px' }}>এই শহরে</p>
          <p style={{ fontSize: '12px', color: '#D4A017' }}>Bengali Marketplace</p>
        </div>
        <div style={{ flex: 1, padding: '24px 0' }}>
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'block',
                padding: '14px 24px',
                color: link.gold ? '#D4A017' : '#BAE6FD',
                fontSize: '15px',
                fontWeight: link.gold ? 600 : 400,
                textDecoration: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
        <button
          onClick={() => setMenuOpen(false)}
          style={{
            margin: '24px',
            padding: '12px',
            backgroundColor: 'transparent',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px',
            color: '#BAE6FD',
            fontSize: '14px',
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif"
          }}
        >
          Close Menu
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-menu { display: none !important; }
          .hamburger { display: flex !important; }
        }
      `}</style>
    </>
  )
}