import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'utils/axios';
import { useSession } from 'utils/useSession';
import { IUser, IList, IBook } from 'utils/interfaces';
import { ReactComponent as XIcon } from 'assets/x.svg';
import { ReactComponent as PlusIcon } from 'assets/plus.svg';
import styles from './manageLists.module.css';

const makeFromTemplate = (): IList => JSON.parse(JSON.stringify({
  _id: 'new',
  title: 'New list',
  books: [],
}));

const getSomeList = (user: IUser, id: string) => (
  user.lists.find((l: IList) => l._id === id)
  || user.lists[0]
  || makeFromTemplate()
);

function ManageLists() {
  const [listQuery, setListQuery] = useSearchParams();
  const { user, rehydrate } = useSession();
  const [list, setList] = useState(getSomeList(user, ''));
  const [hasChanges, setHasChanges] = useState(false);

  function handleChangeName(e: React.ChangeEvent<HTMLInputElement>) {
    setList((prev: IList) => ({ ...prev, title: e.target.value }));
    setHasChanges(true);
  }

  function handleAddList() {
    setListQuery(`list=new`);
    setHasChanges(true);
  }

  async function handleRemoveList(toRemove: IList) {
    let fresh = user;

    if (toRemove._id !== 'new') {
      const lessLists = user.lists.filter((l: IList) => l._id !== toRemove._id);
      await axios.patch(`/api/users/${user._id}`, { lists: lessLists });
      fresh = await rehydrate();
    }

    setListQuery(`list=${getSomeList(fresh, '')._id}`)
  }

  function handleSelectList(l: IList) {
    if (l._id === list._id) return;

    setHasChanges(false);
    setListQuery(`list=${l._id}`);
  }

  // Add/remove books from the list. 
  function handleToggleBook(book: IBook) {
    const newList = list.books.includes(book._id)
      ? list.books.filter((id: string) => id !== book._id)
      : [...list.books, book._id];

    setList((prev: IList) => ({ ...prev, books: newList }));
    setHasChanges(true);
  }

  async function handleSave() {
    if (!hasChanges) return;

    // Remove temporary id.
    if (list._id === 'new') {
      delete (list as any)._id;
    }

    // Set resp.data injects the returned list._id in the state.
    const resp = await axios.post('/api/users/lists', { list });
    await rehydrate();
    setListQuery(`list=${resp.data._id}`);
    setHasChanges(false);
  }

  // Get and set lists with url params.
  useEffect(() => {
    const listId = listQuery.get('list') || '';
    setList(
      listId === 'new'
      ? makeFromTemplate()
      : getSomeList(user, listId)
    );
  }, [user, listQuery]);

  return (
    <main className={styles.page}>
      <menu className={styles.listActions}>
        <button onClick={handleAddList}>
          Add 
          <PlusIcon className={styles.listActionIcon} />
        </button>

        <button
          onClick={() => handleRemoveList(list)}
          className={styles.remBtn}
        >
          Remove
          <XIcon className={styles.listActionIcon} />
        </button>
      </menu>

      <ul className={styles.listSelector}>
        {(list._id === 'new' ? [...user.lists, list] : user.lists).map((l: IList, i: number) => (
          <li key={l._id}>
            <button
              onClick={() => handleSelectList(l)}
              className={list._id === l._id ? styles.activeList : ''}
              style={{ '--i': i.toString() } as React.CSSProperties}
            >
            </button>
          </li> ))
        }
      </ul>

      <header className={styles.listHeader}>
        <label htmlFor='title'>List name</label>

        <input
          type='text'
          name='title'
          value={list.title}
          onChange={handleChangeName}
        />
      </header>

      <ul className={styles.books}>
        {!!user.books.length ? user.books.map((book: IBook) => (
          <li key={book.id}>
            <button
              onClick={() => handleToggleBook(book)}
              className={list.books.includes(book._id) ? styles.selected : ''}
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

      {hasChanges
        && (
          <button
            onClick={handleSave}
            className={styles.saveBtn}
          >
            Save!
          </button> 
        )
      }
    </main>
  );
}

export default ManageLists;
