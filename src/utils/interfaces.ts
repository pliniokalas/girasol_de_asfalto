interface IGBook {
  id: string;
  volumeInfo: {
    title?: string;
    authors?: string[];
    description?: string;
    pageCount?: number;
    publisher?: string;
    publishedDate?: string;
    language?: string;
    categories?: string[];
    imageLinks?: {
      thumbnail?: string;
      smallThumbnail?: string;
    };
    industryIdentifiers?: {
      identifier?: string,
      type?: string,
    }[];
  }
}

interface IHistory {
  startDate: Date,
  endDate?: Date,
  pagesRead: number,
}

interface IBook extends IGBook {
  _id: string;
  stats: {
    history: IHistory[];
  }
}

interface IList {
  _id: string;
  title: string;
  books: string[]; // List of _ids.
}

interface IUser {
  _id: string;
  name: string;
  avatar: string;
  email: string;
  lists: IList[];
  books: IBook[];
}

export type { IGBook, IBook, IHistory as IReading, IList, IUser };
