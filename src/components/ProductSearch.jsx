import { getProducts } from "@/feautures/products/productService";
import { useState, useRef, useEffect } from "react";

export default function ProductSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [products, setProducts] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    async function fetchProducts() {
      const data = await getProducts();
      setProducts(data);
    }
    fetchProducts();
  });

  const filteredProducts = query
    ? products.filter((p) =>
        query
          .toLowerCase()
          .split(" ")
          .every((word) => p.product_name.toLowerCase().includes(word)),
      )
    : [];

  const handleSelect = (product) => {
    setQuery(product.product_name);
    setOpen(false);
    console.log("Selected:", product);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-md relative" ref={wrapperRef}>
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="w-full border rounded-md px-3 py-2 shadow-sm"
      />

      {open && query.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded-md shadow mt-1 max-h-60 overflow-auto">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <li
                key={product.id}
                onClick={() => handleSelect(product)}
                className="px-3 py-2 flex justify-between cursor-pointer hover:bg-gray-100"
              >
                <span className="w-50 overflow-hidden text-ellipsis text-nowrap">
                  {product.product_name
                    .split(new RegExp(`(${query})`, "gi"))
                    .map((part, i) =>
                      part.toLowerCase() === query.toLowerCase() ? (
                        <span key={i} className="font-bold">
                          {part}
                        </span>
                      ) : (
                        <span key={i}>{part}</span>
                      ),
                    )}
                </span>
                <span className="text-gray-500 text-sm">₦{product.price}</span>
                <span className="text-gray-500 text-sm">{product.stock_quantity ?? 0}</span>
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-500">
              No results for "{query}"
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
