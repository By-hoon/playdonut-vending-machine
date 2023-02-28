const Product = ({ product }) => {
  return (
    <div className="product__container">
      <div>{product.name}</div>
      <div>{product.price}원</div>
      <div>{product.current}개</div>
    </div>
  );
};

export default Product;
