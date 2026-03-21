'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

export default function HomePage() {
  const [providers, setProviders] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*')
      setCategories(data || [])
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProviders = async () => {
      let query = supabase
        .from('providers')
        .select('*, categories(name, icon)')
        .eq('is_approved', true)
        .eq('is_active', true)

      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory)
      }
      if (search) {
        query = query.ilike('business_name', '%' + search + '%')
      }

      const { data } = await query
      setProviders(data || [])
    }
    fetchProviders()
  }, [selectedCategory, search])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF8F0' }}>

      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #7A1515 0%, #9B1C1C 50%, #7A1515 100%)',
        padding: '80px 24px 60px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212,160,23,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(212,160,23,0.08) 0%, transparent 40%)',
          pointerEvents: 'none'
        }} />
        <p style={{
          color: '#D4A017',
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: '16px'
        }}>Hyderabad Bengali Community</p>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: '56px',
          fontWeight: 700,
          color: '#FDF8F0',
          lineHeight: 1.1,
          marginBottom: '16px'
        }}>বাঙালির বাজার</h1>
        <p style={{
          color: '#F5D9A0',
          fontSize: '18px',
          fontWeight: 300,
          marginBottom: '40px',
          letterSpacing: '0.02em'
        }}>Fish · Groceries · Priests · Tutors · Caterers · and more</p>

        <div style={{ maxWidth: '520px', margin: '0 auto', position: 'relative' }}>
          <input
            type="text"
            placeholder="Search for fish shops, priests, tutors..."
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '16px 52px 16px 24px',
              borderRadius: '50px',
              border: 'none',
              fontSize: '15px',
              backgroundColor: '#FDF8F0',
              color: '#1C1917',
              outline: 'none',
              boxSizing: 'border-box',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
              fontFamily: "'DM Sans', sans-serif"
            }}
          />
          <span style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }}>🔍</span>
        </div>

        <div style={{ marginTop: '24px' }}>
          <span style={{ color: '#F5D9A0', fontSize: '13px', opacity: 0.8 }}>
            {providers.length > 0 ? providers.length + ' businesses listed' : 'Be the first to list your business'}
          </span>
        </div>
      </div>

      <div style={{ backgroundColor: '#D4A017', height: '4px' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px' }}>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '40px', justifyContent: 'center' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{
              padding: '10px 22px',
              borderRadius: '50px',
              border: selectedCategory === 'all' ? 'none' : '1.5px solid #E7D5C0',
              backgroundColor: selectedCategory === 'all' ? '#7A1515' : '#FDF8F0',
              color: selectedCategory === 'all' ? '#FDF8F0' : '#78716C',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: '10px 22px',
                borderRadius: '50px',
                border: selectedCategory === cat.id ? 'none' : '1.5px solid #E7D5C0',
                backgroundColor: selectedCategory === cat.id ? '#7A1515' : '#FDF8F0',
                color: selectedCategory === cat.id ? '#FDF8F0' : '#78716C',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        {providers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
            <p style={{ fontSize: '18px', fontFamily: "'Playfair Display', serif", color: '#78716C' }}>No listings found</p>
            <p style={{ fontSize: '14px', marginTop: '8px', color: '#A8A29E' }}>Try a different category or search term</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {providers.map(p => (
              <a
                key={p.id}
                href={'/provider/' + p.id}
                style={{
                  backgroundColor: '#FFF5F5',
                  borderRadius: '16px',
                  padding: '28px',
                  textDecoration: 'none',
                  display: 'block',
                  border: '1px solid #FECACA',
                  boxShadow: '0 2px 12px rgba(122,21,21,0.08)',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(122,21,21,0.15)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(122,21,21,0.08)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div style={{
                    backgroundColor: '#FEE2E2',
                    borderRadius: '12px',
                    width: '52px',
                    height: '52px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '26px'
                  }}>
                    {p.categories?.icon}
                  </div>
                  <span style={{
                    backgroundColor: '#FEE2E2',
                    color: '#991B1B',
                    fontSize: '11px',
                    fontWeight: 600,
                    padding: '4px 10px',
                    borderRadius: '50px',
                    letterSpacing: '0.05em'
                  }}>
                    {p.categories?.name}
                  </span>
                </div>

                <h2 style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '20px',
                  fontWeight: 600,
                  color: '#1C1917',
                  marginBottom: '4px',
                  lineHeight: 1.3
                }}>{p.business_name}</h2>

                <p style={{ fontSize: '13px', color: '#57534E', marginBottom: '4px' }}>{p.name}</p>
                <p style={{ fontSize: '13px', color: '#57534E', marginBottom: '12px' }}>📍 {p.area}</p>

                {p.description && (
                  <p style={{
                    fontSize: '13px',
                    color: '#44403C',
                    lineHeight: 1.5,
                    marginBottom: '20px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>{p.description}</p>
                )}

                <div style={{
                  borderTop: '1px solid #FECACA',
                  paddingTop: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '13px', color: '#7A1515', fontWeight: 600 }}>View Profile →</span>
                  <span style={{ fontSize: '12px', color: '#78716C' }}>📞 {p.phone}</span>
                </div>
              </a>
            ))}
          </div>
        )}

        <div style={{
          marginTop: '80px',
          backgroundColor: '#1C1917',
          borderRadius: '24px',
          padding: '60px 40px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(212,160,23,0.12) 0%, transparent 60%)',
            pointerEvents: 'none'
          }} />
          <p style={{ color: '#D4A017', fontSize: '12px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '16px' }}>For Business Owners</p>
          <h2 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '36px',
            color: '#FDF8F0',
            marginBottom: '12px'
          }}>List Your Business — Free</h2>
          <p style={{ color: '#A8A29E', fontSize: '16px', marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px' }}>
            Reach thousands of Bengali customers in Hyderabad. First two months completely free.
          </p>
          <a href="/provider-login" style={{
            backgroundColor: '#D4A017',
            color: '#1C1917',
            padding: '14px 36px',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-block',
            letterSpacing: '0.02em'
          }}>Get Listed Today</a>
        </div>
      </div>
    </div>
  )
}