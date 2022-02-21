import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'utils/axios';
import { useSession } from 'utils/useSession';
import styles from '../form.module.css';

/* ----------------------------------------------------------------------------------- */

function SignupForm() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useSession();

  async function handleSubmit(e: React.FormEvent) {
    try {
      e.preventDefault();

      const form = e.target as HTMLFormElement;
      const sanitizedName = form.username.value.replace(/[!#$%&*[\])({}|\\/+?=;]/g, '');

      if (form.password.value !== form.passwordCheck.value) {
        form.passwordCheck.setCustomValidity('Password fields do not match.');
        return;
      }

      const formData = { 
        name: sanitizedName,
        email: form.email.value,
        password: form.password.value
      };

      await axios.post('/api/users', formData);
      await login(formData.email, formData.password);

      navigate((location as any)?.state?.from || '/shelf');
    } catch (error: any) {
      console.error(error);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <label>
        name
        <input
          type='text'
          name='username'
          required
        />
      </label>

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

      <label>
        confirm password
        <input
          type='password'
          name='passwordCheck'
          onChange={(e) => e.target.setCustomValidity('')}
          required
        />
      </label>

      <button
        type='submit'
        className={styles.submit}
      >
        Sign up 
      </button>
    </form>
  );
}

export default SignupForm;
