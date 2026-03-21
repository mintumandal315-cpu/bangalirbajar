'use client'
import { useState } from 'react'
import { supabase } from '../../utils/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async () => {
    setLoading(true)
    setMessage('')

    if (isSignup) {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage(error.message)
      } else {
        setMessage('Account created! You can now log in.')
        setIsSignup(false)
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage(error.message)
      } else {
        window.location.href = '/'
      }
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: '10px',
    border: '1.5px solid #E7D5C0',
    fontSize: '15px',
    backgroundColor: '#FDF8F0',
    color: '#1C1917',
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: 'border-box'
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FDF8F0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '36px',
            color: '#7A1515',
            marginBottom: '8px'
          }}>বাঙালির বাজার</h1>
          <p style={{ color: '#78716C', fontSize: '15px' }}>
            {isSignup ? 'Create your customer account' : 'Welcome back'}
          </p>
        </div>

        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid #F0E6D3',
          boxShadow: '0 4px 24px rgba(122,21,21,0.08)'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#57534E', marginBottom: '8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="your@email.com"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#57534E', marginBottom: '8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="Your password"
            />
          </div>

          {message && (
            <p style={{ fontSize: '13px', color: '#DC2626', marginBottom: '16px', textAlign: 'center' }}>{message}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#7A1515',
              color: '#FDF8F0',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              opacity: loading ? 0.7 : 1,
              marginBottom: '20px'
            }}
          >
            {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Login'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#78716C' }}>
            {isSignup ? 'Already have an account? ' : 'New here? '}
            <button
              onClick={() => { setIsSignup(!isSignup); setMessage('') }}
              style={{ color: '#7A1515', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}
            >
              {isSignup ? 'Login' : 'Sign up'}
            </button>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#A8A29E' }}>
          Are you a business owner?{' '}
          <a href="/provider-login" style={{ color: '#7A1515', fontWeight: 600, textDecoration: 'none' }}>Provider Login →</a>
        </p>
      </div>
    </div>
  )
}