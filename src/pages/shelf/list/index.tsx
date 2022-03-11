import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IBook, IList } from 'utils/interfaces';
import BalloonBtn from 'components/balloonBtn';
import { ReactComponent as CogIcon } from 'assets/cog.svg';
import styles from './list.module.css';

interface IProps {
  list: IList;
  allBooks: IBook[];
  selectBook: (book: IBook) => void;
}

// Shelf list.
function List(props: IProps) {
  const { list, allBooks, selectBook } = props;
  const navigate = useNavigate();
  const [active, setActive] = useState(allBooks[0]);

  // Returns a list of IBooks in the current list.
  function getBooksOfList() {
    return allBooks.filter((b: IBook) => list.books.includes(b._id))
  }

  function handleSelect(el: IBook) {
    setActive(el);
    selectBook(el);
  }

  return (
    <>
      <header className={styles.listHeader}>
        <h1>{list.title}</h1>

        <BalloonBtn
          onClick={() => navigate(`/lists?list=${list._id}`)}
          side='left'
          className={styles.listConfig}
        >
          <CogIcon />
        </BalloonBtn>
      </header>

      <ul className={styles.books}>
        {!!allBooks.length ? getBooksOfList().map((book: IBook) => (
          <li key={book.id}>

            <button
              onClick={() => handleSelect(book)}
              className={active.id === book.id ? styles.selected : ''}
              style={{ '--heft': `${(book.volumeInfo?.pageCount || 10)/100}rem`} as React.CSSProperties}
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
    </>
  );
}

export default List;
