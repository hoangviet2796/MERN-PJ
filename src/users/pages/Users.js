import React, { useEffect, useState } from "react";

import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIElements/Loading/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/Loading/LoadingSpinner";
import { useHttp } from "../../shared/hooks/useHttp";

function Users() {
  const [users, setUsers] = useState([]);
  const { isLoading, error, sendRequest, errorHandler } = useHttp();
  useEffect(() => {
    const getUsers = async () => {
      try {
        const data = await sendRequest(
          process.env.REACT_APP_BACKEND_URL + "/users/"
        );
        setUsers(data.users);
      } catch (err) {}
    };
    getUsers();
  }, [sendRequest]);

  return (
    <>
      <ErrorModal error={error} onClear={errorHandler} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && !!users && <UsersList items={users} />}
    </>
  );
}

export default Users;
