import { useNavigate, useLocation } from 'react-router-dom';
import { useSession } from 'utils/useSession';
import styles from '../form.module.css';

/* ----------------------------------------------------------------------------------- */

function LoginForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useSession();

  async function handleSubmit(e: React.FormEvent) {
    try {
      e.preventDefault();

      const form = e.target as HTMLFormElement;
      const { email, password } = form;
      await login(email.value, password.value);

      navigate((location as any)?.state?.from || '/shelf');
    } catch (error: any) {
      console.error(error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label>
        email
        <input
          type='email'
          name='email'
          required
        />
      </label>

      <label>
        password
        <input
          type='password'
          name='password'
          required
        />
      </label>

      <button
        type='submit'
        className={styles.submit}
      >
        Sign in 
      </button>
    </form>
  );
}

export default LoginForm;
