import { useState } from 'react';
import axios, { searchBooks } from 'utils/axios';
import { useSession } from 'utils/useSession';
import { IBook } from 'utils/interfaces';
import { ReactComponent as PlusIcon } from 'assets/plus-circle.svg';
import { ReactComponent as CheckIcon } from 'assets/check.svg';
import magIcon from 'assets/mag.svg';
import styles from './search.module.css';

function Search() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([] as any);
  const { user, rehydrate } = useSession();

  function handleChange(e: React.SyntheticEvent) {
    const field = e.target as HTMLInputElement;
    setSearch(field.value);
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const resp = await searchBooks(search);
    setResults(resp.data.items);
  }

  async function handleAddBook(book: any) {
    try {
      await axios.post('/api/users/books', { books: [book] });
      await rehydrate();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className={styles.page}>
      <form
        onSubmit={handleSearch}
        className={`${styles.form} ${!results.length ? styles.searchFull : ''}`}
      >
        <label className={styles.searchLabel}>
          Search
          <div className={styles.searchContainer}>
            <input
              type='text'
              value={search}
              onChange={handleChange}
            />
            <img src={magIcon} alt='' />
          </div>
        </label>
      </form>

      {!!results.length &&
      <ul className={styles.resultsContainer}>
        {results.map((r: IBook) => (
          <li className={styles.resultBook} key={JSON.stringify(r)}>
            <img src={r.volumeInfo.imageLinks?.thumbnail} alt='' />

            <section>
              <header className={styles.header}>
                <h3>{r.volumeInfo.title}</h3>

                {!user?.books?.find((b: IBook) => b.id === r.id) 
                  ? (
                    <button
                      onClick={() => handleAddBook(r)}
                      className={`${styles.headerBtn} ${styles.addBtn}`}
                    >
                      Add book
                      <PlusIcon aria-label='Add book' />
                    </button>
                  ) : (
                    <div className={`${styles.headerBtn} ${styles.owned}`}>
                      On the shelf
                      <CheckIcon aria-label='Already in shelf.' />
                    </div>
                  )}

                <p>By {r.volumeInfo.authors?.join(', ')}</p>
              </header>

              <details className={styles.desc}>
                <p>{r.volumeInfo.description}</p>
                <br /> 
                <p>
                  {`Publisher: ${r.volumeInfo.publisher}\n`
                    + `${r.volumeInfo.pageCount} pages\n`
                    + `Language: ${r.volumeInfo.language}`
                  }
                </p>
              </details>
            </section>
          </li>
        ))}
      </ul>}
    </main>
  );
}

export default Search;
