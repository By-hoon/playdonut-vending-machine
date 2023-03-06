import { memo } from "react";

const RankingDetail = ({ ranking }) => {
  return (
    <>
      <div className="ranking-grade">{ranking.rank}위</div>
      <div className="ranking-name">{ranking.name}</div>
      <div className="ranking-amount">{ranking.amount}회 이용</div>
    </>
  );
};

export default memo(RankingDetail);
