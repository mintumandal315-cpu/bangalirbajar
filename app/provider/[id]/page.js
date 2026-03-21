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
    <div className="min-h-screen bg-red-50 flex items-center justify-center">
      <p className="text-gray-600">Loading...</p>
    </div>
  )

  if (!provider) return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center">
      <p className="text-gray-600">Provider not found.</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-red-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">{provider.categories?.icon}</span>
            <span className="text-sm text-gray-500">{provider.categories?.name}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{provider.business_name}</h1>
          <p className="text-gray-600">{provider.name}</p>
          <p className="text-gray-600 mt-1">📍 {provider.area}</p>

          {avgRating && (
            <div className="flex items-center gap-2 mt-3">
              <span className="text-yellow-400 text-xl">
                {'★'.repeat(Math.round(avgRating))}{'☆'.repeat(5 - Math.round(avgRating))}
              </span>
              <span className="text-gray-700 font-medium">{avgRating}</span>
              <span className="text-gray-400 text-sm">({reviews.length} reviews)</span>
            </div>
          )}

          {provider.description && (
            <p className="text-gray-700 mt-4">{provider.description}</p>
          )}

          {provider.images && provider.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {provider.images.map((url, i) => (
                <img key={i} src={url} alt="provider" className="w-full h-28 object-cover rounded-lg" />
              ))}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <a
              href={'tel:' + provider.phone}
              className="flex-1 text-center bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-medium"
            >
              Call
            </a>
            {provider.whatsapp && (
              <a
                href={'https://wa.me/91' + provider.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="flex-1 text-center bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium"
              >
                WhatsApp
              </a>
            )}
            <a
              href="/chat"
              className="flex-1 text-center bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium"
            >
              Chat
            </a>
          </div>
        </div>

        {user ? (
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {userReview ? 'Update Your Review' : 'Leave a Review'}
            </h2>

            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setRating(star)}
                  className="text-3xl transition"
                >
                  <span className={star <= (hoveredStar || rating) ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                </button>
              ))}
              {rating > 0 && (
                <span className="ml-2 text-gray-600 text-sm self-center">{rating}/5</span>
              )}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Share your experience (optional)"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
            />

            {message && (
              <p className="text-sm text-red-500 mt-2">{message}</p>
            )}

            <button
              onClick={submitReview}
              disabled={submitting}
              className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition"
            >
              {submitting ? 'Submitting...' : userReview ? 'Update Review' : 'Submit Review'}
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow p-6 text-center">
            <p className="text-gray-600 mb-3">Login to leave a review</p>
            <a
              href="/login"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium"
            >
              Login
            </a>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Reviews {reviews.length > 0 && '(' + reviews.length + ')'}
          </h2>
          {reviews.length === 0 ? (
            <p className="text-gray-400 text-sm">No reviews yet. Be the first!</p>
          ) : (
            <div className="space-y-4">
              {reviews.map(r => (
                <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-yellow-400">
                      {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(r.created_at).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                  {r.comment && (
                    <p className="text-gray-700 text-sm">{r.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center">
          <a href="/" className="text-red-600 hover:underline text-sm">Back to Directory</a>
        </div>
      </div>
    </div>
  )
}