import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { login } from "../redux/authSlice";

const AuthRequire = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const dispatch = useDispatch();

  if (!isAuthenticated) {
    // when redux store is initialized but data in localstorage is still alive, then get data from
    // localstorage and restructure the redux store auth data.
    let isAuthStorage = sessionStorage.getItem("isAuthenticated");
    if (isAuthStorage === "done") {
      let userStorage = sessionStorage.getItem("user");
      let tokenStorage = sessionStorage.getItem("token");
      let tierStorage = sessionStorage.getItem("tier");
      dispatch(
        login({
          isAuthenticated: true,
          user: JSON.parse(userStorage),
          token: tokenStorage,
          tier: tierStorage,
        })
      );
    } else {
      return <Navigate to="/login" />;
    }
  }

  return children;
};

export default AuthRequire;
