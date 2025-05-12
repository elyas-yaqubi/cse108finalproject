import { Routes, Route } from 'react-router-dom';
import { Login, SignUp, Spotlight, Camera, Profile, Search } from './pages/index.js';
import PrivateRoute from './components/privateRoute.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      
      <Route path="/spotlight" element={<PrivateRoute><Spotlight /></PrivateRoute>} />
      <Route path="/camera" element={<PrivateRoute><Camera /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/search" element={<PrivateRoute><Search /></PrivateRoute>} />
    </Routes>
  );
}

export default App;
