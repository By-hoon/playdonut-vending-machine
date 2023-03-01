import { useState, useEffect } from "react";
import useUsers from "../hooks/useUsers";
import Product from "./Product";
import ProductForm from "./ProductForm";
import { moneyOptions, MESSAGE } from "../shared/Constants";

const VendingMachine = () => {
  const [step, setStep] = useState("setting");
  const [products, setProducts] = useState([]);
  const [currentMoney, setCurrentMoney] = useState(0);
  const { users, currentUser, appear, appearChanger, userChange, userUpdate } = useUsers();

  const saveProducts = () => {
    setStep("running");
    vendingMachineTimer();
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

  const purchaseProduct = (index) => {
    const currentProduct = products[index];
    if (currentMoney >= currentProduct.price && currentProduct.current > 0) {
      productsUpdate({ name: "sell", index });
      userUpdate({ name: "log", index: currentUser.id, currentProduct });
      setCurrentMoney(currentMoney - currentProduct.price);
    }
  };

  const productsUpdate = (order) => {
    const newProducts = [...products];
    if (order.name === "sell") newProducts[order.index].current -= 1;
    if (order.name === "initialization") {
      newProducts.forEach((newProduct) => {
        if (newProduct.current !== newProduct.amount) newProduct.current = newProduct.amount;
      });
    }
    setProducts(newProducts);
  };

  const injectionMoney = (moneyOption) => {
    userUpdate({ name: "wallet", money: -moneyOption });
    setCurrentMoney(currentMoney + moneyOption);
  };
  const returnMoney = () => {
    userUpdate({ name: "wallet", money: currentMoney });
    setCurrentMoney(0);
  };

  useEffect(() => {
    if (products.length) {
      const productsObj = JSON.stringify(products);
      window.localStorage.setItem("product", productsObj);
    }
  }, [products]);

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
            {currentUser.name === "나사장" ? (
              <div className="owner-menus__container">
                <button>정산완료</button>
                <button>정산</button>
              </div>
            ) : (
              <div>
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
