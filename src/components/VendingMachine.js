import { useState, useEffect } from "react";
import ProductForm from "./ProductForm";
import Product from "./Product";

const VendingMachine = () => {
  const [step, setStep] = useState("setting");
  const [products, setProducts] = useState([]);

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
          <div>run</div>
          // 각 사용자 별 자판기 사용 기능
        );
      }
      default:
        return null;
    }
  };

  return <div>{Render()}</div>;
};

export default VendingMachine;
