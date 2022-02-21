import { useState } from 'react';
import SignupForm from './signupForm';
import LoginForm from './loginForm';
import styles from './login.module.css';

/* ----------------------------------------------------------------------------------- */

function Login() {
  const [showLoginForm, setShowLoginForm] = useState(true);

  return (
    <main className={styles.container}>
      <h1>Welcome</h1>

      <menu className={styles.formMenu}>
        <button 
          className={showLoginForm ? styles.active : ''}
          onClick={() => setShowLoginForm(true)}
        >
          Sign in
        </button>
        <button
          className={!showLoginForm ? styles.active : ''}
          onClick={() => setShowLoginForm(false)}
        >
          Sign up
        </button>
      </menu>

      {
        showLoginForm
          ? <LoginForm />
          : <SignupForm />
      }
    </main>
  );
}

/* ----------------------------------------------------------------------------------- */

export default Login;
