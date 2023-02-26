import { useState } from "react";
import ProductForm from "./ProductForm";

const VendingMachine = () => {
  const [step, setStep] = useState("setting");
  const [products, setProducts] = useState([]);

  const saveProducts = () => {
    const productsObj = JSON.stringify(products);
    window.localStorage.setItem("product", productsObj);
    setStep("running");
  };
  const Render = () => {
    switch (step) {
      case "setting": {
        return (
          <div className="product-set__container">
            <div className="title">상품 목록 설정</div>
            <ProductForm products={products} setProducts={setProducts} />
            {products.map((product) => (
              <div className="products-preview__container" key={product.id}>
                <div>{product.name}</div>
                <div>{product.price}원</div>
                <div>{product.current}개</div>
              </div>
            ))}
            <button className="product-set__button" onClick={saveProducts}>
              설정 완료
            </button>
          </div>
        );
      }
      case "running": {
        return (
          <div>run</div>
          // 각 사용자 별 자판기 사용 기능
        );
      }
    }
  };
  return <div>{Render()}</div>;
};

export default VendingMachine;
