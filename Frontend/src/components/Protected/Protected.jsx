//some links are available when user in signed in otherwise we will
//navigate to login page
import { Navigate } from "react-router-dom";

function Protected({ isAuth, children }) {
  if (isAuth) { //isAuth true is signed in..
    return children;
  } else {
    return <Navigate to="/login" />;
  }
}

export default Protected;
