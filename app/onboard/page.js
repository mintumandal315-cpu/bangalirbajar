'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'

export default function OnboardPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [images, setImages] = useState([])
  const [imageUrls, setImageUrls] = useState([])
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    business_name: '',
    category_id: '',
    phone: '',
    whatsapp: '',
    area: '',
    description: '',
    email: '',
  })

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/provider-login'
        return
      }
      setForm(f => ({ ...f, email: user.email }))
      const { data } = await supabase.from('categories').select('*')
      setCategories(data || [])
    }
    init()
  }, [])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files)
    if (images.length + files.length > 10) {
      alert('Maximum 10 images allowed')
      return
    }

    setUploading(true)
    const uploadedUrls = []

    for (const file of files) {
      const fileName = Date.now() + '-' + file.name.replace(/\s/g, '-')
      const { data: uploadData, error } = await supabase.storage
        .from('provider_image')
        .upload(fileName, file)

      if (!error) {
        const { data: urlData } = supabase.storage
          .from('provider_image')
          .getPublicUrl(fileName)
        uploadedUrls.push(urlData.publicUrl)
      }
    }

    setImages([...images, ...files])
    setImageUrls([...imageUrls, ...uploadedUrls])
    setUploading(false)
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
    setImageUrls(imageUrls.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.from('providers').insert([{
      ...form,
      images: imageUrls
    }])
    setLoading(false)
    if (!error) setSuccess(true)
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#072940', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>🎉</div>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '28px', color: '#D4A017', marginBottom: '8px' }}>Application Successful!</h2>
          <p style={{ color: '#A8A29E', marginBottom: '24px' }}>We will approve your listing soon.</p>
          <a href="/dashboard" style={{
            backgroundColor: '#D4A017', color: '#1C1917',
            padding: '12px 28px', borderRadius: '10px',
            textDecoration: 'none', fontWeight: 600, fontSize: '15px'
          }}>Go to Dashboard</a>
        </div>
      </div>
    )
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1.5px solid #1E4E6E',
    fontSize: '14px',
    color: '#FDF8F0',
    fontFamily: "'DM Sans', sans-serif",
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#0C3D5C'
  }

  const labelStyle = {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: '#A8A29E',
    marginBottom: '8px',
    letterSpacing: '0.06em',
    textTransform: 'uppercase'
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#072940', padding: '40px 24px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto', backgroundColor: '#0C3D5C', borderRadius: '24px', padding: '48px', border: '1px solid #1E4E6E' }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ display: 'inline-block', backgroundColor: '#D4A017', color: '#1C1917', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', padding: '6px 14px', borderRadius: '50px', marginBottom: '16px' }}>
            Business Portal
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '32px', color: '#FDF8F0', marginBottom: '8px' }}>List Your Business</h1>
          <p style={{ color: '#A8A29E', fontSize: '15px' }}>Join এই শহরে — completely free</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            <div>
              <label style={labelStyle}>Your Name *</label>
              <input name="name" required onChange={handleChange} style={inputStyle} placeholder="Your full name" />
            </div>

            <div>
              <label style={labelStyle}>Business Name *</label>
              <input name="business_name" required onChange={handleChange} style={inputStyle} placeholder="Your shop or service name" />
            </div>

            <div>
              <label style={labelStyle}>Category *</label>
              <select name="category_id" required onChange={handleChange} style={inputStyle}>
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={labelStyle}>Phone Number *</label>
              <input name="phone" required onChange={handleChange} style={inputStyle} placeholder="Your phone number" />
            </div>

            <div>
              <label style={labelStyle}>WhatsApp Number</label>
              <input name="whatsapp" onChange={handleChange} style={inputStyle} placeholder="WhatsApp number (if different)" />
            </div>

            <div>
              <label style={labelStyle}>Area *</label>
              <input name="area" required onChange={handleChange} style={inputStyle} placeholder="e.g. Kondapur, Gachibowli, Himayatnagar" />
            </div>

            <div>
              <label style={labelStyle}>Description</label>
              <textarea name="description" onChange={handleChange} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Tell us about your service" />
            </div>

            <div>
              <label style={labelStyle}>Photos (max 10)</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={images.length >= 10}
                style={{ fontSize: '14px', color: '#A8A29E', width: '100%' }}
              />
              {uploading && <p style={{ fontSize: '13px', color: '#A8A29E', marginTop: '8px' }}>Uploading images...</p>}
              {imageUrls.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '12px' }}>
                  {imageUrls.map((url, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img src={url} alt="preview" style={{ width: '100%', height: '90px', objectFit: 'cover', borderRadius: '8px' }} />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: '#D4A017', color: '#1C1917', border: 'none', borderRadius: '50%', width: '22px', height: '22px', cursor: 'pointer', fontSize: '11px' }}
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}
              <p style={{ fontSize: '12px', color: '#57534E', marginTop: '6px' }}>{images.length}/10 images</p>
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              style={{ width: '100%', padding: '14px', backgroundColor: '#D4A017', color: '#1C1917', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'DM Sans', sans-serif", opacity: loading ? 0.7 : 1, marginTop: '8px' }}
            >
              {loading ? 'Submitting...' : 'List My Business'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}