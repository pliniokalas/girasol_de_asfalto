import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from 'utils/useSession';
import { IBook, IList } from 'utils/interfaces';
import axios from 'utils/axios';
import BalloonBtn from 'components/balloonBtn';
import descIcon from 'assets/desc.svg';
import hamIcon from 'assets/ham.svg';
import xIcon from 'assets/x.svg';
import styles from './shelf.module.css';

function Shelf() {
  const { user, rehydrate } = useSession();
  const navigate = useNavigate();

  const defaultList = {
    _id: 'default',
    title: 'All your books',
    books: user.books.map((b: IBook) => b._id)
  };

  const [list, setList] = useState(defaultList);
  const [cover, setCover] = useState(user.books[0] as IBook);

  function selectList(l: IList) {
    const books = user.books.filter((b: IBook) => l.books.includes(b._id));
    setList({ ...l, ...books });
  }

  function bookDetails() {
    navigate(`/book/${cover._id}`)
  }

  async function removeBook(bookId: string) {
    if (confirm('Are you sure?')) { /* eslint-disable-line */
      await axios.delete(`/api/users/books/${bookId}`);
      const freshUser = await rehydrate();
      setCover(freshUser.books[0]);
    }
  }

  // Returns a list of IBooks in the current list.
  function getBooksOfList() {
    return user.books.filter((b: IBook) => list.books.includes(b._id))
  }

  return (
    <main className={styles.page}>
      {cover && (
        <section className={styles.cover} key={cover?.id}>
          <img src={cover?.volumeInfo.imageLinks?.thumbnail} alt='' />

          <menu className={styles.bookActions}>
            <BalloonBtn
              side='left'
              onClick={() => removeBook(cover._id)}
              title='Remove from list'
              className={styles.removeBtn}
            >
              <img src={xIcon} alt='' />
            </BalloonBtn>

            <BalloonBtn
              side='left'
              onClick={bookDetails}
              title='Book details'
            >
              <img src={descIcon} alt='' />
            </BalloonBtn>
          </menu>

          <div className={styles.shortDesc}>
            <h3>{cover?.volumeInfo.title}</h3>
            <p>Authors: {cover?.volumeInfo.authors?.join(', ')}</p>
            <p>Pages: {cover?.volumeInfo.pageCount}</p>
          </div>
        </section>
      )}

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
            <li key={l._id}>
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
          >
            <img src={hamIcon} alt='' />
          </BalloonBtn>

          <h1>{list.title}</h1>
        </header>

        <ul className={styles.books}>
          {!!user.books.length ? getBooksOfList().map((book: IBook) => (
            <li key={book.id}>
              <button
                onClick={() => setCover(book)}
                className={cover?.id === book.id ? styles.selected : ''}
                style={{ '--heft': (book.volumeInfo?.pageCount || 10)/10} as React.CSSProperties}
              >
                <div className={styles.spine}>
                  <h1>{book.volumeInfo.title}</h1>
                  <p>{book.volumeInfo.authors?.join(', ')}</p>
                </div>
              </button>
            </li>
          ))

          : <li className={styles.empty}>Add books in the search page so they show up here.</li>
          }
        </ul>
      </section>
    </main>
  );
}

export default Shelf;
