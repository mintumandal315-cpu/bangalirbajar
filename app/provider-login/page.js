'use client'
import { useState } from 'react'
import { supabase } from '../../utils/supabase'

export default function ProviderLoginPage() {
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
        setMessage('Account created! Please login.')
        setIsSignup(false)
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setMessage(error.message)
      } else {
        const { data: { user } } = await supabase.auth.getUser()
        const { data: provider } = await supabase
          .from('providers')
          .select('id')
          .eq('email', user.email)
          .single()

        if (!provider) {
          window.location.href = '/onboard'
        } else {
          window.location.href = '/dashboard'
        }
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
      backgroundColor: '#1C1917',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-block',
            backgroundColor: '#D4A017',
            color: '#1C1917',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            padding: '6px 14px',
            borderRadius: '50px',
            marginBottom: '20px'
          }}>Provider Portal</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '36px',
            color: '#FDF8F0',
            marginBottom: '8px'
          }}>বাঙালির বাজার</h1>
          <p style={{ color: '#A8A29E', fontSize: '15px' }}>
            {isSignup ? 'Create your provider account' : 'Login to manage your listing'}
          </p>
        </div>

        <div style={{
          backgroundColor: '#292524',
          borderRadius: '20px',
          padding: '40px',
          border: '1px solid #3C3836'
        }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A8A29E', marginBottom: '8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ ...inputStyle, backgroundColor: '#1C1917', border: '1.5px solid #3C3836', color: '#FDF8F0' }}
              placeholder="your@email.com"
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A8A29E', marginBottom: '8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...inputStyle, backgroundColor: '#1C1917', border: '1.5px solid #3C3836', color: '#FDF8F0' }}
              placeholder="Your password"
            />
          </div>

          {message && (
            <p style={{ fontSize: '13px', color: '#FCA5A5', marginBottom: '16px', textAlign: 'center' }}>{message}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: '#D4A017',
              color: '#1C1917',
              border: 'none',
              borderRadius: '10px',
              fontSize: '15px',
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              opacity: loading ? 0.7 : 1,
              marginBottom: '20px'
            }}
          >
            {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Login to Dashboard'}
          </button>

          <p style={{ textAlign: 'center', fontSize: '14px', color: '#78716C' }}>
            {isSignup ? 'Already have an account? ' : 'New provider? '}
            <button
              onClick={() => { setIsSignup(!isSignup); setMessage('') }}
              style={{ color: '#D4A017', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}
            >
              {isSignup ? 'Login' : 'Sign up'}
            </button>
          </p>
        </div>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#57534E' }}>
          Looking to browse the directory?{' '}
          <a href="/login" style={{ color: '#D4A017', fontWeight: 600, textDecoration: 'none' }}>Customer Login →</a>
        </p>
      </div>
    </div>
  )
}