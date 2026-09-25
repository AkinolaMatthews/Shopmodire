import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { Product, ProductInput } from '../../types/product'
import '../../styles/admin.css'

const CATEGORY_OPTIONS: Product['category'][] = ['Scrubs', 'Scrub Caps', 'Joggers']

interface Props {
  existing?: Product
}

async function uploadOne(file: File): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `${crypto.randomUUID()}.${ext}`
  const { error } = await supabase.storage.from('product-images').upload(path, file, { upsert: false })
  if (error) throw new Error(error.message)
  const { data } = supabase.storage.from('product-images').getPublicUrl(path)
  return data.publicUrl
}

export default function ProductForm({ existing }: Props) {
  const navigate = useNavigate()
  const [name, setName] = useState(existing?.name ?? '')
  const [category, setCategory] = useState<Product['category']>(existing?.category ?? 'Scrubs')
  const [price, setPrice] = useState(existing ? String(existing.price) : '')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [colors, setColors] = useState(existing?.colors.join(', ') ?? '')
  const [sizes, setSizes] = useState(existing?.sizes.join(', ') ?? '')
  const [isNew, setIsNew] = useState(existing?.is_new ?? false)

  // Cover photo (single, shown on product cards)
  const [imageUrl, setImageUrl] = useState(existing?.image_url ?? '')
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [coverPreview, setCoverPreview] = useState(existing?.image_url ?? '')

  // Gallery photos (multiple, shown on the product detail page)
  const [galleryUrls, setGalleryUrls] = useState<string[]>(existing?.gallery_urls ?? [])
  const [galleryFiles, setGalleryFiles] = useState<File[]>([])
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([])

  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCoverFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setCoverFile(file)
    setCoverPreview(URL.createObjectURL(file))
  }

  const handleGalleryFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    setGalleryFiles(prev => [...prev, ...files])
    setGalleryPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))])
    e.target.value = ''
  }

  const removeExistingGalleryImage = (url: string) => {
    setGalleryUrls(prev => prev.filter(u => u !== url))
  }

  const removePendingGalleryFile = (index: number) => {
    setGalleryFiles(prev => prev.filter((_, i) => i !== index))
    setGalleryPreviews(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      setUploading(true)
      const finalCoverUrl = coverFile ? await uploadOne(coverFile) : imageUrl
      const newGalleryUrls = galleryFiles.length ? await Promise.all(galleryFiles.map(uploadOne)) : []
      setUploading(false)

      const payload: ProductInput = {
        name: name.trim(),
        category,
        price: parseFloat(price),
        description: description.trim(),
        colors: colors.split(',').map(c => c.trim()).filter(Boolean),
        sizes: sizes.split(',').map(s => s.trim()).filter(Boolean),
        image_url: finalCoverUrl,
        gallery_urls: [...galleryUrls, ...newGalleryUrls],
        is_new: isNew,
      }

      if (existing) {
        const { error } = await supabase.from('products').update(payload).eq('id', existing.id)
        if (error) throw new Error(error.message)
      } else {
        const { error } = await supabase.from('products').insert(payload)
        if (error) throw new Error(error.message)
      }
      navigate('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setUploading(false)
      setSaving(false)
    }
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      {error && <div className="admin-auth__error">{error}</div>}

      <div className="admin-form__row">
        <div className="admin-form__field">
          <label>Product name</label>
          <input required value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="admin-form__field">
          <label>Category</label>
          <select value={category} onChange={e => setCategory(e.target.value as Product['category'])}>
            {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <div className="admin-form__row">
        <div className="admin-form__field">
          <label>Price (USD)</label>
          <input required type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)} />
        </div>
        <div className="admin-form__field admin-form__field--checkbox">
          <label>
            <input type="checkbox" checked={isNew} onChange={e => setIsNew(e.target.checked)} />
            Mark as "New"
          </label>
        </div>
      </div>

      <div className="admin-form__field">
        <label>Description</label>
        <textarea required rows={4} value={description} onChange={e => setDescription(e.target.value)} />
      </div>

      <div className="admin-form__row">
        <div className="admin-form__field">
          <label>Colors (comma separated)</label>
          <input placeholder="Burgundy, Charcoal, Ivory" value={colors} onChange={e => setColors(e.target.value)} />
        </div>
        <div className="admin-form__field">
          <label>Sizes (comma separated)</label>
          <input placeholder="XS, S, M, L, XL" value={sizes} onChange={e => setSizes(e.target.value)} />
        </div>
      </div>

      <div className="admin-form__field">
        <label>Cover photo (shown on product cards)</label>
        <input type="file" accept="image/*" onChange={handleCoverFile} />
        {coverPreview && <img src={coverPreview} alt="Cover preview" className="admin-form__preview" />}
      </div>

      <div className="admin-form__field">
        <label>Gallery photos (shown on the product page — you can add several)</label>
        <input type="file" accept="image/*" multiple onChange={handleGalleryFiles} />
        {(galleryUrls.length > 0 || galleryPreviews.length > 0) && (
          <div className="admin-form__gallery-grid">
            {galleryUrls.map(url => (
              <div className="admin-form__gallery-item" key={url}>
                <img src={url} alt="Gallery" />
                <button type="button" onClick={() => removeExistingGalleryImage(url)} aria-label="Remove image">
                  <X size={14} />
                </button>
              </div>
            ))}
            {galleryPreviews.map((preview, i) => (
              <div className="admin-form__gallery-item admin-form__gallery-item--pending" key={preview}>
                <img src={preview} alt="Pending upload" />
                <button type="button" onClick={() => removePendingGalleryFile(i)} aria-label="Remove image">
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="admin-form__actions">
        <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin')}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
          {uploading ? 'Uploading photos…' : saving ? 'Saving…' : existing ? 'Save Changes' : 'Add Product'}
        </button>
      </div>
    </form>
  )
}
