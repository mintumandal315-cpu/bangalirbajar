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
    <div style={{ minHeight: '100vh', backgroundColor: '#F0EBE3' }}>

      {/* Hero */}
      <div style={{
        position: 'relative',
        padding: '100px 24px 80px',
        textAlign: 'center',
        overflow: 'hidden',
        minHeight: '480px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'url(https://images.pexels.com/photos/5622816/pexels-photo-5622816.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.55)' }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(212,160,23,0.15) 0%, transparent 50%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 2 }}>
          {/* Small Bengali script above */}
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '26px',
            fontWeight: 400,
            color: '#D4A017',
            marginBottom: '8px',
            letterSpacing: '0.05em'
          }}>এই শহরে</p>

          {/* Large bold English below */}
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '58px',
            fontWeight: 700,
            color: '#FDF8F0',
            lineHeight: 1.1,
            marginBottom: '16px',
            textShadow: '0 2px 20px rgba(0,0,0,0.4)'
          }}>Bengali Marketplace</h1>

          <p style={{ color: '#F5D9A0', fontSize: '16px', fontWeight: 300, marginBottom: '40px', letterSpacing: '0.05em' }}>
            Fish · Groceries · Priests · Tutors · Caterers · and more
          </p>

          <div style={{ maxWidth: '520px', margin: '0 auto', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search for fish shops, priests, tutors..."
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '16px 52px 16px 24px', borderRadius: '50px', border: 'none', fontSize: '15px', backgroundColor: 'rgba(253,248,240,0.95)', color: '#1C1917', outline: 'none', boxSizing: 'border-box', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', fontFamily: "'DM Sans', sans-serif" }}
            />
            <span style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px' }}>🔍</span>
          </div>

          <div style={{ marginTop: '20px' }}>
            <span style={{ color: '#F5D9A0', fontSize: '13px', opacity: 0.9 }}>
              {providers.length > 0 ? providers.length + ' businesses listed' : 'Be the first to list your business'}
            </span>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: '#D4A017', height: '4px' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '36px 24px' }}>

        {/* Category pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px', justifyContent: 'center' }}>
          <button
            onClick={() => setSelectedCategory('all')}
            style={{ padding: '8px 18px', borderRadius: '50px', border: selectedCategory === 'all' ? 'none' : '1.5px solid #C9B99A', backgroundColor: selectedCategory === 'all' ? '#0369A1' : '#E8DFD0', color: selectedCategory === 'all' ? '#FDF8F0' : '#57534E', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
          >All</button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              style={{ padding: '8px 18px', borderRadius: '50px', border: selectedCategory === cat.id ? 'none' : '1.5px solid #C9B99A', backgroundColor: selectedCategory === cat.id ? '#0369A1' : '#E8DFD0', color: selectedCategory === cat.id ? '#FDF8F0' : '#57534E', fontSize: '13px', fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
            >{cat.icon} {cat.name}</button>
          ))}
        </div>

        {/* Provider grid */}
        {providers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
            <p style={{ fontSize: '18px', fontFamily: "'Playfair Display', serif", color: '#78716C' }}>No listings found</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
            {providers.map(p => (
              <a
                key={p.id}
                href={'/provider/' + p.id}
                style={{ backgroundColor: '#E8DDD0', borderRadius: '14px', padding: '18px 20px', textDecoration: 'none', display: 'block', border: '1px solid #D4C4B0', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '22px' }}>{p.categories?.icon}</span>
                    <span style={{ fontSize: '11px', color: '#78716C', fontWeight: 600 }}>{p.categories?.name}</span>
                  </div>
                  {ratings[p.id] && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <span style={{ color: '#FBBF24', fontSize: '13px' }}>★</span>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#1C1917' }}>{ratings[p.id].avg}</span>
                      <span style={{ fontSize: '11px', color: '#78716C' }}>({ratings[p.id].count})</span>
                    </div>
                  )}
                </div>

                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', fontWeight: 600, color: '#1C1917', marginBottom: '3px', lineHeight: 1.3 }}>{p.business_name}</h2>
                <p style={{ fontSize: '12px', color: '#57534E', marginBottom: '2px' }}>{p.name}</p>
                <p style={{ fontSize: '12px', color: '#57534E', marginBottom: '10px' }}>📍 {p.area}</p>

                {p.description && (
                  <p style={{ fontSize: '12px', color: '#6B6560', lineHeight: 1.5, marginBottom: '12px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {p.description}
                  </p>
                )}

                <div style={{ borderTop: '1px solid #C9B99A', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', color: '#0369A1', fontWeight: 600 }}>View Profile →</span>
                  <span style={{ fontSize: '11px', color: '#78716C' }}>📞 {p.phone}</span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* CTA */}
        <div style={{ marginTop: '60px', backgroundColor: '#0369A1', borderRadius: '20px', padding: '48px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(212,160,23,0.15) 0%, transparent 60%)', pointerEvents: 'none' }} />
          <p style={{ color: '#D4A017', fontSize: '12px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>For Business Owners</p>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#FDF8F0', marginBottom: '12px' }}>List Your Business — Free</h2>
          <p style={{ color: '#BAE6FD', fontSize: '15px', marginBottom: '28px', maxWidth: '480px', margin: '0 auto 28px' }}>Reach thousands of Bengali customers in Hyderabad.</p>
          <a href="/provider-login" style={{ backgroundColor: '#D4A017', color: '#1C1917', padding: '13px 32px', borderRadius: '8px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>Get Listed Today</a>
        </div>
      </div>
    </div>
  )
}