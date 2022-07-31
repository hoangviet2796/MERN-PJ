import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import Button from "../FormElements/Button/Button";
import "./NavLinks.css";

function NavLinks(props) {
  const auth = useContext(AuthContext);

  const userId = auth.userId;
  return (
    <ul className="nav-links">
      <li>
        <NavLink to={"/"} exact>
          All Users
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${userId}/places`}>My Places</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to={"/places/new"}>New Place</NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/users/profile/${userId}`}>Profile</NavLink>
        </li>
      )}
      {!auth.isLoggedIn ? (
        <li>
          <NavLink to={"/auth"}>Authenticate</NavLink>
        </li>
      ) : (
        <li>
          <Button onClick={() => auth.logout()}>Log Out</Button>
        </li>
      )}
    </ul>
  );
}

export default NavLinks;
