import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import ServiceBoard from './pages/ServiceBoard';
import TicketDetail from './pages/TicketDetail';
import Companies from './pages/Companies';
import CompanyDetail from './pages/CompanyDetail';
import Contacts from './pages/Contacts';
import ContactDetail from './pages/ContactDetail';
import Configurations from './pages/Configurations';
import DeviceDetail from './pages/DeviceDetail';
import Activities from './pages/Activities';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<ServiceBoard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tickets" element={<ServiceBoard />} />
            <Route path="/tickets/:id" element={<TicketDetail />} />
            <Route path="/companies" element={<Companies />} />
            <Route path="/companies/:id" element={<CompanyDetail />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/contacts/:id" element={<ContactDetail />} />
            <Route path="/configurations" element={<Configurations />} />
            <Route path="/configurations/:id" element={<DeviceDetail />} />
            <Route path="/activities" element={<Activities />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
