import { useState } from "react";
import useProducts from "../hooks/useProducts";
import useUsers from "../hooks/useUsers";
import Product from "./Product";
import ProductForm from "./ProductForm";
import PurchaseDetail from "./PurchaseDetail";
import { moneyOptions, MESSAGE } from "../shared/Constants";
import { getExcel } from "../utils/Util";

const VendingMachine = () => {
  const [step, setStep] = useState("setting");
  const [currentMoney, setCurrentMoney] = useState(0);
  const [purchaseDetails, setPurchaseDetails] = useState([]);
  const [counter, setCounter] = useState({ user: [], product: [] });
  const [userRanking, setUserRanking] = useState([]);
  const [productRanking, setProductRanking] = useState([]);
  const { products, setProducts, productsUpdate } = useProducts();
  const { users, currentUser, appear, appearChanger, userChange, userUpdate } = useUsers();

  const saveProducts = () => {
    setStep("running");
    vendingMachineTimer();
    counterInitialization();
  };

  const vendingMachineTimer = () => {
    const currentTime = new Date();
    const currentMinute = currentTime.getMinutes();
    const currentSecont = currentTime.getSeconds();
    const needMinute = 59 - currentMinute; // 초 단위도 빼야 하기 때문에 60초+59분 = 60분
    const needSecond = 60 - currentSecont;
    setTimeout(() => {
      productsUpdate({ name: "initialization" });
      setInterval(() => productsUpdate({ name: "initialization" }), 3600000);
    }, needSecond * 1000 + needMinute * 60000);
  };

  const counterInitialization = () => {
    const newCounter = JSON.parse(JSON.stringify(counter));
    users.forEach((user) => {
      if (user.id !== "owner") newCounter.user[user.id - 1] = [user.name, 0, user.id];
    });
    products.forEach((product) => {
      newCounter.product[product.id] = [product.name, 0, product.id];
    });
    setCounter(newCounter);
  };

  const purchaseProduct = (index) => {
    const currentProduct = products[index];
    if (currentMoney >= currentProduct.price && currentProduct.current > 0) {
      productsUpdate({ name: "sell", index });
      userUpdate({ name: "log", index: currentUser.id, currentProduct });
      setCurrentMoney(currentMoney - currentProduct.price);
      updatePurchaseDetails(currentProduct);
      updateCounter(currentProduct);
    }
  };
  const updateCounter = (currentProduct) => {
    const newCounter = JSON.parse(JSON.stringify(counter));
    newCounter.user[currentUser.id - 1][1]++;
    newCounter.product[currentProduct.id][1]++;
    setCounter(newCounter);
  };

  const updatePurchaseDetails = (currentProduct) => {
    const newPurchaseDetails = [...purchaseDetails];
    const currentDate = new Date();
    const year = String(currentDate.getFullYear());
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const date = String(currentDate.getDate()).padStart(2, "0");
    const hour = String(currentDate.getHours()).padStart(2, "0");
    const minute = String(currentDate.getMinutes()).padStart(2, "0");
    newPurchaseDetails.push({
      id: purchaseDetails.length + 1,
      userName: currentUser.name,
      productName: currentProduct.name,
      sale: currentProduct.price,
      time: `${year}/${month}/${date} ${hour}:${minute}`,
    });
    setPurchaseDetails(newPurchaseDetails);
  };

  const injectionMoney = (moneyOption) => {
    userUpdate({ name: "wallet", money: -moneyOption });
    setCurrentMoney(currentMoney + moneyOption);
  };
  const returnMoney = () => {
    userUpdate({ name: "wallet", money: currentMoney });
    setCurrentMoney(0);
  };

  const doCalculate = () => {
    setStep("calculate");
    const newCounter = JSON.parse(JSON.stringify(counter));
    newCounter.user.sort((a, b) => b[1] - a[1]);
    newCounter.product.sort((a, b) => b[1] - a[1]);
    const newUserRanking = assignRank(newCounter.user);
    const newProductRanking = assignRank(newCounter.product);
    setUserRanking(newUserRanking);
    setProductRanking(newProductRanking);
    pickBestProduct(newProductRanking);
  };
  const assignRank = (targetCounter) => {
    const ranking = [];
    let rank = 1;
    let amount = targetCounter[0][1];
    let sameCount = 0;
    for (let i = 0; i < targetCounter.length; i++) {
      if (amount !== targetCounter[i][1]) {
        rank += sameCount;
        amount = targetCounter[i][1];
        sameCount = 0;
      }
      sameCount++;
      ranking.push({
        rank,
        id: targetCounter[i][2],
        name: targetCounter[i][0],
        amount: targetCounter[i][1],
      });
    }
    return ranking;
  };
  const pickBestProduct = (newProductRanking) => {
    const bestProduct = [];
    for (let i = 0; i < newProductRanking.length; i++) {
      if (newProductRanking[i].rank !== 1) break;
      bestProduct.push(newProductRanking[i].id);
    }
    productsUpdate({ name: "priceIncrease", target: bestProduct });
  };

  const requestExcel = () => {
    const sheet = [["판매 시간", "판매 상품", "매출"]];
    purchaseDetails.forEach((purchaseDetail) => {
      sheet.push([purchaseDetail.time, purchaseDetail.productName, purchaseDetail.sale]);
    });
    getExcel(sheet);
  };

  const restart = () => {
    setStep("running");
    userUpdate({ name: "restart", money: 10000 });
  };

  const Render = () => {
    switch (step) {
      case "setting": {
        return (
          <div className="product-set__container">
            <div className="title">상품 목록 설정</div>
            <ProductForm products={products} setProducts={setProducts} />
            <div className="products__container">
              {products.map((product) => (
                <Product key={product.id} product={product} />
              ))}
            </div>
            <button className="product-set__button" onClick={saveProducts}>
              설정 완료
            </button>
          </div>
        );
      }
      case "running": {
        return (
          <div className="purchase__container">
            <div className="title">자판기 이용</div>
            {currentUser.name === "나사장" ? (
              <div className="owner-menus__container">
                <button onClick={doCalculate}>정산완료</button>
              </div>
            ) : (
              <div className="user-menus__container">
                <div className="user-wallet">지갑: {currentUser.wallet}원</div>
                <div className="injection-money__container">
                  <div>
                    <div className="injection-money-title">투입된 금액</div>
                    <div className="current-money">{currentMoney}원</div>
                  </div>
                  <div>
                    {moneyOptions.map((moneyOption) => (
                      <button
                        key={moneyOption}
                        className="money-option"
                        onClick={() => injectionMoney(moneyOption)}
                        disabled={moneyOption > currentUser.wallet}
                      >
                        +{moneyOption}원
                      </button>
                    ))}
                    <button className="return-money" onClick={returnMoney}>
                      반환
                    </button>
                  </div>
                </div>
              </div>
            )}
            <div className="products__container">
              {products.map((product, index) => (
                <div key={product.id} className="product-sell__container">
                  <Product product={product} />
                  <div className="purchase-button__container">
                    <button
                      className="purchase__button"
                      onClick={() => purchaseProduct(index)}
                      disabled={currentUser.name === "나사장"}
                    >
                      구매
                    </button>
                  </div>
                  {product.current === 0 ? (
                    <div className="sold-out__container">
                      <span>{MESSAGE.SOLDOUT}</span>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        );
      }
      case "calculate": {
        return (
          <div className="calculate__container">
            <div className="owner-menus__container">
              <button onClick={requestExcel}>정산</button>
              <button onClick={restart}>재시작</button>
            </div>
            <div className="calculate-lists__container">
              <div>
                <div className="calculate-title">구매내역</div>
                <div className="product-details__container">
                  {purchaseDetails.map((purchaseDetail) => (
                    <PurchaseDetail key={purchaseDetail.id} purchaseDetail={purchaseDetail} />
                  ))}
                </div>
              </div>
              <div>
                <div className="calculate-title">상품 순위</div>
                <div className="product-ranking__container">
                  {productRanking.map((ranking, index) => (
                    <div key={index}>
                      <div className="ranking-grade">{ranking.rank}위</div>
                      <div className="ranking-name">{ranking.name}</div>
                      <div className="ranking-amount">{ranking.amount}개 판매</div>
                      {ranking.rank === 1 ? <div className="ranking-best">🎉베스트 상품</div> : null}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="calculate-title">이용자 순위</div>
                <div className="user-ranking__container">
                  {userRanking.map((ranking, index) => (
                    <div key={index}>
                      <div className="ranking-grade">{ranking.rank}위</div>
                      <div className="ranking-name">{ranking.name}</div>
                      <div className="ranking-amount">{ranking.amount}회 이용</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="user__container">
        <div className="current-user">{currentUser.name}</div>
        <button onClick={appearChanger} disabled={step === "setting"}>
          사용자 변경
        </button>
        {appear ? (
          <div className="user-changer__container">
            {users.map((user) => (
              <div className="user-option" key={user.id} onClick={() => userChange(user)}>
                {user.name}
              </div>
            ))}
          </div>
        ) : null}
      </div>
      {Render()}
    </div>
  );
};

export default VendingMachine;
