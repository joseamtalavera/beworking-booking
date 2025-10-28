import { Fragment } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import RoomDetailPage from './pages/RoomDetailPage.jsx';
import BookingFlowPage from './pages/BookingFlowPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import BookingFlowModal from './components/booking/BookingFlowModal.jsx'; // new modal wrapper

const App = () => {
  const location = useLocation();
  const state = location.state;

  const backgroundLocation = state?.modal && state.backgroundLocation
    ? {
        pathname: state.backgroundLocation.pathname,
        search: state.backgroundLocation.search ?? '',
        hash: state.backgroundLocation.hash ?? ''
      }
    : undefined;

  return (
    <Fragment>
      <Routes location={backgroundLocation || location}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/rooms/:roomId" element={<RoomDetailPage />} />
          <Route path="/rooms/:roomId/book" element={<BookingFlowPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>

      {state?.modal ? (
        <Routes>
          <Route
            path="/rooms/:roomId/book"
            element={<BookingFlowModal />}
          />
        </Routes>
      ) : null}
    </Fragment>
  );
};

export default App;

  
