import { useState } from "react";

const usePurchaseDetails = () => {
  const [purchaseDetails, setPurchaseDetails] = useState([]);
  const [counter, setCounter] = useState({ user: [], product: [] });

  const counterInitialization = (users, products) => {
    const newCounter = JSON.parse(JSON.stringify(counter));
    users.forEach((user) => {
      if (user.id !== "owner") newCounter.user[user.id - 1] = [user.name, 0, user.id];
    });
    products.forEach((product) => {
      newCounter.product[product.id] = [product.name, 0, product.id];
    });
    setCounter(newCounter);
  };

  const updateCounter = (currentUser, currentProduct) => {
    const newCounter = JSON.parse(JSON.stringify(counter));
    newCounter.user[currentUser.id - 1][1]++;
    newCounter.product[currentProduct.id][1]++;
    setCounter(newCounter);
  };

  const updatePurchaseDetails = (currentUser, currentProduct) => {
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

  return { purchaseDetails, counter, counterInitialization, updateCounter, updatePurchaseDetails };
};

export default usePurchaseDetails;
