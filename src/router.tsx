import { useState, useEffect } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { useSession } from 'utils/useSession';

import Login from 'pages/login';
import Search from 'pages/search';
import Shelf from 'pages/shelf';
import Settings from 'pages/settings';
import BookDetails from 'pages/bookDetails';
import Spinner from 'components/spinner';

/* ----------------------------------------------------------------------------------- */

function Private({ element }: any) {
  const location = useLocation();
  const { user, rehydrate } = useSession();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    rehydrate()
      .catch((error: any) => console.error(error))
      .finally(() => setIsLoading(false));
  }, []); /* eslint-disable-line react-hooks/exhaustive-deps */

  if (isLoading) {
    return <Spinner /> 
  }

  // Not authenticated.
  if (!user?._id) {
    return <Navigate to='/' state={{ from: location }} />;
  }

  return element;
}

/* ----------------------------------------------------------------------------------- */

function AppRoutes() {
  return (
    <Routes>
      <Route path='*'       element={<h1>404</h1>} />
      <Route path='/'       element={<Login />} />

      <Route path='/shelf'  element={
        <Private element={<Shelf />} /> }
      />

      <Route path='/search' element={
        <Private element={<Search />} /> }
      />

      <Route path='/stats'  element={
        <Private element={<h1>stats</h1>} /> }
      />

      <Route path='/settings' element={
        <Private element={<Settings />} /> }
      />

      <Route path='/book/:bookId' element={
        <Private element={<BookDetails />} /> }
      />
    </Routes>
  );
}

/* ----------------------------------------------------------------------------------- */

export default AppRoutes;
