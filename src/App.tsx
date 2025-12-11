import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { ResetPassword } from './pages/ResetPassword';
import { SyncLiveMusic } from './pages/SyncLiveMusic';
import { Login } from './pages/Login';
import { Subscription } from './pages/Subscription';
import { Account } from './pages/Account';
import { Privacy } from './pages/Privacy';
import { Terms } from './pages/Terms';
import { Insights } from './pages/Insights';
import { Library } from './pages/Library';
import { Search } from './pages/Search';
import { Player } from './pages/Player';
import { SmoothScroll } from './components/SmoothScroll';
import { RemotePlayerBar } from './components/RemotePlayerBar';

function Layout() {
  const location = useLocation();
  const isPlayerPage = location.pathname === '/player';

  return (
    <div className="min-h-screen bg-dark-bg text-white selection:bg-zen-500/30">
      {!isPlayerPage && <SmoothScroll />}
      {!isPlayerPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/sync-live" element={<SyncLiveMusic />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/account" element={<Account />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/library" element={<Library />} />
        <Route path="/search" element={<Search />} />
        <Route path="/player" element={<Player />} />
        <Route path="/auth/action" element={<ResetPassword />} />
      </Routes>
      {!isPlayerPage && <Footer />}
      {!isPlayerPage && <RemotePlayerBar />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  )
}

export default App;
