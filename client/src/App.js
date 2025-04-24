import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PropertyProvider } from './context/PropertyContext';
import 'bootstrap/dist/css/bootstrap.min.css';
// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Alert from './components/layout/Alert';
import PrivateRoute from './components/routing/PrivateRoute';

// Pages
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import SavedProperties from './pages/SavedProperties';
import MyProperties from './pages/MyProperties';
import CreateProperty from './pages/CreateProperty';
import EditProperty from './pages/EditProperty';
import Enquiries from './pages/Enquiries';
import NotFound from './pages/NotFound';

// CSS
import './App.css';

function App() {
  return (
    <AuthProvider>
      <PropertyProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <Alert />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/properties" element={<Properties />} />
                <Route path="/properties/:id" element={<PropertyDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/dashboard"
                  element={<PrivateRoute component={Dashboard} />}
                />
                <Route
                  path="/saved-properties"
                  element={<PrivateRoute component={SavedProperties} />}
                />
                <Route
                  path="/my-properties"
                  element={<PrivateRoute component={MyProperties} />}
                />
                <Route
                  path="/create-property"
                  element={<PrivateRoute component={CreateProperty} />}
                />
                <Route
                  path="/edit-property/:id"
                  element={<PrivateRoute component={EditProperty} />}
                />
                <Route
                  path="/enquiries"
                  element={<PrivateRoute component={Enquiries} />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </PropertyProvider>
    </AuthProvider>
  );
}

export default App;