import React from "react";
import UserItem from "./UserItem";

import "./UsersList.css";

function UsersList(props) {
  if (props.items.length === 0) {
    return (
      <div className="center">
        <h2>No User Found!</h2>
      </div>
    );
  }
  return (
    <ul className="users-list">
      {props.items.map((user) => (
        <UserItem key={user.id} {...user} />
      ))}
    </ul>
  );
}

export default UsersList;
