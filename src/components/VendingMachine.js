import { useState, useEffect } from "react";
import useUsers from "../hooks/useUsers";
import Product from "./Product";
import ProductForm from "./ProductForm";

const VendingMachine = () => {
  const [step, setStep] = useState("setting");
  const [products, setProducts] = useState([]);
  const { users, setUsers, currentUser, appear, appearChanger, userChange } = useUsers();

  const saveProducts = () => {
    setStep("running");
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
          <>
            {currentUser.name === "나사장" ? (
              <div className="owner-menus__container">
                <button>정산완료</button>
                <button>정산</button>
              </div>
            ) : (
              <div className="user-wallet">지갑: {currentUser.wallet}원</div>
            )}
          </>
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
