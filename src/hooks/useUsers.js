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

  useEffect(() => {
    userNames.forEach((userName, index) => {
      setUsers((newUsers) => {
        return [...newUsers, { id: index, name: userName, wallet: 10000, purchaseDetails: [] }];
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
  };
};

export default useUsers;
