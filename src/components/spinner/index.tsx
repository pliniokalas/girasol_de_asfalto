import styles from './spinner.module.css';

function Spinner() {
  return (
    <div className={styles.container}>
      <div className={styles.spine} style={{ '--ith': '1' } as React.CSSProperties}></div>
      <div className={styles.spine} style={{ '--ith': '2' } as React.CSSProperties}></div>
      <div className={styles.spine} style={{ '--ith': '3' } as React.CSSProperties}></div>
      <p>Loading...</p>
    </div>
  );
}

export default Spinner;
