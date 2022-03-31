import { useState } from 'react';
import { IReading } from 'utils/interfaces';
import { dateDiffInDays, dateDiffInWeeks } from 'utils/date';
import { ReactComponent as XIcon } from 'assets/x.svg';
import chevronLeft from 'assets/chevronLeft.svg';
import styles from './readingEntry.module.css';

interface IProps {
  reading: IReading;
  pageCount?: number;
  save: (entry: IReading) => void;
  remove: () => void;
}

function ReadingEntry(props: IProps) {
  const { reading, pageCount, save, remove } = props;

  const [startDate, setStartDate] = useState(new Date(reading.startDate));
  const [endDate, setEndDate] = useState(reading.endDate ? new Date(reading.endDate) : new Date());
  const [pagesRead, setPagesRead] = useState(reading.pagesRead);
  const [hasChanges, setHasChanges] = useState(false);

  const startDateStr = startDate.toLocaleDateString('en-us');
  const endDateStr = reading.endDate ? endDate.toLocaleDateString('en-us') : 'not yet...';

  const daysInterval = dateDiffInDays(startDate, endDate || new Date());
  const weeksInterval = dateDiffInWeeks(startDate, endDate || new Date());
  const pagesPerDay = +(pagesRead / daysInterval).toFixed(2);
  const pagesPerWeek = +(pagesRead / weeksInterval).toFixed(2);
  const daysUntilFinish = pageCount ? ((pageCount - pagesRead) / pagesPerDay).toFixed(2) : 0;
  const progress = Math.floor((pagesRead/(pageCount || 1)) * 100);

  // Used to display the progress in Chrome.
  const chromeStyle = {
    '--min': '0',
    '--max': `${pageCount}`,
    '--val': `${pagesRead}`
  } as React.CSSProperties;

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const field = e.target;

    if (field.name === 'startDate') setStartDate(new Date(field.value));
    if (field.name === 'endDate')   setEndDate(new Date(field.value));
    if (field.name === 'pagesRead') setPagesRead(+field.value);

    setHasChanges(true);
  }

  async function handleSave() {
    save({ startDate, endDate, pagesRead });
    setHasChanges(false);
  }

  return (
    <details>
      <summary>
        <span>{startDateStr}</span>
        <span>{endDateStr}</span>
        <span className={styles.prog}>{progress}%</span>

        <img src={chevronLeft} alt='' />
      </summary>

      <menu>
        <button
          type='button'
          onClick={remove}
          className={styles.removeBtn}
        >
          Remove entry 
          <XIcon />
        </button>

        {hasChanges
          && <button
            onClick={handleSave}
            className={styles.saveBtn}
          >
            Save!
          </button> 
        }
      </menu>

      <label className={styles.dateInput}>
        Started
        <input
          type='date'
          name='startDate'
          value={startDate.toISOString().split('T')[0]}
          onChange={handleChange}
        />
      </label>

      <label className={styles.dateInput}>
        Ended 
        <input
          type='date'
          name='endDate'
          value={endDate?.toISOString().split('T')[0]}
          onChange={handleChange}
        />
      </label>

      <p>Completion: <em>{`${pagesRead}/${pageCount}`}</em> (<span className={styles.prog}>{progress}%</span>)</p>
      <input
        type='range'
        name='pagesRead'
        min={0}
        max={pageCount}
        value={pagesRead}
        onChange={handleChange}
        style={chromeStyle}
      />

      <p>You took <em>{daysInterval}</em> days, or <em>{weeksInterval}</em> weeks.</p>
      <p>Averaging <em>{pagesPerDay}</em> pages per day, <em>{pagesPerWeek}</em> per week.</p>
      {!!daysUntilFinish && <p>At this rate you still have <em>{daysUntilFinish}</em> days to go.</p>}
    </details>
  );
}

export default ReadingEntry;
