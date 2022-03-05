import { Link } from 'react-router-dom';
import styles from './navbar.module.css';

function NavBar() {
  return (
    <nav className={styles.nav}>
      <Link to='/shelf'>Shelf</Link>
      <Link to='/lists'>Lists</Link>
      <Link to='/stats'>Stats</Link>
      <Link to='/search'>Search</Link>
      <Link to='/settings'>Settings</Link>
    </nav>
  );
}

export default NavBar;
