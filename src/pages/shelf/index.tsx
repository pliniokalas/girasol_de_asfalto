import { useState } from 'react';
import { useSession } from 'utils/useSession';
import { IBook, IList } from 'utils/interfaces';
import axios from 'utils/axios';
import Beads from 'components/beads';
import Details from './details';
import Stats from './stats';
import List from './list';
import { ReactComponent as XIcon } from 'assets/x.svg';
import bookIcon from 'assets/book.svg';
import pieIcon from 'assets/pie.svg';
import descIcon from 'assets/desc.svg';
import styles from './shelf.module.css';

const TABS = {
  cover: 'cover',
  details: 'details',
  stats: 'stats',
};

function Shelf() {
  const { user, rehydrate } = useSession();

  const defaultList = {
    _id: 'default',
    title: 'All your books',
    books: user.books.map((b: IBook) => b._id)
  };

  const [tab, setTab] = useState('cover');
  const [list, setList] = useState(defaultList);
  const [cover, setCover] = useState(user.books[0] as IBook);

  function selectList(l: IList) {
    const books = user.books.filter((b: IBook) => l.books.includes(b._id));
    setList({ ...l, ...books });
  }

  async function removeBook(bookId: string) {
    if (confirm('Are you sure?')) { /* eslint-disable-line */
      await axios.delete(`/api/users/books/${bookId}`);
      const freshUser = await rehydrate();
      setCover(freshUser.books[0]);
    }
  }

  return (
    <main className={styles.page}>
      {/* Left panel */}
      <section className={styles.leftPanel}>
        <article className={styles.dossier}>
          {cover 
            && <header>
              <h3>{cover.volumeInfo.title}</h3>
              <p>{cover.volumeInfo.authors?.join(', ')}</p>
            </header>
          }

          <menu className={styles.bookActions}>
            <button
              onClick={() => removeBook(cover._id)}
              title='Remove from list'
              className={styles.removeBtn}
            >
              Remove
              <XIcon />
            </button>
          </menu>

          {cover && (tab === TABS.cover)
            && <img src={cover.volumeInfo.imageLinks?.thumbnail} alt='' />
          }

          {cover && (tab === TABS.details)
              && <Details cover={cover} />
          }

          {cover && (tab === TABS.stats)
              && <Stats />
          }
        </article>

        <menu className={styles.tabMenu}>
          <button
            aria-label='Cover'
            className={tab === TABS.cover ? styles.active : ''}
            onClick={() => setTab(TABS.cover)}
          >
            <img src={bookIcon} alt='' />
          </button>
          <button
            aria-label='Details'
            className={tab === TABS.details ? styles.active : ''}
            onClick={() => setTab(TABS.details)}
          >
            <img src={descIcon} alt='' />
          </button>
          <button
            aria-label='Stats'
            className={tab === TABS.stats ? styles.active : ''}
            onClick={() => setTab(TABS.stats)}
          >
            <img src={pieIcon} alt='' />
          </button>
        </menu>
      </section>

      {/* Right panel */}
      <section className={styles.rightPanel}>
        <Beads starter={defaultList} items={user.lists} active={list} select={selectList} />
        <List list={list} allBooks={user.books} selectBook={setCover} />
      </section>
    </main>
  );
}

export default Shelf;
