import { useNavigate } from 'react-router-dom';
import { useSession } from 'utils/useSession'
import styles from './settings.module.css';

function Settings() {
  const navigate = useNavigate();
  const { user, logout } = useSession();

  function handleLogout() {
    logout();
    navigate('/');
  }

  return (
    <main className={styles.page}>
      <img src={user.avatar} alt='' />
      <h1>{user.name}</h1>
      <p>{user.email}</p>

      <button
        onClick={handleLogout}
        className={styles.logoutBtn}
      >
        Sign out
      </button>
    </main>
  );
}

export default Settings;
