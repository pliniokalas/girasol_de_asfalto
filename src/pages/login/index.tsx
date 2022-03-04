import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from 'utils/useSession';
import axios from 'utils/axios';
import SignupForm from './signupForm';
import LoginForm from './loginForm';
import styles from './login.module.css';

/* ----------------------------------------------------------------------------------- */

function Login() {
  const navigate = useNavigate();
  const { login } = useSession();
  const [showLoginForm, setShowLoginForm] = useState(true);

  async function handleDemo() {
    const { data } = await axios.get('/api/users/demo');
    await login(data.email, data.email.split(':')[1].split('@')[0]);
    navigate('/shelf');
  }

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

      <button
        className={styles.demoBtn}
        onClick={handleDemo}
      >
        ...or you could test it out!
      </button>
    </main>
  );
}

/* ----------------------------------------------------------------------------------- */

export default Login;
