import HomePage from './Pages/HomePage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './Components/Header/Header';
// import Footer from './Components/Footer/Footer';
import AllListingsPage from './Pages/AllListingsPage';
import RegisterPage from './Pages/RegisterPage';
import LoginPage from './Pages/LoginPage';
import { AuthContextProvider } from './store/authContext';
import LogoutPage from './Pages/LogoutPage';
import { Toaster } from 'react-hot-toast';
import AddNewListingPage from './Pages/AddNewListingPage';
import SingleListingPage from './Pages/SingleListingPage';

export default function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <AuthContextProvider>
        <Header />
        <Routes>
          <Route path="/listings/add" element={<AddNewListingPage/>} />
          <Route path="/listings" element={<AllListingsPage />} />
          <Route path="/listings/:id" element={<SingleListingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/logout" element={<LogoutPage />} />
          <Route path="/" element={<HomePage />} />
        </Routes>
        {/* <Footer /> */}
      </AuthContextProvider>
    </BrowserRouter>
  );
}
