import type { Product } from "../api/types";
import ProductItem from "./ProductItem.tsx";

interface ProductsListProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
}

export default function ProductsList({
 products,
 onEdit,
 onDelete
}: ProductsListProps) {
  if (!products.length) {
    return <div className="empty">No products yet</div>;
  }

  return (
    <div className="list">
      {products.map((p) => (
        <ProductItem
          key={p.id}
          product={p}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}