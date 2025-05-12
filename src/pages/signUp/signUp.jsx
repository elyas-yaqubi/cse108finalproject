import React from 'react';
import styles from './signUp.module.css';
import {createNewUser} from './useSignUp.js';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const navigate = useNavigate();

  const handleSignUp = () => {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    createNewUser(firstName, lastName, username, password);
    navigate('/');
    alert('Account sucessfully created, please login');
  };

  return (
    <div className={styles.signupWrapper}>
      <div className={styles.signupCard}>
        <h1>Sign Up</h1>
        <input id="firstName" type="text" placeholder="First name" className={styles.signupInput} />
        <input id="lastName" type="text" placeholder="Last name" className={styles.signupInput} />
        <input id="username" type="text" placeholder="Username" className={styles.signupInput} />
        <input id="password" type="password" placeholder="Password" className={styles.signupInput} />
        <button className={styles.signupButton} onClick={handleSignUp} >Sign Up</button>
      </div>
    </div>
  );
}

export default SignUp;
