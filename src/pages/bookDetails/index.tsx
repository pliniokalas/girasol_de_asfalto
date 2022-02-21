import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSession } from 'utils/useSession';
import { IBook } from 'utils/interfaces';
import styles from './bookDetails.module.css';

function BookDetails() {
  const { bookId }= useParams();
  const { user } = useSession();
  const [book, setBook] = useState({} as IBook);

  function getProgress(read: number | undefined, total: number | undefined) {
    const result = !read ? 0 : !total ? 100 : ((read/total) * 100).toFixed(0);
    return `${read}/${total} (${result}%)`
  }

  // Find a book for the giver bookId in the url params.
  useEffect(() => {
    const aaa = user.books.find((b: IBook) => b._id === bookId);
    setBook(aaa);
  }, [bookId, user.books]);

  if (!book?.volumeInfo) {
    return <h1>Loading...</h1>;
  }

  return (
    <main className={styles.page}>
      <img src={book.volumeInfo.imageLinks?.thumbnail} alt='' />

      <section className={styles.rightPannel}>
        <header>
          <h1>{book.volumeInfo.title}</h1>
          <p>{book.volumeInfo.authors?.join(', ')}</p>
        </header>

        <div>
          <p>Pages read: {getProgress(book.stats.progress, book.volumeInfo.pageCount)}</p>
        </div>
      </section>
    </main>
  );
}

export default BookDetails;
