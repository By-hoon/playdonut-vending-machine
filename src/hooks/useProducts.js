import { useState, useEffect } from "react";

const useProducts = () => {
  const [products, setProducts] = useState([]);

  const productsUpdate = (order) => {
    const newProducts = [...products];
    if (order.name === "sell") newProducts[order.index].current -= 1;
    if (order.name === "initialization") {
      newProducts.forEach((newProduct) => {
        if (newProduct.current !== newProduct.amount) newProduct.current = newProduct.amount;
      });
    }
    if (order.name === "priceIncrease") {
      order.target.forEach((target) => {
        newProducts[target].price += 100;
      });
    }
    setProducts(newProducts);
  };

  useEffect(() => {
    if (products.length) {
      const productsObj = JSON.stringify(products);
      window.localStorage.setItem("product", productsObj);
    }
  }, [products]);

  return { products, setProducts, productsUpdate };
};

export default useProducts;
