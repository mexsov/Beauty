import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { useContext, useEffect } from 'react';
import { AuthContext } from './utils/AuthContext';
import Homepage from './pages/Homepage';
import LoginForm from './components/LoginForm';
import RegistrationPage from './components/RegistrationForm';
import { Procedures } from './components/Procedures';
import CreateProcedure from './components/CreateProcedure';
import ProcedureRegistration from './components/ProcedureRegistration';
import ProcedureDetails from './components/ProcedureDetails';
import AddReviewForm from './components/AddReviewForm';

import MyProceduresPage from './pages/MyProceduresPage';
import ManageProcedures from './pages/ManageProcedures';
import EditProcedure from './components/EditProcedure';

function App() {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    isAuthenticated;
  }, [isAuthenticated, navigate]);


  return (
    <>
      <Navbar />
      <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/procedures" element={<Procedures />} />
      <Route path="/procedures/:id" element={<ProcedureDetails />} />
      {isAuthenticated ? (
          <>
            <Route path="/create" element={isAdmin ? <CreateProcedure /> : <Navigate to="/" />} />
            <Route path="/registrations/admin/procedures" element={isAdmin ? <ManageProcedures /> : <Navigate to="/" />} />
            <Route path="/procedures/:id/edit" element={isAdmin ? <EditProcedure /> : <Navigate to="/" />} />
            <Route path="/procedures/:id/register" element={<ProcedureRegistration />} />
            <Route path="/users/my-procedures/:userId" element={<MyProceduresPage />} />
            <Route path="/procedures/:id/addreview" element={<AddReviewForm />} />
           
          </>
        ) : (
          <>
           <Route path="/login" element={<LoginForm />} />
           <Route path="/registration" element={<RegistrationPage />} />
          </>
        )}

      </Routes>
      <Footer />
    </>
  )
}

export default App
