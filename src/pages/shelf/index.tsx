import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from 'utils/useSession';
import { IBook, IList } from 'utils/interfaces';
import BalloonBtn from 'components/balloonBtn';
import styles from './shelf.module.css';

function Shelf() {
  const { user } = useSession();
  const navigate = useNavigate();
  const [cover, setCover] = useState(user.books[0] as IBook);
  const defaultList = { _id: 'default', title: 'All your books', books: user.books };
  const [list, setList] = useState(defaultList);

  function selectList(l: IList) {
    const books = user.books.filter((b: IBook) => l.books.includes(b._id));
    setList({ ...l, ...books });
  }

  function bookDetails() {
    navigate(`/book/${cover._id}`)
  }

  return (
    <main className={styles.page}>
      <section className={styles.cover} key={cover.id}>
        <img src={cover?.volumeInfo.imageLinks?.thumbnail} alt='' />

        <menu>
          <BalloonBtn
            side='left'
            onClick={bookDetails}
          />
        </menu>

        <div className={styles.shortDesc}>
          <h3>{cover?.volumeInfo.title}</h3>
          <p>Authors: {cover?.volumeInfo.authors?.join(', ')}</p>
          <p>Pages: {cover?.volumeInfo.pageCount}</p>
        </div>
      </section>

      <section className={styles.shelf}>
        <ul className={styles.listSelector}>
          <li>
            <button
              onClick={() => selectList(defaultList)}
              className={list._id === 'default' ? styles.activeList : ''}
            >
            </button>
          </li>

          {user.lists.map((l: IList) => (
            <li>
              <button
                onClick={() => selectList(l)}
                className={list._id === l._id ? styles.activeList : ''}
              >
              </button>
            </li> ))
          }
        </ul>

        <header className={styles.listHeader}>
          <BalloonBtn
            onClick={() => {}}
            side='right'
          />

          <h1>{list.title}</h1>
        </header>

        <ul className={styles.books}>
          {!!user.books.length && user.books.map((book: IBook) => (
            <li key={book.id}>
              <button
                onClick={() => setCover(book)}
                className={cover.id === book.id ? styles.selected : ''}
                style={{ '--heft': (book.volumeInfo?.pageCount || 10)/10} as React.CSSProperties}
              >
                <div className={styles.spine}>
                  <h1>{book.volumeInfo.title}</h1>
                  <p>{book.volumeInfo.authors?.join(', ')}</p>
                </div>
              </button>
            </li>
          ))
          }
        </ul>
      </section>
    </main>
  );
}

export default Shelf;
