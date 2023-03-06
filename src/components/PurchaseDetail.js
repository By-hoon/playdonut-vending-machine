import { memo } from "react";

const PurchaseDetail = ({ purchaseDetail }) => {
  return (
    <div className="purchase-detail__container">
      <div className="purchase-detail-id">{purchaseDetail.id}</div>
      <div className="purchase-detail-time">{purchaseDetail.time}</div>
      <div className="purchase-detail-user">{purchaseDetail.userName}</div>
      <div className="purchase-detail-product">{purchaseDetail.productName}</div>
    </div>
  );
};

export default memo(PurchaseDetail);
