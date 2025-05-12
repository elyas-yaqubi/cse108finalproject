import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// function PrivateRoute({ children }) {
//   const [authenticated, setAuthenticated] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetch("/check-auth", {
//       credentials: "include",
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         if (!data.authenticated) {
//           navigate("/");
//         } else {
//           setAuthenticated(true);
//         }
//       })
//       .catch(() => navigate("/"));
//   }, []);

//   if (authenticated === null) return null;

//   return children;
// }

export default PrivateRoute;

function PrivateRoute({ children }) {
  const [authenticated, setAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://cse108finalproject-xgct.onrender.com/check-auth", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          setAuthenticated(true);
        } else {
          navigate("/");
        }
      })
      .catch(() => navigate("/"));
  }, [navigate]);

  if (authenticated === null) return <div>Loading...</div>;

  return children;
}