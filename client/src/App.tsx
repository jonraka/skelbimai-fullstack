import HomePage from './Pages/HomePage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './Components/Header/Header';
// import Footer from './Components/Footer/Footer';
import AllAdsPage from './Pages/AllAdsPage';
import RegisterPage from './Pages/RegisterPage';

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/ads" element={<AllAdsPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<HomePage />} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  );
}
