export default function AboutPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF8F0' }}>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0369A1 0%, #0C4A6E 100%)', padding: '80px 24px', textAlign: 'center' }}>
        <p style={{ color: '#D4A017', fontSize: '12px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>Our Story</p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '48px', color: '#FDF8F0', marginBottom: '8px' }}>এই শহরে</h1>
        <p style={{ color: '#D4A017', fontSize: '14px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Bengali Market</p>
        <p style={{ color: '#BAE6FD', fontSize: '18px', fontWeight: 300, maxWidth: '520px', margin: '0 auto' }}>
          Built by a Bengali, for Bengalis.
        </p>
      </div>

      <div style={{ height: '4px', backgroundColor: '#D4A017' }} />

      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '64px 24px' }}>

        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '48px', marginBottom: '32px', border: '1px solid #F0E6D3', boxShadow: '0 2px 12px rgba(3,105,161,0.06)' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#0369A1', marginBottom: '20px' }}>এই শহরে কী?</h2>
          <p style={{ color: '#57534E', lineHeight: 1.9, fontSize: '16px', marginBottom: '16px' }}>
            Hyderabad has 4-5 lakh Bengalis. Finding a trusted fish shop, a priest, a tutor, or a caterer has always depended on who you know — a WhatsApp forward, an aunty's recommendation, a Facebook post.
          </p>
          <p style={{ color: '#57534E', lineHeight: 1.9, fontSize: '16px' }}>
            এই শহরে changes that. One clean directory for everything Bengali in Hyderabad. Community-verified. Always free to browse.
          </p>
        </div>

        <div style={{ backgroundColor: '#0369A1', borderRadius: '20px', padding: '48px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', color: '#FDF8F0', marginBottom: '12px' }}>Own a Bengali business?</h2>
          <p style={{ color: '#BAE6FD', fontSize: '15px', marginBottom: '28px' }}>
            List it here. Free. No commission. No catch.
          </p>
          <a href="/provider-login" style={{ backgroundColor: '#D4A017', color: '#1C1917', padding: '14px 36px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
            List Your Business
          </a>
        </div>

      </div>
    </div>
  )
}