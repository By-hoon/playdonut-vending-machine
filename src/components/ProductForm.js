import { memo, useState, useCallback } from "react";

const ProductForm = ({ products, setProducts }) => {
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [amount, setAmount] = useState(0);
  const changeName = useCallback((e) => {
    setName(e.target.value);
  }, []);
  const changePrice = useCallback((e) => {
    setPrice(Number(e.target.value));
  }, []);
  const changeAmount = useCallback((e) => {
    setAmount(Number(e.target.value));
  }, []);

  const isValid = () => {
    if (name === "") {
      alert("상품 이름을 입력해 주세요");
      return false;
    }
    return true;
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (isValid()) {
      setProducts([...products, { id, name, price, current: amount, amount }]);
      setId(id + 1);
    }
  };
  return (
    <div className="product-form__container">
      <form onSubmit={onSubmit}>
        <div className="name-input__container">
          <div className="input-title">상품 이름</div>
          <input type="text" placeholder="상품 이름" onChange={changeName} value={name} />
        </div>
        <div className="price-input__container">
          <div className="input-title">상품 가격</div>
          <input type="number" placeholder="상품 가격" min={10} onChange={changePrice} value={price} />
        </div>
        <div className="amount-input__container">
          <div className="input-title">상품 수량</div>
          <input type="number" placeholder="상품 수량" min={1} onChange={changeAmount} value={amount} />
        </div>
        <div className="submit__container">
          <input className="submit-input" type="submit" value="등록하기" />
        </div>
      </form>
    </div>
  );
};

export default memo(ProductForm);
