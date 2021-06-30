import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { changeAdmin, getUsers } from "../api";

const Users = () => {
  const [grabbedUsers, setGrabbedUsers] = useState();

  const getAllUser = async () => {
    try {
      const users = await getUsers();
      setGrabbedUsers(users);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllUser();
  }, []);

  const handleChangeAdminStatus = async (id, admin) => {
    try {
      await changeAdmin(id, admin);
      return <Redirect to="/users" />;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Here are all the User:</h1>
      <div className="userCards">
        {grabbedUsers?.map((user, index) => {
          console.log(user.admin);
          return (
            <div className="user" key={index}>
              <h2>Name:{user.name}</h2>
              <h3>Username:{user.username}</h3>
              <h3>Email:{user.email}</h3>
              <h3>Admin Status:{user.admin.toString()}</h3>
              <button
                type="button"
                onClick={() => {
                  handleChangeAdminStatus(user.id, user.admin);
                }}
              >
                Change Admin Status
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Users;
