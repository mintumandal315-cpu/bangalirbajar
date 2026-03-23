'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../utils/supabase'

export default function ChatPage() {
  const [user, setUser] = useState(null)
  const [customerName, setCustomerName] = useState('')
  const [providers, setProviders] = useState([])
  const [selectedProvider, setSelectedProvider] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef(null)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }
      setUser(user)

      const { data: customerData } = await supabase
        .from('customers')
        .select('name')
        .eq('id', user.id)
        .single()

      setCustomerName(customerData?.name || user.email.split('@')[0])
      setLoading(false)
    }
    getUser()
  }, [])

  useEffect(() => {
    const fetchProviders = async () => {
      const { data } = await supabase
        .from('providers')
        .select('*, categories(name, icon)')
        .eq('is_approved', true)
        .eq('is_active', true)
      setProviders(data || [])
    }
    fetchProviders()
  }, [])

  const fetchMessages = async (provider) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('provider_id', provider.id)
      .eq('customer_id', user.id)
      .order('created_at', { ascending: true })
    setMessages(data || [])
  }

  useEffect(() => {
    if (!selectedProvider || !user) return
    fetchMessages(selectedProvider)
  }, [selectedProvider, user])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !selectedProvider) return

    await supabase.from('messages').insert([{
      provider_id: selectedProvider.id,
      customer_id: user.id,
      customer_email: user.email,
      customer_name: customerName,
      sender_role: 'customer',
      content: newMessage.trim()
    }])

    setNewMessage('')
    fetchMessages(selectedProvider)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#78716C' }}>Loading...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF8F0', display: 'flex', height: 'calc(100vh - 64px)' }}>

      {/* Sidebar */}
      <div style={{ width: '280px', backgroundColor: '#FFFFFF', borderRight: '1px solid #F0E6D3', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid #F0E6D3' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#0369A1', marginBottom: '4px' }}>এই শহরে</h2>
          <p style={{ fontSize: '12px', color: '#A8A29E' }}>Hi {customerName} · Select a provider</p>
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {providers.map(p => (
            <div
              key={p.id}
              onClick={() => setSelectedProvider(p)}
              style={{
                padding: '16px 20px',
                cursor: 'pointer',
                borderBottom: '1px solid #F5EDE0',
                backgroundColor: selectedProvider?.id === p.id ? '#EFF6FF' : 'transparent',
                borderLeft: selectedProvider?.id === p.id ? '3px solid #0369A1' : '3px solid transparent',
                transition: 'all 0.15s'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>{p.categories?.icon}</span>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#1C1917', marginBottom: '2px' }}>{p.business_name}</p>
                  <p style={{ fontSize: '11px', color: '#78716C' }}>📍 {p.area}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: '16px 20px', borderTop: '1px solid #F0E6D3' }}>
          <button
            onClick={() => supabase.auth.signOut().then(() => window.location.href = '/login')}
            style={{ fontSize: '13px', color: '#0369A1', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
          >
            Sign out
          </button>
        </div>
      </div>

      {/* Chat window */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {!selectedProvider ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '12px' }}>
            <span style={{ fontSize: '48px' }}>💬</span>
            <p style={{ color: '#A8A29E', fontSize: '16px', fontFamily: "'Playfair Display', serif" }}>Select a provider to start chatting</p>
          </div>
        ) : (
          <>
            <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #F0E6D3', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '24px' }}>{selectedProvider.categories?.icon}</span>
              <div>
                <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '16px', fontWeight: 600, color: '#1C1917' }}>{selectedProvider.business_name}</p>
                <p style={{ fontSize: '12px', color: '#78716C' }}>📍 {selectedProvider.area}</p>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#FDF8F0' }}>
              {messages.length === 0 && (
                <p style={{ textAlign: 'center', color: '#A8A29E', fontSize: '14px', marginTop: '40px' }}>No messages yet. Say hello!</p>
              )}
              {messages.map(m => (
                <div key={m.id} style={{ display: 'flex', justifyContent: m.sender_role === 'customer' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '65%', padding: '12px 16px', borderRadius: '18px', fontSize: '14px', lineHeight: 1.5,
                    backgroundColor: m.sender_role === 'customer' ? '#0369A1' : '#FFFFFF',
                    color: m.sender_role === 'customer' ? '#FDF8F0' : '#1C1917',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
                    borderBottomRightRadius: m.sender_role === 'customer' ? '4px' : '18px',
                    borderBottomLeftRadius: m.sender_role === 'provider' ? '4px' : '18px',
                  }}>
                    {m.content}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #F0E6D3', padding: '16px 24px', display: 'flex', gap: '12px' }}>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                style={{ flex: 1, padding: '12px 16px', borderRadius: '50px', border: '1.5px solid #E7D5C0', fontSize: '14px', color: '#1C1917', fontFamily: "'DM Sans', sans-serif", outline: 'none', backgroundColor: '#FDF8F0' }}
              />
              <button
                onClick={sendMessage}
                style={{ padding: '12px 24px', backgroundColor: '#0369A1', color: '#FDF8F0', border: 'none', borderRadius: '50px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}