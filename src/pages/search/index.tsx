import { useState, useEffect } from 'react';
import axios from 'utils/axios';
import { useSession } from 'utils/useSession';
import BalloonBtn from 'components/balloonBtn';
import styles from './search.module.css';

function Search() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([] as any);
  const [cover, setCover] = useState({} as any);
  const { user, rehydrate } = useSession();

  function handleChange(e: React.SyntheticEvent) {
    const field = e.target as HTMLInputElement;
    setSearch(field.value);
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const resp = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${search}`);
    setResults(resp.data.items);
    setCover(resp.data.items[0]);
  }

  async function handleAddBook(book: any) {
    try {
      const resp = await axios.post(`/api/users/${user._id}/books`, { books: [book] });
      console.log(resp);
    } catch (error) {
      console.error(error);
    }
  }

  // Try to login in case the user object was lost.
  useEffect(() => {
    if (!user?._id) {
      rehydrate();
    }
  }, []); /* eslint-disable-line */

  return (
    <main className={styles.page}>
      <form
        onSubmit={handleSearch}
        className={`${styles.form} ${!results.length ? styles.searchFull : ''}`}
      >
        <label className={styles.searchLabel}>
          Search
          <input
            type='text'
            value={search}
            onChange={handleChange}
          />
        </label>
      </form>

      <section className={styles.resultsContainer + (!results.length ? styles.hidden : '')}>
        {cover.volumeInfo 
          && (
            <div className={styles.cover} key={cover.id}>
              <img src={cover?.volumeInfo?.imageLinks?.thumbnail} alt='' />

              <header>
                <h3>{cover?.volumeInfo.title}</h3>

                <BalloonBtn
                  onClick={() => handleAddBook(cover)}
                  className={styles.addBtn}
                  side='left'
                />
              </header>

              <article className={styles.desc}>
                <p>By {cover?.volumeInfo.authors?.join(', ')}</p>
                <p>{cover?.volumeInfo.description}</p>
                <br /> 
                <p>
                  {`Publisher: ${cover?.volumeInfo.publisher}\n`
                    + `${cover?.volumeInfo.pageCount} pages\n`
                    + `Language: ${cover?.volumeInfo.language}`
                  }
                </p>
              </article>
            </div>
          )}

        <ul className={styles.results}>
          {!!results.length && results.map((r: any) => (
            <li key={JSON.stringify(r)}>
              <button
                onClick={() => setCover(r)}
                className={cover.id === r.id ? styles.selected : ''}
              >
                <span>{r.volumeInfo.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Search;
