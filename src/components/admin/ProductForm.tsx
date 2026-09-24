import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { Product, ProductInput } from '../../types/product'
import '../../styles/admin.css'

const CATEGORY_OPTIONS: Product['category'][] = ['Scrubs', 'Scrub Caps', 'Joggers']

interface Props {
  existing?: Product
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
  const [imageUrl, setImageUrl] = useState(existing?.image_url ?? '')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [preview, setPreview] = useState(existing?.image_url ?? '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return imageUrl
    setUploading(true)
    const ext = imageFile.name.split('.').pop()
    const path = `${crypto.randomUUID()}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(path, imageFile, { upsert: false })
    setUploading(false)
    if (uploadError) throw new Error(uploadError.message)
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    return data.publicUrl
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    try {
      const finalImageUrl = await uploadImage()
      const payload: ProductInput = {
        name: name.trim(),
        category,
        price: parseFloat(price),
        description: description.trim(),
        colors: colors.split(',').map(c => c.trim()).filter(Boolean),
        sizes: sizes.split(',').map(s => s.trim()).filter(Boolean),
        image_url: finalImageUrl,
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
        <label>Product photo</label>
        <input type="file" accept="image/*" onChange={handleFile} />
        {preview && (
          <img src={preview} alt="Preview" className="admin-form__preview" />
        )}
      </div>

      <div className="admin-form__actions">
        <button type="button" className="btn btn-ghost" onClick={() => navigate('/admin')}>Cancel</button>
        <button type="submit" className="btn btn-primary" disabled={saving || uploading}>
          {uploading ? 'Uploading photo…' : saving ? 'Saving…' : existing ? 'Save Changes' : 'Add Product'}
        </button>
      </div>
    </form>
  )
}
