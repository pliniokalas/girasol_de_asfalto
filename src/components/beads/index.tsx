import styles from './beads.module.css';

type Doc = any & { _id: string };

interface IProps {
  items: Doc[];
  active: Doc;
  starter?: Doc;
  select: (item: Doc) => void;
}

function Beads(props: IProps) {
  const { items, starter, select, active } = props;

  return (
    <menu className={styles.beadsMenu}>
      {starter
        && <button
          onClick={() => select(starter)}
          className={starter._id === active._id ? styles.active : ''}
        />
      }

      {items.map((item: Doc, i: number) => (
        <button
          key={item._id}
          onClick={() => select(item)}
          className={item._id === active._id ? styles.active : ''}
          style={{ '--i': i } as React.CSSProperties}
        /> ))
      }
    </menu>
  );
}

export default Beads;
