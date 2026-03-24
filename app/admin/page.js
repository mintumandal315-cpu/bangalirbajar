'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false)
  const [checking, setChecking] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [providers, setProviders] = useState([])
  const [notes, setNotes] = useState({})
  const [filter, setFilter] = useState('pending')

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user && user.email === 'mintumandal315@gmail.com') {
        setAuthorized(true)
      }
      setChecking(false)
    }
    checkAdmin()
  }, [])

  const handleAdminLogin = async () => {
    setLoggingIn(true)
    setLoginError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setLoginError(error.message)
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      if (user && user.email === 'mintumandal315@gmail.com') {
        setAuthorized(true)
      } else {
        setLoginError('You do not have admin access.')
        await supabase.auth.signOut()
      }
    }
    setLoggingIn(false)
  }

  const fetchProviders = async () => {
    let query = supabase
      .from('providers')
      .select('*, categories(name, icon)')
      .order('created_at', { ascending: false })

    if (filter === 'pending') query = query.eq('is_approved', false)
    if (filter === 'approved') query = query.eq('is_approved', true)

    const { data } = await query
    setProviders(data || [])
  }

  useEffect(() => {
    if (authorized) fetchProviders()
  }, [filter, authorized])

  const approve = async (id) => {
    await supabase.from('providers').update({ is_approved: true }).eq('id', id)
    fetchProviders()
  }

  const remove = async (id) => {
    await supabase.from('providers').delete().eq('id', id)
    fetchProviders()
  }

  const toggleVisibility = async (id, currentStatus) => {
    await supabase.from('providers').update({ is_active: !currentStatus }).eq('id', id)
    fetchProviders()
  }

  const sendNote = async (id) => {
    await supabase.from('providers').update({ admin_notes: notes[id] }).eq('id', id)
    alert('Note saved!')
    fetchProviders()
  }

  const inputStyle = {
    width: '100%', padding: '13px 16px', borderRadius: '10px',
    border: '1.5px solid #1E4E6E', backgroundColor: '#072940',
    color: '#FDF8F0', fontSize: '15px', outline: 'none',
    fontFamily: "'DM Sans', sans-serif", boxSizing: 'border-box'
  }

  if (checking) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#072940', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#A8A29E' }}>Checking access...</p>
    </div>
  )

  if (!authorized) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#072940', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ backgroundColor: '#0C3D5C', padding: '48px 40px', borderRadius: '20px', border: '1px solid #1E4E6E', textAlign: 'center', width: '100%', maxWidth: '380px' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#FDF8F0', marginBottom: '8px' }}>Admin Login</h2>
        <p style={{ color: '#A8A29E', fontSize: '14px', marginBottom: '28px' }}>এই শহরে — Admin Only</p>

        <div style={{ marginBottom: '16px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A8A29E', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="your@email.com" />
        </div>

        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A8A29E', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
            style={inputStyle}
            placeholder="Your password"
          />
        </div>

        {loginError && <p style={{ fontSize: '13px', color: '#FCA5A5', marginBottom: '16px' }}>{loginError}</p>}

        <button
          onClick={handleAdminLogin}
          disabled={loggingIn}
          style={{ width: '100%', padding: '13px', backgroundColor: '#D4A017', color: '#1C1917', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", opacity: loggingIn ? 0.7 : 1 }}
        >
          {loggingIn ? 'Logging in...' : 'Enter Dashboard'}
        </button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5F5F5', padding: '32px 24px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', color: '#7A1515' }}>
            Admin Dashboard
          </h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['pending', 'approved', 'all'].map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", backgroundColor: filter === f ? '#7A1515' : '#FFFFFF', color: filter === f ? '#FDF8F0' : '#57534E', textTransform: 'capitalize' }}>
                {f}
              </button>
            ))}
            <a href="/admin/analytics" style={{ padding: '8px 18px', borderRadius: '8px', backgroundColor: '#D4A017', color: '#1C1917', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>Analytics</a>
            <button onClick={() => { supabase.auth.signOut(); setAuthorized(false) }} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", backgroundColor: '#FEE2E2', color: '#991B1B' }}>
              Lock
            </button>
          </div>
        </div>

        {providers.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#A8A29E', padding: '60px 0' }}>No providers found.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {providers.map(p => (
              <div key={p.id} style={{ backgroundColor: '#FFFFFF', borderRadius: '16px', padding: '24px', border: '1px solid #F0E6D3', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', opacity: p.is_active ? 1 : 0.6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '20px' }}>{p.categories?.icon}</span>
                      <span style={{ fontSize: '12px', color: '#78716C' }}>{p.categories?.name}</span>
                      <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 10px', borderRadius: '50px', backgroundColor: p.is_approved ? '#D1FAE5' : '#FEF3C7', color: p.is_approved ? '#065F46' : '#92400E' }}>
                        {p.is_approved ? 'Approved' : 'Pending'}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 10px', borderRadius: '50px', backgroundColor: p.is_active ? '#DBEAFE' : '#FEE2E2', color: p.is_active ? '#1E40AF' : '#991B1B' }}>
                        {p.is_active ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                    <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#1C1917', marginBottom: '2px' }}>{p.business_name}</h2>
                    {p.tagline && <p style={{ fontSize: '13px', color: '#D4A017', marginBottom: '2px' }}>{p.tagline}</p>}
                    <p style={{ fontSize: '13px', color: '#57534E' }}>{p.area}</p>
                    <p style={{ fontSize: '13px', color: '#57534E' }}>📞 {p.phone}{p.whatsapp ? ' · WhatsApp: ' + p.whatsapp : ''}</p>
                    {p.description && <p style={{ fontSize: '13px', color: '#78716C', marginTop: '6px' }}>{p.description}</p>}
                    {p.admin_notes && <p style={{ fontSize: '12px', color: '#7A1515', marginTop: '6px' }}>📋 Note: {p.admin_notes}</p>}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '120px' }}>
                    {!p.is_approved && (
                      <button onClick={() => approve(p.id)} style={{ padding: '8px 16px', backgroundColor: '#059669', color: '#FDF8F0', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Approve</button>
                    )}
                    <button onClick={() => toggleVisibility(p.id, p.is_active)} style={{ padding: '8px 16px', backgroundColor: p.is_active ? '#FEF3C7' : '#D1FAE5', color: p.is_active ? '#92400E' : '#065F46', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
                      {p.is_active ? 'Hide' : 'Show'}
                    </button>
                    <button onClick={() => remove(p.id)} style={{ padding: '8px 16px', backgroundColor: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Delete</button>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="text" placeholder="Add a note for this provider..." defaultValue={p.admin_notes || ''} onChange={(e) => setNotes({ ...notes, [p.id]: e.target.value })} style={{ flex: 1, padding: '10px 14px', borderRadius: '8px', border: '1.5px solid #E7D5C0', fontSize: '13px', color: '#1C1917', fontFamily: "'DM Sans', sans-serif", outline: 'none' }} />
                  <button onClick={() => sendNote(p.id)} style={{ padding: '10px 20px', backgroundColor: '#7A1515', color: '#FDF8F0', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>Save Note</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}