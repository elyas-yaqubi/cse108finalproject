import styles from './login.module.css'
import { Link } from 'react-router-dom';
import {validateLogin} from './useLogin.js';
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    const username = document.querySelector('input[type="text"]').value;
    const password = document.querySelector('input[type="password"]').value;
    // console.log(username + " " + password);

    const isValid = await validateLogin(username, password)
    if (isValid) {
      // console.log('Login successful');
      navigate('/spotlight');
    } else {
      // console.log('Login failed: Invalid credentials');
      alert('Please enter a valid username/password');
    }
  };

  return(
  <div className={styles.loginWrapper}>
    <div className={styles.loginCard}>
      <h1>Insta-Fit</h1>
      <input type="text" placeholder="Username" className={styles.loginInput} />
      <input type="password" placeholder="Password" className={styles.loginInput} />
      <button className={styles.loginButton} onClick={handleLogin}>Login</button>
      <p className={styles.loginFooter}>
        No Account? Create one <Link to="/signup">here</Link>
      </p>
    </div>
  </div>
  );
}

export default Login