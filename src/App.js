import React, { useContext, useEffect, Suspense } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import LoadingSpinner from "./shared/components/UIElements/Loading/LoadingSpinner";
import { AuthContext } from "./shared/context/auth-context";
import Profile from "./users/pages/Profile";

let logoutTimer;

const Users = React.lazy(() => import("./users/pages/Users"));
const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const UserPlace = React.lazy(() => import("./places/pages/Userplaces"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
const Auth = React.lazy(() => import("./users/pages/Auth"));

function App() {
  const auth = useContext(AuthContext);
  let routes;

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      auth.login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [auth.login]);

  useEffect(() => {
    if (auth.token && auth.tokenExpirationDate) {
      const remainingTime =
        auth.tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(auth.logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [auth.token, auth.logout, auth.tokenExpirationDate]);

  if (auth.token) {
    routes = (
      <Switch>
        <Route path={"/"} exact>
          <Users />
        </Route>
        <Route path={"/users/profile/:uid"} exact>
          <Profile />
        </Route>
        <Route path={"/:userId/places"} exact>
          <UserPlace />
        </Route>
        <Route path={"/places/new"} exact>
          <NewPlace />
        </Route>
        <Route path={"/places/:placeId"} exact>
          <UpdatePlace />
        </Route>
        <Redirect to={"/"} />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route path={"/"} exact>
          <Users />
        </Route>
        <Route path={"/:userId/places"} exact>
          <UserPlace />
        </Route>
        <Route path={"/auth"} exact>
          <Auth />
        </Route>
        <Redirect to={"/auth"} />
      </Switch>
    );
  }

  return (
    <Router>
      <MainNavigation />
      <main>
        <Suspense
          fallback={
            <div className="center">
              <LoadingSpinner />
            </div>
          }
        >
          {routes}
        </Suspense>
      </main>
    </Router>
  );
}

export default App;
