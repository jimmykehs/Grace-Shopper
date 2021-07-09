import React, { useState } from "react";
import { changeAdmin, removeUser } from "../../api";
import { Redirect } from "react-router-dom";

const UserCard = ({ user, index, grabbedUsers, setGrabbedUsers }) => {
  const [admin, setAdmin] = useState(user.admin);
  const deleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await removeUser(id, token);
      const newUsers = [...grabbedUsers];
      newUsers.splice(index, 1);
      setGrabbedUsers(newUsers);
    } catch (error) {
      console.error(error);
    }
  };
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
        onClick={() => {
          handleChangeAdminStatus(user.id, !admin);
        }}
      >
        Change Admin Status
      </button>
      <button
        className="RemoveUser-Btn"
        onClick={() => {
          deleteUser(user.id);
        }}
      >
        Delete User
      </button>
    </div>
  );
};

export default UserCard;
