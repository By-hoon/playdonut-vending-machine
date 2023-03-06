import { memo } from "react";

const PurchaseDetail = ({ purchaseDetail }) => {
  return (
    <div className="product-detail__container">
      <div className="product-detail-time">{purchaseDetail.id}</div>
      <div className="product-detail-time">{purchaseDetail.time}</div>
      <div className="product-detail-user">{purchaseDetail.userName}</div>
      <div className="product-detail-product">{purchaseDetail.productName}</div>
    </div>
  );
};

export default memo(PurchaseDetail);
