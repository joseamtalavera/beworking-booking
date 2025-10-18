import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout.jsx';
import HomePage from './pages/HomePage.jsx';
import RoomDetailPage from './pages/RoomDetailPage.jsx';
import BookingFlowPage from './pages/BookingFlowPage.jsx';
import LoginPage from './pages/LoginPage.jsx';

const App = () => (
  <Routes>
    <Route element={<AppLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/rooms/:roomId" element={<RoomDetailPage />} />
      <Route path="/rooms/:roomId/book" element={<BookingFlowPage />} />
      <Route path="/login" element={<LoginPage />} />
    </Route>
  </Routes>
);

export default App;
