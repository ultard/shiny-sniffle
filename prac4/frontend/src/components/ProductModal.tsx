import { useEffect, useState, type SubmitEventHandler } from 'react';
import type { Product } from '../api/types';

interface ProductModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialProduct?: Product | null;
  onClose: () => void;
  onSubmit: (product: Product) => void;
}

export default function ProductModal({
  open,
  mode,
  initialProduct,
  onClose,
  onSubmit,
}: ProductModalProps) {
  const [name, setName] = useState<string>('');
  const [category, setCategory] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [stock, setStock] = useState<string>('');
  const [rating, setRating] = useState<string>('');
  const [photo, setPhoto] = useState<string>('');

  useEffect(() => {
    if (!open) return;

    setName(initialProduct?.name ?? '');
    setCategory(initialProduct?.category ?? '');
    setDescription(initialProduct?.description ?? '');
    setPrice(initialProduct?.price != null ? String(initialProduct.price) : '');
    setStock(initialProduct?.stock != null ? String(initialProduct.stock) : '');
    setRating(initialProduct?.rating != null ? String(initialProduct.rating) : '');
    setPhoto(initialProduct?.photo ?? '');
  }, [open, initialProduct]);

  if (!open) return null;

  const title = mode === 'edit' ? 'Edit Product' : 'Create Product';

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    const trimmedCategory = category.trim();
    const trimmedDescription = description.trim();
    const parsedPrice = Number(price);
    const parsedStock = Number(stock);
    const parsedRating = Number(rating);

    if (!trimmedName || !trimmedCategory || !trimmedDescription) {
      alert('Please fill in name, category, and description');
      return;
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      alert('Enter a valid price (> 0)');
      return;
    }
    if (!Number.isFinite(parsedStock) || parsedStock < 0) {
      alert('Enter a valid stock quantity (>= 0)');
      return;
    }
    if (rating && (!Number.isFinite(parsedRating) || parsedRating < 0 || parsedRating > 5)) {
      alert('Enter a valid rating (0-5)');
      return;
    }

    onSubmit({
      id: initialProduct?.id,
      name: trimmedName,
      category: trimmedCategory,
      description: trimmedDescription,
      price: parsedPrice,
      stock: parsedStock,
      rating: parsedRating || undefined,
      photo: photo.trim() || undefined,
    } as Product);
  };

  return (
    <div className="backdrop" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="modal__header">
          <div className="modal__title">{title}</div>
          <button className="iconBtn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <label className="label">
            Name
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., iPhone 15"
              autoFocus
            />
          </label>

          <label className="label">
            Category
            <input
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., Electronics"
            />
          </label>

          <label className="label">
            Description
            <textarea
              className="input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Product description"
              rows={3}
            />
          </label>

          <label className="label">
            Price ($)
            <input
              className="input"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g., 999"
            />
          </label>

          <label className="label">
            Stock
            <input
              className="input"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              placeholder="e.g., 50"
            />
          </label>

          <label className="label">
            Rating (0-5, optional)
            <input
              className="input"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="e.g., 4.8"
            />
          </label>

          <label className="label">
            Photo URL (optional)
            <input
              className="input"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              placeholder="e.g., https://example.com/image.jpg"
            />
          </label>

          <div className="modal__footer">
            <button type="button" className="btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary">
              {mode === 'edit' ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}