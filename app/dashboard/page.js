'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'

export default function DashboardPage() {
  const [provider, setProvider] = useState(null)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [listingMessage, setListingMessage] = useState('')
  const [pendingUpdate, setPendingUpdate] = useState(null)

  const [form, setForm] = useState({
    name: '',
    business_name: '',
    category_id: '',
    phone: '',
    whatsapp: '',
    area: '',
    description: '',
  })
  const [imageUrls, setImageUrls] = useState([])

  useEffect(() => {
    const fetchProvider = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/provider-login'
        return
      }

      const { data: catData } = await supabase.from('categories').select('*')
      setCategories(catData || [])

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
      setForm({
        name: providerData.name || '',
        business_name: providerData.business_name || '',
        category_id: providerData.category_id || '',
        phone: providerData.phone || '',
        whatsapp: providerData.whatsapp || '',
        area: providerData.area || '',
        description: providerData.description || '',
      })
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

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
      const { error } = await supabase.storage.from('provider_image').upload(fileName, file)
      if (!error) {
        const { data: urlData } = supabase.storage.from('provider_image').getPublicUrl(fileName)
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
    setListingMessage('')
    const { error } = await supabase.from('provider_updates').insert([{
      provider_id: provider.id,
      new_description: form.description,
      new_images: imageUrls,
      status: 'pending'
    }])

    if (!error) {
      await supabase.from('providers').update({
        name: form.name,
        business_name: form.business_name,
        category_id: form.category_id,
        phone: form.phone,
        whatsapp: form.whatsapp,
        area: form.area,
      }).eq('id', provider.id)
    }

    if (error) {
      setListingMessage('Something went wrong. Please try again.')
    } else {
      setListingMessage('Update submitted! Description and photos pending admin approval.')
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

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: '10px',
    border: '1.5px solid #E7D5C0', fontSize: '14px', color: '#1C1917',
    fontFamily: "'DM Sans', sans-serif", outline: 'none',
    boxSizing: 'border-box', backgroundColor: '#FDF8F0'
  }

  const labelStyle = {
    display: 'block', fontSize: '12px', fontWeight: 600,
    color: '#57534E', marginBottom: '6px',
    textTransform: 'uppercase', letterSpacing: '0.06em'
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FDF8F0', padding: '40px 24px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '28px 32px', marginBottom: '24px', border: '1px solid #FECACA', boxShadow: '0 2px 12px rgba(122,21,21,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <span style={{ fontSize: '28px' }}>{provider.categories?.icon}</span>
                <span style={{ fontSize: '13px', color: '#78716C' }}>{provider.categories?.name}</span>
              </div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#1C1917', marginBottom: '4px' }}>{provider.business_name}</h1>
              <p style={{ fontSize: '13px', color: '#57534E' }}>📍 {provider.area} · 📞 {provider.phone}</p>
              <span style={{
                display: 'inline-block', marginTop: '8px',
                fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: '50px',
                backgroundColor: provider.is_approved ? '#D1FAE5' : '#FEF3C7',
                color: provider.is_approved ? '#065F46' : '#92400E'
              }}>
                {provider.is_approved ? '✓ Listing Approved' : '⏳ Pending Approval'}
              </span>
            </div>
            <button onClick={signOut} style={{ fontSize: '13px', color: '#7A1515', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif" }}>
              Sign out
            </button>
          </div>

          {provider.admin_notes && (
            <div style={{ marginTop: '16px', backgroundColor: '#FEF9C3', border: '1px solid #FDE047', borderRadius: '12px', padding: '14px 18px' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#713F12', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>📋 Note from Admin</p>
              <p style={{ fontSize: '14px', color: '#78350F' }}>{provider.admin_notes}</p>
            </div>
          )}
        </div>

        {/* Edit form */}
        {pendingUpdate ? (
          <div style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '20px', padding: '28px 32px', textAlign: 'center' }}>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#92400E', marginBottom: '8px' }}>Update Pending Review</p>
            <p style={{ fontSize: '14px', color: '#B45309' }}>Your changes are waiting for admin approval.</p>
          </div>
        ) : (
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '20px', padding: '32px', border: '1px solid #FECACA' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#7A1515', marginBottom: '6px' }}>Edit Your Listing</h2>
            <p style={{ fontSize: '13px', color: '#A8A29E', marginBottom: '28px' }}>Description and photo changes need admin approval. Other changes go live immediately.</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Your Name</label>
                  <input name="name" value={form.name} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Business Name</label>
                  <input name="business_name" value={form.business_name} onChange={handleChange} style={inputStyle} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Category</label>
                <select name="category_id" value={form.category_id} onChange={handleChange} style={inputStyle}>
                  <option value="">Select category</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>Phone Number</label>
                  <input name="phone" value={form.phone} onChange={handleChange} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>WhatsApp Number</label>
                  <input name="whatsapp" value={form.whatsapp} onChange={handleChange} style={inputStyle} placeholder="If different from phone" />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Area</label>
                <input name="area" value={form.area} onChange={handleChange} style={inputStyle} placeholder="e.g. Kondapur, Gachibowli" />
              </div>

              <div>
                <label style={labelStyle}>Description <span style={{ color: '#A8A29E', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(needs approval)</span></label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={4}
                  style={{ ...inputStyle, resize: 'vertical' }}
                  placeholder="Tell customers about your service"
                />
              </div>

              <div>
                <label style={labelStyle}>Photos ({imageUrls.length}/10) <span style={{ color: '#A8A29E', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>(needs approval)</span></label>
                <input type="file" accept="image/*" multiple onChange={handleImageChange} disabled={imageUrls.length >= 10} style={{ fontSize: '14px', color: '#57534E' }} />
                {uploading && <p style={{ fontSize: '13px', color: '#78716C', marginTop: '8px' }}>Uploading...</p>}
                {imageUrls.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '12px' }}>
                    {imageUrls.map((url, i) => (
                      <div key={i} style={{ position: 'relative' }}>
                        <img src={url} alt="preview" style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
                        <button type="button" onClick={() => removeImage(i)} style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: '#7A1515', color: '#FDF8F0', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '10px' }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {listingMessage && <p style={{ fontSize: '13px', color: '#059669' }}>{listingMessage}</p>}

              <button
                onClick={submitUpdate}
                disabled={submitting || uploading}
                style={{ width: '100%', padding: '14px', backgroundColor: '#7A1515', color: '#FDF8F0', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif', opacity: submitting ? 0.7 : 1" }}
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}