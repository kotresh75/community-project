import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import ImpactStrip from './components/ImpactStrip';
import AuthModal from './components/AuthModal';
import VoiceAssistantModal from './components/VoiceAssistantModal';
import { Mic, Sparkles } from 'lucide-react';

import HomeView from './pages/HomeView';
import EstimatorView from './pages/EstimatorView';
import PracticesView from './pages/PracticesView';
import CommunityView from './pages/CommunityView';
import SchemesView from './pages/SchemesView';
import ComingSoonView from './pages/ComingSoonView';

import { getTranslation } from './i18n/languages';

export default function App() {
  const [lang, setLang] = useState('en');
  const [currentView, setCurrentView] = useState('home'); // home | estimator | practices | community
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [impactSummary, setImpactSummary] = useState({
    total_members: 0,
    habits_adopted: 0,
    total_pledges: 0,
    upcoming_drives: 0
  });

  // User auth state
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('cream_token') || '');
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Checklists and Pledges state
  const [completedPractices, setCompletedPractices] = useState({});
  const [pledges, setPledges] = useState([]);

  // Drives & Notices state
  const [drives, setDrives] = useState([]);
  const [notices, setNotices] = useState([]);

  const t = (k) => getTranslation(lang, k);

  // Fetch live impact summary
  const fetchSummary = async () => {
    try {
      const res = await fetch('/api/community/impact-summary');
      if (res.ok) {
        const data = await res.json();
        setImpactSummary(data);
      }
    } catch (e) {
      console.error('Failed to load live impact summary', e);
    }
  };

  // Check user session
  useEffect(() => {
    fetchSummary();
    if (token) {
      fetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : null)
        .then(u => {
          if (u) {
            setUser(u);
            if (u.preferred_lang) setLang(u.preferred_lang);
          } else {
            setToken('');
            localStorage.removeItem('cream_token');
          }
        });
    }
  }, [token]);

  // Load user data
  useEffect(() => {
    if (user && token) {
      fetch('/api/practices/checklist', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : { items: [] })
        .then(d => {
          const map = {};
          (d.items || []).forEach(item => { map[item.practice_key] = item.completed; });
          setCompletedPractices(map);
        });

      fetch('/api/practices/pledges', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? r.json() : { pledges: [] })
        .then(d => setPledges(d.pledges || []));
    }
  }, [user, token]);

  // Load drives & notices
  const loadCommunityData = () => {
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    fetch('/api/community/drives', { headers })
      .then(r => r.ok ? r.json() : { drives: [] })
      .then(d => setDrives(d.drives || []));
    fetch('/api/community/notices', { headers })
      .then(r => r.ok ? r.json() : { notices: [] })
      .then(d => setNotices(d.notices || []));
  };

  useEffect(() => {
    loadCommunityData();
  }, [currentView, token]);

  // Toggle habit
  const handleTogglePractice = async (key) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    const current = !!completedPractices[key];
    const next = !current;
    setCompletedPractices({ ...completedPractices, [key]: next });

    await fetch(`/api/practices/checklist/${key}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ completed: next })
    });
    fetchSummary();
  };

  // Add pledge
  const handleAddPledge = async (title, category) => {
    const res = await fetch('/api/practices/pledges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, category })
    });
    if (res.ok) {
      fetch('/api/practices/pledges', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.json())
        .then(d => setPledges(d.pledges || []));
      fetchSummary();
    }
  };

  // Join drive
  const handleJoinDrive = async (driveId, willJoin) => {
    const method = willJoin ? 'POST' : 'DELETE';
    await fetch(`/api/community/drives/${driveId}/join`, {
      method,
      headers: { Authorization: `Bearer ${token}` }
    });
    loadCommunityData();
    fetchSummary();
  };

  // Coordinator: Create drive
  const handleAddDrive = async (formData) => {
    const res = await fetch('/api/community/drives', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      loadCommunityData();
      fetchSummary();
    }
  };

  // Coordinator: Create notice
  const handleAddNotice = async (formData) => {
    const res = await fetch('/api/community/notices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      loadCommunityData();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cream_token');
    setToken('');
    setUser(null);
    setCompletedPractices({});
    setPledges([]);
  };

  const handleAuthSuccess = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    fetchSummary();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      {/* Top Header */}
      <Header
        user={user}
        onLogout={handleLogout}
        onOpenAuth={() => setShowAuthModal(true)}
        lang={lang}
        onLangChange={setLang}
        t={t}
      />

      {/* Main Navigation */}
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        t={t}
      />

      {/* Page Content Body */}
      <main style={{ flex: 1, maxWidth: '1200px', width: '100%', margin: '0 auto', padding: '28px 24px' }}>
        {/* Live Community Impact Strip */}
        <ImpactStrip summary={impactSummary} t={t} />

        {/* View Routing */}
        {currentView === 'home' && (
          <HomeView t={t} onNavigate={setCurrentView} />
        )}

        {currentView === 'estimator' && (
          <EstimatorView t={t} />
        )}

        {currentView === 'practices' && (
          <PracticesView
            user={user}
            completedPractices={completedPractices}
            onTogglePractice={handleTogglePractice}
            pledges={pledges}
            onAddPledge={handleAddPledge}
            onOpenAuth={() => setShowAuthModal(true)}
            t={t}
          />
        )}

        {currentView === 'community' && (
          <CommunityView
            user={user}
            drives={drives}
            onJoinDrive={handleJoinDrive}
            notices={notices}
            onAddDrive={handleAddDrive}
            onAddNotice={handleAddNotice}
            t={t}
          />
        )}

        {currentView === 'schemes' && (
          <SchemesView t={t} lang={lang} />
        )}

        {/* Planned Stage 5 & SEE Modules (Coming Soon) */}
        {[
          'solar-audit',
          'wards',
          'biogas-hub',
          'dashboard',
          'vendors',
          'articles',
          'survey',
          'certificate',
          'recycling',
          'grid-health'
        ].includes(currentView) && (
          <ComingSoonView
            currentView={currentView}
            onNavigate={setCurrentView}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        padding: '24px',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: '#64748B'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ margin: '0 0 6px 0', fontWeight: 600, color: '#334155' }}>
            C.R.E.A.M. — Community Renewable Energy Awareness and Management Portal
          </p>
          <p style={{ margin: 0 }}>
            VTU Course `1BCP308` Societal Project | Supporting UN SDGs 7 (Affordable Clean Energy), 11 (Sustainable Cities), and 15 (Life on Land)
          </p>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Floating Voice Assistant Trigger Pill */}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 40 }}>
        <button
          onClick={() => setShowVoiceModal(true)}
          className="hover-lift"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'linear-gradient(135deg, #059669 0%, #0B2545 100%)',
            color: '#FFFFFF',
            padding: '12px 20px',
            borderRadius: '30px',
            border: '2px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 10px 25px -5px rgba(5, 150, 105, 0.4), 0 8px 10px -6px rgba(11, 37, 69, 0.2)',
            fontWeight: 700,
            fontSize: '0.92rem',
            cursor: 'pointer'
          }}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Mic size={16} color="#FFFFFF" />
          </div>
          <span>Voice Advisor</span>
          <span style={{
            fontSize: '0.68rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: '2px 6px',
            borderRadius: '10px',
            letterSpacing: '0.04em'
          }}>
            AI
          </span>
        </button>
      </div>

      {/* Voice Assistant Modal */}
      <VoiceAssistantModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        lang={lang}
        onNavigate={(newView) => {
          setCurrentView(newView);
        }}
      />
    </div>
  );
}
