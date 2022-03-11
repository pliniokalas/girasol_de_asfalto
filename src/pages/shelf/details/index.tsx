import { IBook } from 'utils/interfaces';
import styles from './details.module.css';

interface IProps {
  cover: IBook;
}

function Details(props: IProps) {
  const { cover } = props;

  return (
    <div className={styles.description}>
      <h3>Details</h3>
      <br />

      {cover.volumeInfo.description   && <p>{cover.volumeInfo.description}</p>}
      <br />

      {cover.volumeInfo.language      && <p>Language: {cover.volumeInfo.language}</p>}
      {cover.volumeInfo.publisher     && <p>Publisher: {cover.volumeInfo.publisher}</p>}
      {cover.volumeInfo.publishedDate && <p>Published in: {cover.volumeInfo.publishedDate}</p>}
      {cover.volumeInfo.pageCount     && <p>Pages: {cover.volumeInfo.pageCount}</p>}
    </div>
  );
}

export default Details;
