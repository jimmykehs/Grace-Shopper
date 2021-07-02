import React, { useState } from "react";
import { changeAdmin } from "../../api";
import { Redirect } from "react-router-dom";

const UserCard = ({ user, index }) => {
  const [admin, setAdmin] = useState(user.admin);
  const handleChangeAdminStatus = async (id, admin) => {
    try {
      await changeAdmin(id, admin);
      setAdmin(admin);
      return <Redirect to="/users" />;
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="user" key={index}>
      <h2>Name: {user.name}</h2>
      <h3>Username: {user.username}</h3>
      <h3>Email: {user.email}</h3>
      <h3>Admin Status: {admin.toString()}</h3>
      <button
        type="button"
        onClick={() => {
          handleChangeAdminStatus(user.id, !admin);
        }}
      >
        Change Admin Status
      </button>
    </div>
  );
};

export default UserCard;
