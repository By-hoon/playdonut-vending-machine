const Product = ({ product }) => {
  return (
    <div className="product__container">
      <div className="product__name">{product.name}</div>
      <div className="product__price">{product.price}원</div>
      <div className="product__current">{product.current}개</div>
    </div>
  );
};

export default Product;
