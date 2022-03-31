import { useState } from 'react';
import axios from 'utils/axios';
import { IBook, IReading } from 'utils/interfaces';
import BalloonBtn from 'components/balloonBtn';
import { ReactComponent as PlusIcon } from 'assets/plus.svg';
import ReadingEntry from './readingEntry';
import styles from './stats.module.css';

interface IProps {
  cover: IBook;
}

function Stats(props: IProps) {
  const { cover } = props;
  const [history, setHistory] = useState(cover.stats.history || []);

  async function addReading() {
    cover.stats.history.push({ startDate: new Date(), pagesRead: 0 });
    const resp = await axios.patch(`/api/users/books/${cover._id}`, { stats: cover.stats });
    setHistory([...resp.data.stats.history]);
  }

  async function removeReading(index: number) {
    cover.stats.history.splice(index, 1);
    await axios.patch(`/api/users/books/${cover._id}`, { stats: cover.stats });
    setHistory([...cover.stats.history]);
  }

  async function updateReading(data: IReading, index: number) {
    cover.stats.history.splice(index, 1, data);
    await axios.patch(`/api/users/books/${cover._id}`, { stats: cover.stats });
    setHistory([...cover.stats.history]);
  }

  return (
    <>
      <header className={styles.statHeader}>
        <h1>Previous readings</h1>

        <BalloonBtn
          onClick={addReading}
          side='left'
          className={styles.addReading}
        >
          <PlusIcon />
        </BalloonBtn>
      </header>

      <ul className={styles.history}>
        {!!history.length && history.map((entry, i: number) => (
          <li key={(entry as any)._id || JSON.stringify(entry)}>
            <ReadingEntry
              reading={entry}
              pageCount={cover.volumeInfo.pageCount}
              save={(data: IReading) => updateReading(data, i)}
              remove={() => removeReading(i)}
            />
          </li> ))
        }
      </ul>
    </>
  );
}

export default Stats;
