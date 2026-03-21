'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'

export default function DashboardPage() {
  const [provider, setProvider] = useState(null)
  const [loading, setLoading] = useState(true)
  const [description, setDescription] = useState('')
  const [imageUrls, setImageUrls] = useState([])
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [pendingUpdate, setPendingUpdate] = useState(null)

  useEffect(() => {
    const fetchProvider = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/provider-login'
        return
      }

      const { data: providerData } = await supabase
        .from('providers')
        .select('*, categories(name, icon)')
        .eq('email', user.email)
        .single()

      if (!providerData) {
        window.location.href = '/onboard'
        return
      }

      setProvider(providerData)
      setDescription(providerData.description || '')
      setImageUrls(providerData.images || [])

      const { data: updateData } = await supabase
        .from('provider_updates')
        .select('*')
        .eq('provider_id', providerData.id)
        .eq('status', 'pending')
        .single()

      setPendingUpdate(updateData)
      setLoading(false)
    }

    fetchProvider()
  }, [])

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files)
    if (imageUrls.length + files.length > 10) {
      alert('Maximum 10 images allowed')
      return
    }

    setUploading(true)
    const uploadedUrls = []

    for (const file of files) {
      const fileName = Date.now() + '-' + file.name.replace(/\s/g, '-')
      const { error } = await supabase.storage
        .from('provider-images')
        .upload(fileName, file)

      if (!error) {
        const { data: urlData } = supabase.storage
          .from('provider-images')
          .getPublicUrl(fileName)
        uploadedUrls.push(urlData.publicUrl)
      }
    }

    setImageUrls([...imageUrls, ...uploadedUrls])
    setUploading(false)
  }

  const removeImage = (index) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index))
  }

  const submitUpdate = async () => {
    setSubmitting(true)
    setMessage('')

    const { error } = await supabase.from('provider_updates').insert([{
      provider_id: provider.id,
      new_description: description,
      new_images: imageUrls,
      status: 'pending'
    }])

    if (error) {
      setMessage('Something went wrong. Please try again.')
    } else {
      setMessage('Update submitted! Waiting for admin approval.')
      setPendingUpdate({ status: 'pending' })
    }
    setSubmitting(false)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/provider-login'
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: '#78716C' }}>Loading...</p>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF8F0', padding: '40px 24px' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Provider card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '20px',
          padding: '32px',
          marginBottom: '24px',
          border: '1px solid #FECACA',
          boxShadow: '0 2px 12px rgba(122,21,21,0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '28px' }}>{provider.categories?.icon}</span>
                <span style={{ fontSize: '13px', color: '#78716C' }}>{provider.categories?.name}</span>
              </div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '24px', color: '#1C1917', marginBottom: '4px' }}>{provider.business_name}</h1>
              <p style={{ fontSize: '14px', color: '#57534E', marginBottom: '2px' }}>{provider.name}</p>
              <p style={{ fontSize: '14px', color: '#57534E', marginBottom: '2px' }}>📍 {provider.area}</p>
              <p style={{ fontSize: '14px', color: '#57534E', marginBottom: '12px' }}>📞 {provider.phone}</p>
              <span style={{
                display: 'inline-block',
                fontSize: '12px',
                fontWeight: 600,
                padding: '4px 12px',
                borderRadius: '50px',
                backgroundColor: provider.is_approved ? '#D1FAE5' : '#FEF3C7',
                color: provider.is_approved ? '#065F46' : '#92400E'
              }}>
                {provider.is_approved ? '✓ Listing Approved' : '⏳ Pending Approval'}
              </span>
            </div>
            <button
              onClick={signOut}
              style={{ fontSize: '13px', color: '#7A1515', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}
            >
              Sign out
            </button>
          </div>

          {/* Admin note — shown prominently if exists */}
          {provider.admin_notes && (
            <div style={{
              marginTop: '20px',
              backgroundColor: '#FEF9C3',
              border: '1px solid #FDE047',
              borderRadius: '12px',
              padding: '16px 20px'
            }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#713F12', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>📋 Note from Admin</p>
              <p style={{ fontSize: '14px', color: '#78350F', lineHeight: 1.6 }}>{provider.admin_notes}</p>
            </div>
          )}
        </div>

        {/* Current images */}
        {provider.images && provider.images.length > 0 && (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '32px',
            marginBottom: '24px',
            border: '1px solid #FECACA',
            boxShadow: '0 2px 12px rgba(122,21,21,0.08)'
          }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '18px', color: '#7A1515', marginBottom: '16px' }}>Your Current Photos</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {provider.images.map((url, i) => (
                <img key={i} src={url} alt="listing" style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '10px' }} />
              ))}
            </div>
          </div>
        )}

        {/* Edit form */}
        {pendingUpdate ? (
          <div style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '20px',
            padding: '32px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#92400E', marginBottom: '8px' }}>Update Pending Review</p>
            <p style={{ fontSize: '14px', color: '#B45309' }}>Your changes are waiting for admin approval. We will review them shortly.</p>
          </div>
        ) : (
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            padding: '32px',
            border: '1px solid #FECACA',
            boxShadow: '0 2px 12px rgba(122,21,21,0.08)'
          }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#7A1515', marginBottom: '6px' }}>Edit Your Listing</h2>
            <p style={{ fontSize: '13px', color: '#A8A29E', marginBottom: '24px' }}>Changes will be reviewed by admin before going live.</p>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#57534E', marginBottom: '8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1.5px solid #E7D5C0',
                  fontSize: '14px',
                  color: '#1C1917',
                  fontFamily: "'DM Sans', sans-serif",
                  outline: 'none',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
                placeholder="Tell customers about your service"
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#57534E', marginBottom: '8px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Photos ({imageUrls.length}/10)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={imageUrls.length >= 10}
                style={{ fontSize: '14px', color: '#57534E' }}
              />
              {uploading && <p style={{ fontSize: '13px', color: '#78716C', marginTop: '8px' }}>Uploading...</p>}
              {imageUrls.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '12px' }}>
                  {imageUrls.map((url, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img src={url} alt="preview" style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '8px' }} />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        style={{
                          position: 'absolute', top: '4px', right: '4px',
                          backgroundColor: '#7A1515', color: '#FDF8F0',
                          border: 'none', borderRadius: '50%',
                          width: '22px', height: '22px',
                          cursor: 'pointer', fontSize: '12px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {message && (
              <p style={{ fontSize: '13px', color: '#059669', marginBottom: '16px' }}>{message}</p>
            )}

            <button
              onClick={submitUpdate}
              disabled={submitting || uploading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: '#7A1515',
                color: '#FDF8F0',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                opacity: submitting ? 0.7 : 1
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Changes for Approval'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}