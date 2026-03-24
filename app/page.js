'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

export default function HomePage() {
  const [providers, setProviders] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [ratings, setRatings] = useState({})

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('*').order('slug')
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

      if (data && data.length > 0) {
        const { data: reviewData } = await supabase
          .from('reviews')
          .select('provider_id, rating')

        const ratingMap = {}
        reviewData?.forEach(r => {
          if (!ratingMap[r.provider_id]) ratingMap[r.provider_id] = []
          ratingMap[r.provider_id].push(r.rating)
        })

        const avgMap = {}
        Object.entries(ratingMap).forEach(([pid, ratings]) => {
          avgMap[pid] = {
            avg: (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1),
            count: ratings.length
          }
        })
        setRatings(avgMap)
      }
    }
    fetchProviders()
  }, [selectedCategory, search])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0A0F1E' }}>

      {/* Hero */}
      <div style={{
        position: 'relative', padding: '100px 24px 80px',
        textAlign: 'center', overflow: 'hidden',
        minHeight: '500px', display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'url(https://images.pexels.com/photos/5622816/pexels-photo-5622816.jpeg)',
          backgroundSize: 'cover', backgroundPosition: 'center'
        }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to bottom, rgba(10,15,30,0.7) 0%, rgba(10,15,30,0.85) 100%)'
        }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <p style={{ color: '#D4A017', fontSize: '11px', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '20px' }}>
            Hyderabad · Bengali Community
          </p>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '64px', fontWeight: 700,
            color: '#FFFFFF', lineHeight: 1.05, marginBottom: '16px',
            textShadow: '0 4px 30px rgba(0,0,0,0.5)'
          }}>এই শহরে</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '17px', fontWeight: 300, marginBottom: '44px' }}>
            Fish · Groceries · Priests · Tutors · Caterers · and more
          </p>

          <div style={{ maxWidth: '540px', margin: '0 auto', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search businesses, services..."
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '17px 56px 17px 24px',
                borderRadius: '50px', border: '1px solid rgba(212,160,23,0.3)',
                fontSize: '15px', backgroundColor: 'rgba(255,255,255,0.1)',
                color: '#FFFFFF', outline: 'none', boxSizing: 'border-box',
                backdropFilter: 'blur(10px)', fontFamily: "'DM Sans', sans-serif"
              }}
            />
            <span style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', opacity: 0.7 }}>🔍</span>
          </div>

          <p style={{ color: 'rgba(212,160,23,0.8)', fontSize: '13px', marginTop: '20px' }}>
            {providers.length > 0 ? providers.length + ' businesses listed in Hyderabad' : ''}
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: '#D4A017', height: '3px' }} />

      <div style={{ backgroundColor: '#0A0F1E', minHeight: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px' }}>

          {/* Category pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '40px', justifyContent: 'center' }}>
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                padding: '9px 20px', borderRadius: '50px',
                border: selectedCategory === 'all' ? 'none' : '1px solid rgba(255,255,255,0.15)',
                backgroundColor: selectedCategory === 'all' ? '#D4A017' : 'rgba(255,255,255,0.05)',
                color: selectedCategory === 'all' ? '#0A0F1E' : 'rgba(255,255,255,0.7)',
                fontSize: '13px', fontWeight: selectedCategory === 'all' ? 700 : 400,
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
              }}
            >All</button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '9px 20px', borderRadius: '50px',
                  border: selectedCategory === cat.id ? 'none' : '1px solid rgba(255,255,255,0.15)',
                  backgroundColor: selectedCategory === cat.id ? '#D4A017' : 'rgba(255,255,255,0.05)',
                  color: selectedCategory === cat.id ? '#0A0F1E' : 'rgba(255,255,255,0.7)',
                  fontSize: '13px', fontWeight: selectedCategory === cat.id ? 700 : 400,
                  cursor: 'pointer', fontFamily: "'DM Sans', sans-serif"
                }}
              >{cat.icon} {cat.name}</button>
            ))}
          </div>

          {/* Provider grid */}
          {providers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <p style={{ fontSize: '18px', fontFamily: "'Playfair Display', serif", color: 'rgba(255,255,255,0.4)' }}>No listings found</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
              {providers.map(p => (
                <a
                  key={p.id}
                  href={'/provider/' + p.id}
                  style={{
                    backgroundColor: '#141929', borderRadius: '16px', padding: '24px',
                    textDecoration: 'none', display: 'block',
                    border: '1px solid rgba(255,255,255,0.08)',
                    transition: 'all 0.25s', cursor: 'pointer',
                    position: 'relative', overflow: 'hidden'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.border = '1px solid rgba(212,160,23,0.4)'
                    e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.4)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.border = '1px solid rgba(255,255,255,0.08)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: '#D4A017', borderRadius: '16px 16px 0 0' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{
                      backgroundColor: 'rgba(212,160,23,0.12)', borderRadius: '10px',
                      width: '48px', height: '48px', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '24px', border: '1px solid rgba(212,160,23,0.2)'
                    }}>
                      {p.categories?.icon}
                    </div>
                    {ratings[p.id] && (
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: '3px',
                        backgroundColor: 'rgba(251,191,36,0.12)', padding: '4px 9px',
                        borderRadius: '20px', border: '1px solid rgba(251,191,36,0.2)'
                      }}>
                        <span style={{ color: '#FBBF24', fontSize: '12px' }}>★</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#FBBF24' }}>{ratings[p.id].avg}</span>
                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>({ratings[p.id].count})</span>
                      </span>
                    )}
                  </div>

                  <h2 style={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: '19px', fontWeight: 600,
                    color: '#FFFFFF', marginBottom: '4px', lineHeight: 1.3
                  }}>{p.business_name}</h2>

                  {p.tagline && (
                    <p style={{ fontSize: '13px', color: '#D4A017', marginBottom: '8px', fontWeight: 500 }}>{p.tagline}</p>
                  )}

                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>
                    📍 {p.area}
                  </p>

                  <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.07)',
                    paddingTop: '14px', display: 'flex',
                    justifyContent: 'space-between', alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '12px', color: '#D4A017', fontWeight: 600 }}>View Profile →</span>
                    <span style={{
                      fontSize: '11px', color: 'rgba(255,255,255,0.3)',
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      padding: '3px 8px', borderRadius: '20px'
                    }}>{p.categories?.name}</span>
                  </div>
                </a>
              ))}
            </div>
          )}

          {/* CTA */}
          <div style={{
            marginTop: '80px',
            background: 'linear-gradient(135deg, #0C3D5C 0%, #072940 100%)',
            borderRadius: '20px', padding: '56px 40px',
            textAlign: 'center', border: '1px solid rgba(212,160,23,0.2)',
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: '#D4A017' }} />
            <p style={{ color: '#D4A017', fontSize: '11px', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px' }}>For Business Owners</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '34px', color: '#FFFFFF', marginBottom: '12px' }}>List Your Business — Free</h2>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '15px', marginBottom: '32px', maxWidth: '440px', margin: '0 auto 32px' }}>
              Reach thousands of Bengali customers in Hyderabad.
            </p>
            <a href="/provider-login" style={{
              backgroundColor: '#D4A017', color: '#0A0F1E',
              padding: '14px 36px', borderRadius: '8px',
              fontSize: '15px', fontWeight: 700,
              textDecoration: 'none', display: 'inline-block'
            }}>Get Listed Today</a>
          </div>
        </div>
      </div>
    </div>
  )
}