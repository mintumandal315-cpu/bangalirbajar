'use client'
import { useState } from 'react'
import { supabase } from '../../utils/supabase'

export default function ProviderLoginPage() {
  const [step, setStep] = useState('auth')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
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
        setStep('verify')
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

  const handleForgotPassword = async () => {
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/provider-login'
    })

    if (error) {
      setMessage(error.message)
    } else {
      setStep('reset_sent')
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%',
    padding: '13px 16px',
    borderRadius: '10px',
    border: '1.5px solid #1E4E6E',
    fontSize: '15px',
    backgroundColor: '#0C3D5C',
    color: '#FDF8F0',
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
    boxSizing: 'border-box'
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#072940', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '420px' }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-block', backgroundColor: '#D4A017', color: '#1C1917', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '50px', marginBottom: '20px' }}>
            Business Portal
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '36px', color: '#FDF8F0', marginBottom: '6px' }}>এই শহরে</h1>
          <p style={{ color: '#D4A017', fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>Bengali Market</p>
          <p style={{ color: '#A8A29E', fontSize: '15px' }}>
            {step === 'verify' ? 'Check your email for a code' :
             step === 'forgot' ? 'Reset your password' :
             step === 'reset_sent' ? 'Check your email' :
             isSignup ? 'Create your business account' : 'Login to manage your listing'}
          </p>
        </div>

        <div style={{ backgroundColor: '#0C3D5C', borderRadius: '20px', padding: '40px', border: '1px solid #1E4E6E' }}>

          {/* OTP Verification */}
          {step === 'verify' && (
            <div>
              <p style={{ fontSize: '14px', color: '#A8A29E', marginBottom: '24px', textAlign: 'center', lineHeight: 1.6 }}>
                We sent an 8-digit code to <strong style={{ color: '#FDF8F0' }}>{email}</strong>. Enter it below to verify your account.
              </p>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A8A29E', marginBottom: '8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Verification Code</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 8))}
                  style={{ ...inputStyle, textAlign: 'center', fontSize: '22px', letterSpacing: '0.3em', fontWeight: 700 }}
                  placeholder="00000000"
                  maxLength={8}
                />
              </div>

              {message && <p style={{ fontSize: '13px', color: '#FCA5A5', marginBottom: '16px', textAlign: 'center' }}>{message}</p>}

              <button
                onClick={async () => {
                  setLoading(true)
                  setMessage('')
                  const { error } = await supabase.auth.verifyOtp({ email, token: otp, type: 'signup' })
                  if (error) {
                    setMessage('Invalid or expired code. Please try again.')
                  } else {
                    await supabase.auth.signInWithPassword({ email, password })
                    window.location.href = '/onboard'
                  }
                  setLoading(false)
                }}
                disabled={loading || otp.length < 8}
                style={{ width: '100%', padding: '14px', backgroundColor: '#D4A017', color: '#1C1917', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", opacity: (loading || otp.length < 8) ? 0.7 : 1, marginBottom: '16px' }}
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>

              <button
                onClick={() => { setStep('auth'); setOtp(''); setMessage('') }}
                style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', color: '#A8A29E', border: 'none', fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
              >
                ← Back to login
              </button>
            </div>
          )}

          {/* Forgot password */}
          {step === 'forgot' && (
            <div>
              <p style={{ fontSize: '14px', color: '#A8A29E', marginBottom: '24px', textAlign: 'center', lineHeight: 1.6 }}>
                Enter your email and we'll send you a password reset link.
              </p>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A8A29E', marginBottom: '8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="your@email.com" />
              </div>

              {message && <p style={{ fontSize: '13px', color: '#FCA5A5', marginBottom: '16px', textAlign: 'center' }}>{message}</p>}

              <button
                onClick={handleForgotPassword}
                disabled={loading}
                style={{ width: '100%', padding: '14px', backgroundColor: '#D4A017', color: '#1C1917', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", opacity: loading ? 0.7 : 1, marginBottom: '16px' }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <button
                onClick={() => { setStep('auth'); setMessage('') }}
                style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', color: '#A8A29E', border: 'none', fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
              >
                ← Back to login
              </button>
            </div>
          )}

          {/* Reset sent */}
          {step === 'reset_sent' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📧</div>
              <p style={{ fontSize: '16px', color: '#FDF8F0', fontWeight: 600, marginBottom: '8px' }}>Check your email</p>
              <p style={{ fontSize: '14px', color: '#A8A29E', lineHeight: 1.6, marginBottom: '24px' }}>
                We sent a password reset link to <strong style={{ color: '#FDF8F0' }}>{email}</strong>
              </p>
              <button
                onClick={() => { setStep('auth'); setMessage('') }}
                style={{ width: '100%', padding: '14px', backgroundColor: '#D4A017', color: '#1C1917', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
              >
                Back to Login
              </button>
            </div>
          )}

          {/* Main auth */}
          {step === 'auth' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A8A29E', marginBottom: '8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} placeholder="your@email.com" />
              </div>

              <div style={{ marginBottom: '8px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#A8A29E', marginBottom: '8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={inputStyle} placeholder="Your password" />
              </div>

              {!isSignup && (
                <div style={{ textAlign: 'right', marginBottom: '20px' }}>
                  <button
                    onClick={() => { setStep('forgot'); setMessage('') }}
                    style={{ background: 'none', border: 'none', color: '#D4A017', fontSize: '13px', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {isSignup && <div style={{ marginBottom: '20px' }} />}

              {message && <p style={{ fontSize: '13px', color: '#FCA5A5', marginBottom: '16px', textAlign: 'center' }}>{message}</p>}

              <button
                onClick={handleSubmit}
                disabled={loading}
                style={{ width: '100%', padding: '14px', backgroundColor: '#D4A017', color: '#1C1917', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", opacity: loading ? 0.7 : 1, marginBottom: '20px' }}
              >
                {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Login to Dashboard'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '14px', color: '#78716C' }}>
                {isSignup ? 'Already have an account? ' : 'New business? '}
                <button onClick={() => { setIsSignup(!isSignup); setMessage('') }} style={{ color: '#D4A017', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", fontSize: '14px' }}>
                  {isSignup ? 'Login' : 'Sign up'}
                </button>
              </p>
            </div>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#57534E' }}>
          Looking to browse?{' '}
          <a href="/login" style={{ color: '#D4A017', fontWeight: 600, textDecoration: 'none' }}>Customer Login →</a>
        </p>

        <div style={{ marginTop: '20px', padding: '18px 20px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center' }}>
          <p style={{ fontSize: '13px', color: '#78716C', marginBottom: '10px' }}>Facing any issue? We are here to help.</p>
          <a
            href="https://wa.me/91XXXXXXXXXX"
            target="_blank"
            rel="noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#16A34A', color: '#FDF8F0', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 600, textDecoration: 'none', fontFamily: "'DM Sans', sans-serif" }}
          >
            💬 WhatsApp Support
          </a>
        </div>
      </div>
    </div>
  )
}