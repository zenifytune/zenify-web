import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ResetPassword } from './pages/ResetPassword';
import { SyncLiveMusic } from './pages/SyncLiveMusic';
import { Login } from './pages/Login';
import { Subscription } from './pages/Subscription';
import { Account } from './pages/Account'; // NEW IMPORT
import { SmoothScroll } from './components/SmoothScroll';

function App() {
  return (
    <Router>
      <SmoothScroll />
      <div className="min-h-screen bg-dark-bg text-white selection:bg-zen-500/30">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/sync-live" element={<SyncLiveMusic />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/account" element={<Account />} /> {/* NEW ROUTE */}
          {/* Default handler for firebase auth action redirect if configured to /action or similar */}
          <Route path="/auth/action" element={<ResetPassword />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App;
