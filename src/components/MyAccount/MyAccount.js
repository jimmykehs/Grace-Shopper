import React, { useEffect, useState } from "react";
import { getUser } from "../../api";
const MyAccount = () => {
  const [user, setUser] = useState({});
  useEffect(() => {
    async function getAccountInfo() {
      const token = localStorage.getItem("token");
      const { data } = await getUser(token);
      setUser(data);
    }
    getAccountInfo();
  }, []);

  return (
    <>
      <h1>Hey {user.name}!</h1>
      <h3>Here is some info we have about you:</h3>
      <p>{user.email}</p>
      <div className="Addresses">
        {user.address &&
          user.address.map((add) => {
            return (
              <p key={add.id}>
                {add.street} {add.street_2}, {add.state}, {add.zip_code}
              </p>
            );
          })}
      </div>
    </>
  );
};

export default MyAccount;
