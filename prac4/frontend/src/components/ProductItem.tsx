import type { Product } from '../api/types';

interface ProductItemProps {
  product: Product
  onEdit: (product: Product) => void,
  onDelete: (id: string) => void,
}

export default function ProductItem({ product, onEdit, onDelete }: ProductItemProps) {
  return (
    <div className="productRow">
      <div className="productMain">
        {product.photo && <img className="productPhoto" src={product.photo} alt="Картинка продукта"/>}
        <div className="productInfo">
          <div className="productId">#{product.id}</div>
          <div className="productName">{product.name}</div>
          <div className="productCategory">{product.category}</div>
          <div className="productDescription">{product.description}</div>
          <div className="productPrice">${product.price}</div>
          <div className="productStock">Stock: {product.stock}</div>
          {product.rating && <div className="productRating">Rating: {product.rating}/5</div>}
        </div>
      </div>
      <div className="productActions">
        <button className="btn" onClick={() => onEdit(product)}>
          Edit
        </button>
        <button className="btn btn--danger" onClick={() => onDelete(product.id!)}>
          Delete
        </button>
      </div>
    </div>
  );
}