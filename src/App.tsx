import { BrowserRouter } from 'react-router-dom';
import { SessionContextProvider } from 'utils/useSession';
import NavBar from 'components/navbar';
import AppRoutes from './router';

function App() {
  return (
    <SessionContextProvider>
      <BrowserRouter>
        <div className="App">
          <NavBar />
          <AppRoutes />
        </div>
      </BrowserRouter>
    </SessionContextProvider>
  );
}

export default App;
