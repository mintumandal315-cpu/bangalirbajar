'use client'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../utils/supabase'

export default function ChatPage() {
  const [user, setUser] = useState(null)
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
      setProviders(data || [])
    }
    fetchProviders()
  }, [])

  const fetchMessages = async (provider) => {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('provider_id', provider.id)
      .order('created_at', { ascending: true })
    if (error) console.log('fetch error', error)
    setMessages(data || [])
  }

  useEffect(() => {
    if (!selectedProvider) return
    fetchMessages(selectedProvider)
  }, [selectedProvider])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !user || !selectedProvider) return

    const { error } = await supabase.from('messages').insert([{
      provider_id: selectedProvider.id,
      customer_id: user.id,
      sender_role: 'customer',
      content: newMessage.trim()
    }])

    if (error) {
      console.log('insert error', error)
      return
    }

    setNewMessage('')
    fetchMessages(selectedProvider)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  if (loading) return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center">
      <p className="text-gray-700">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-red-50 flex">
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-bold text-red-700">Bangalir Bajar</h2>
          <p className="text-xs text-gray-600">Select a provider to chat</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {providers.map(p => (
            <div
              key={p.id}
              onClick={() => setSelectedProvider(p)}
              className={`p-4 cursor-pointer border-b border-gray-100 hover:bg-red-50 transition ${
                selectedProvider?.id === p.id ? 'bg-red-50 border-l-4 border-l-red-600' : ''
              }`}
            >
              <p className="font-medium text-gray-900 text-sm">{p.business_name}</p>
              <p className="text-xs text-gray-600">{p.categories?.icon} {p.categories?.name}</p>
              <p className="text-xs text-gray-600">📍 {p.area}</p>
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => supabase.auth.signOut().then(() => window.location.href = '/login')}
            className="text-xs text-red-500 hover:underline"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {!selectedProvider ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-600">Select a provider to start chatting</p>
          </div>
        ) : (
          <>
            <div className="bg-white border-b border-gray-200 p-4">
              <p className="font-bold text-gray-900">{selectedProvider.business_name}</p>
              <p className="text-sm text-gray-600">{selectedProvider.area}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <p className="text-center text-gray-600 text-sm mt-10">No messages yet. Say hello!</p>
              )}
              {messages.map(m => (
                <div
                  key={m.id}
                  className={`flex ${m.sender_role === 'customer' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs px-4 py-2 rounded-2xl text-sm font-medium ${
                    m.sender_role === 'customer'
                      ? 'bg-red-600 text-white rounded-br-none'
                      : 'bg-white text-gray-900 shadow rounded-bl-none'
                  }`}>
                    {m.content}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="bg-white border-t border-gray-200 p-4 flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-red-400"
              />
              <button
                onClick={sendMessage}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl text-sm font-medium"
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