import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const [authenticated, setAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/check-auth", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          navigate("/");
        } else {
          setAuthenticated(true);
        }
      })
      .catch(() => navigate("/"));
  }, []);

  if (authenticated === null) return null;

  return children;
}

export default PrivateRoute;
