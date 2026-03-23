'use client'
import { use, useState, useEffect } from 'react'
import { supabase } from '../../../utils/supabase'

export default function ProviderPage({ params }) {
  const { id } = use(params)
  const [provider, setProvider] = useState(null)
  const [reviews, setReviews] = useState([])
  const [user, setUser] = useState(null)
  const [userReview, setUserReview] = useState(null)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [hoveredStar, setHoveredStar] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    const fetchAll = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      const { data: providerData } = await supabase
        .from('providers')
        .select('*, categories(name, icon)')
        .eq('id', id)
        .single()
      setProvider(providerData)

      const { data: reviewData } = await supabase
        .from('reviews')
        .select('*')
        .eq('provider_id', id)
        .order('created_at', { ascending: false })
      setReviews(reviewData || [])

      if (user) {
        const existing = reviewData?.find(r => r.customer_id === user.id)
        if (existing) {
          setUserReview(existing)
          setRating(existing.rating)
          setComment(existing.comment || '')
        }
      }

      setLoading(false)
    }
    fetchAll()
  }, [id])

  const submitReview = async () => {
    if (!rating) {
      setMessage('Please select a rating')
      return
    }
    setSubmitting(true)
    setMessage('')

    const { error } = await supabase.from('reviews').upsert([{
      provider_id: id,
      customer_id: user.id,
      rating,
      comment
    }], { onConflict: 'provider_id,customer_id' })

    if (error) {
      setMessage('Something went wrong. Please try again.')
    } else {
      setMessage('Review submitted!')
      const { data } = await supabase
        .from('reviews')
        .select('*')
        .eq('provider_id', id)
        .order('created_at', { ascending: false })
      setReviews(data || [])
      setUserReview({ rating, comment })
    }
    setSubmitting(false)
  }

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : null

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#78716C' }}>Loading...</p>
    </div>
  )

  if (!provider) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#78716C' }}>Provider not found.</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF8F0', padding: '32px 24px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* Provider card */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid #F0E6D3', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ fontSize: '28px' }}>{provider.categories?.icon}</span>
            <span style={{ fontSize: '13px', backgroundColor: '#FEE2E2', padding: '3px 10px', borderRadius: '50px', color: '#991B1B', fontWeight: 600 }}>{provider.categories?.name}</span>
          </div>

          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '26px', color: '#1C1917', marginBottom: '4px' }}>{provider.business_name}</h1>
          <p style={{ fontSize: '14px', color: '#57534E', marginBottom: '2px' }}>{provider.name}</p>
          <p style={{ fontSize: '14px', color: '#57534E', marginBottom: '12px' }}>📍 {provider.area}</p>

          {avgRating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span style={{ color: '#FBBF24', fontSize: '18px' }}>
                {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
              </span>
              <span style={{ fontWeight: 600, color: '#1C1917' }}>{avgRating}</span>
              <span style={{ fontSize: '13px', color: '#A8A29E' }}>({reviews.length} reviews)</span>
            </div>
          )}

          {provider.description && (
            <p style={{ fontSize: '15px', color: '#44403C', lineHeight: 1.7, marginBottom: '20px' }}>{provider.description}</p>
          )}

          {/* Image gallery */}
          {provider.images && provider.images.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <div style={{ width: '100%', height: '240px', borderRadius: '12px', overflow: 'hidden', marginBottom: '8px' }}>
                <img src={provider.images[activeImage]} alt="provider" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              {provider.images.length > 1 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {provider.images.map((url, i) => (
                    <div
                      key={i}
                      onClick={() => setActiveImage(i)}
                      style={{ width: '64px', height: '64px', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', border: activeImage === i ? '2px solid #0369A1' : '2px solid transparent', opacity: activeImage === i ? 1 : 0.7, transition: 'all 0.15s' }}
                    >
                      <img src={url} alt="thumb" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Action buttons — Call and WhatsApp only */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href={'tel:' + provider.phone} style={{
              flex: 1, textAlign: 'center', backgroundColor: '#7A1515',
              color: '#FDF8F0', padding: '12px', borderRadius: '10px',
              fontWeight: 600, fontSize: '14px', textDecoration: 'none'
            }}>📞 Call</a>
            {provider.whatsapp && (
              <a href={'https://wa.me/91' + provider.whatsapp} target="_blank" rel="noreferrer" style={{
                flex: 1, textAlign: 'center', backgroundColor: '#16A34A',
                color: '#FDF8F0', padding: '12px', borderRadius: '10px',
                fontWeight: 600, fontSize: '14px', textDecoration: 'none'
              }}>💬 WhatsApp</a>
            )}
          </div>
        </div>

        {/* Review form */}
        {user ? (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid #F0E6D3', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#1C1917', marginBottom: '16px' }}>
              {userReview ? 'Update Your Review' : 'Leave a Review'}
            </h2>

            <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} type="button" onMouseEnter={() => setHoveredStar(star)} onMouseLeave={() => setHoveredStar(0)} onClick={() => setRating(star)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '32px', padding: '0 2px' }}>
                  <span style={{ color: star <= (hoveredStar || rating) ? '#FBBF24' : '#D1D5DB' }}>★</span>
                </button>
              ))}
              {rating > 0 && <span style={{ fontSize: '13px', color: '#78716C', alignSelf: 'center', marginLeft: '8px' }}>{rating}/5</span>}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Share your experience (optional)"
              style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1.5px solid #E7D5C0', fontSize: '14px', color: '#1C1917', fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box', resize: 'vertical', backgroundColor: '#FDF8F0' }}
            />

            {message && <p style={{ fontSize: '13px', color: '#059669', marginTop: '8px' }}>{message}</p>}

            <button
              onClick={submitReview}
              disabled={submitting}
              style={{ marginTop: '12px', width: '100%', padding: '13px', backgroundColor: '#0369A1', color: '#FDF8F0', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
            >
              {submitting ? 'Submitting...' : userReview ? 'Update Review' : 'Submit Review'}
            </button>
          </div>
        ) : (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid #F0E6D3', textAlign: 'center' }}>
            <p style={{ color: '#57534E', marginBottom: '16px' }}>Login to leave a review</p>
            <a href="/login" style={{ backgroundColor: '#0369A1', color: '#FDF8F0', padding: '10px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>Login</a>
          </div>
        )}

        {/* Reviews list */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px', border: '1px solid #F0E6D3', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#1C1917', marginBottom: '20px' }}>
            Reviews {reviews.length > 0 && '(' + reviews.length + ')'}
          </h2>
          {reviews.length === 0 ? (
            <p style={{ fontSize: '14px', color: '#A8A29E' }}>No reviews yet. Be the first!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {reviews.map(r => (
                <div key={r.id} style={{ borderBottom: '1px solid #F0E6D3', paddingBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span style={{ color: '#FBBF24', fontSize: '16px' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                    <span style={{ fontSize: '12px', color: '#A8A29E' }}>{new Date(r.created_at).toLocaleDateString('en-IN')}</span>
                  </div>
                  {r.comment && <p style={{ fontSize: '14px', color: '#57534E', lineHeight: 1.6 }}>{r.comment}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center' }}>
          <a href="/" style={{ color: '#0369A1', fontSize: '14px', textDecoration: 'none', fontWeight: 500 }}>← Back to Marketplace</a>
        </div>
      </div>
    </div>
  )
}