import { useState, useEffect } from "react";
import { userNames, owner, SETTING, ORDER } from "../shared/Constants";

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
    if (order.name === ORDER.WALLET) newUsers[currentUser.id].wallet += order.money;
    if (order.name === ORDER.LOG) {
      const targetUser = newUsers[order.index];
      targetUser.purchaseDetails.push({
        productDetail: order.currentProduct,
        purchaseTime: new Date(),
      });
    }
    if (order.name === ORDER.RESTART) {
      for (let i = 1; i < newUsers.length; i++) {
        newUsers[i].wallet += order.money;
      }
    }
    setUsers(newUsers);
  };

  useEffect(() => {
    userNames.forEach((userName, index) => {
      setUsers((newUsers) => {
        return [
          ...newUsers,
          { id: index + 1, name: userName, wallet: SETTING.MONEY_SET, purchaseDetails: [] },
        ];
      });
    });
  }, []);

  useEffect(() => {
    if (users.length > 1) {
      const usersObj = JSON.stringify(users);
      window.localStorage.setItem(SETTING.USERS_KEY, usersObj);
    }
  }, [users]);

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
