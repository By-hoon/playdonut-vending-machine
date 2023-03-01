const PurchaseDetail = ({ purchaseDetail }) => {
  return (
    <div className="product-detail__container">
      <div className="product-detail-time">{purchaseDetail.id}</div>
      <div className="product-detail-time">{purchaseDetail.time}</div>
      <div className="product-detail-user">{purchaseDetail.user.name}</div>
      <div className="product-detail-product">{purchaseDetail.product.name}</div>
    </div>
  );
};

export default PurchaseDetail;
