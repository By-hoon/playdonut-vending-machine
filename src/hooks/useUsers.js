import { useState, useEffect } from "react";
import { userNames, owner } from "../shared/Constants";

const useUsers = () => {
  const [users, setUsers] = useState([owner]);
  const [currentUser, setCurrentUser] = useState(users[0]);
  const [appear, setAppear] = useState(false);

  const appearChanger = () => {
    setAppear(true);
  };
  const userChange = (user) => {
    setCurrentUser(user);
    setAppear(false);
  };

  const userUpdate = (order) => {
    const newUsers = [...users];
    if (order.name === "wallet") newUsers[currentUser.id].wallet += order.money;
    if (order.name === "log") {
      const targetUser = newUsers[order.index];
      targetUser.purchaseDetails.push({
        productDetail: order.currentProduct,
        purchaseTime: new Date(),
      });
    }
    setUsers(newUsers);
  };

  useEffect(() => {
    userNames.forEach((userName, index) => {
      setUsers((newUsers) => {
        return [...newUsers, { id: index + 1, name: userName, wallet: 10000, purchaseDetails: [] }];
      });
    });
  }, []);

  return {
    users,
    setUsers,
    currentUser,
    appear,
    appearChanger,
    userChange,
    userUpdate,
  };
};

export default useUsers;
