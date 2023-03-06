import { useState, useEffect } from "react";
import { SETTING, ORDER } from "../shared/Constants";

const useProducts = () => {
  const [products, setProducts] = useState([]);

  const productsUpdate = (order) => {
    const newProducts = [...products];
    if (order.name === ORDER.SELL) newProducts[order.index].current -= 1;
    if (order.name === ORDER.INITIALIZATION) {
      newProducts.forEach((newProduct) => {
        if (newProduct.current !== newProduct.amount) newProduct.current = newProduct.amount;
      });
    }
    if (order.name === ORDER.PRICE_INCREASE) {
      order.target.forEach((target) => {
        newProducts[target].price += SETTING.PRICE_INCREASE;
      });
    }
    setProducts(newProducts);
  };

  useEffect(() => {
    if (products.length) {
      const productsString = JSON.stringify(products);
      window.localStorage.setItem(SETTING.PRODUCTS_KEY, productsString);
    }
  }, [products]);

  return { products, setProducts, productsUpdate };
};

export default useProducts;
