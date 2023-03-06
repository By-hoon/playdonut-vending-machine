import { memo } from "react";

const CalculateList = ({ title, list }) => {
  return (
    <div className="calculate-list__container">
      <div className="calculate-title">{title}</div>
      <div className="calculate-list">{list}</div>
    </div>
  );
};

export default memo(CalculateList);
