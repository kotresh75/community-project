import React from 'react';
import { Sun, Flame, Trees, ArrowRight, Award, ExternalLink, Zap } from 'lucide-react';

export default function HomeView({ t, onNavigate }) {
  const guides = [
    {
      id: 'solar',
      title: t('guide_solar_title'),
      desc: t('guide_solar_desc'),
      sdg: 'SDG 7 — Clean & Affordable Energy',
      icon: Sun,
      iconColor: '#F59E0B',
      iconBg: '#FEF3C7',
      stats: 'Save up to 80% on bills with net-metering subsidies'
    },
    {
      id: 'biogas',
      title: t('guide_biogas_title'),
      desc: t('guide_biogas_desc'),
      sdg: 'SDG 11 — Sustainable Cities & Communities',
      icon: Flame,
      iconColor: '#10B981',
      iconBg: '#D1FAE5',
      stats: '1kg segregated wet-waste yields ~0.04m³ cooking fuel'
    },
    {
      id: 'cooking',
      title: t('guide_cooking_title'),
      desc: t('guide_cooking_desc'),
      sdg: 'SDG 15 — Life on Land & Forest Conservation',
      icon: Trees,
      iconColor: '#059669',
      iconBg: '#ECFDF5',
      stats: 'Displaces fuelwood harvesting & eliminates indoor toxic smoke'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #0B2545 0%, #134074 60%, #059669 100%)',
        color: '#FFFFFF',
        borderRadius: '16px',
        padding: '48px 32px',
        marginBottom: '32px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 25px -5px rgba(11, 37, 69, 0.2)'
      }}>
        {/* Subtle decorative circles */}
        <div style={{
          position: 'absolute',
          right: '-50px',
          top: '-50px',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: '780px', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(16, 185, 129, 0.25)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            color: '#A7F3D0',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '18px'
          }}>
            <Award size={16} />
            <span>VTU Academic Social Impact Initiative</span>
          </div>

          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            lineHeight: 1.15,
            margin: '0 0 16px 0',
            letterSpacing: '-0.03em'
          }}>
            {t('app_title')}
          </h2>

          <p style={{
            fontSize: '1.15rem',
            lineHeight: 1.6,
            color: '#E2E8F0',
            margin: '0 0 28px 0',
            maxWidth: '680px'
          }}>
            {t('tagline')}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
            <button
              onClick={() => onNavigate('estimator')}
              className="btn-green hover-lift"
              style={{ padding: '12px 24px', fontSize: '1rem' }}
            >
              <Zap size={18} />
              <span>Launch Practice Estimator</span>
            </button>

            <button
              onClick={() => onNavigate('practices')}
              className="hover-lift"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Explore Action Checklists</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Guide Cards */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Verified Clean Energy & Practice Guides
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#64748B', margin: '4px 0 0 0' }}>
              Actionable engineering guidance aligned with United Nations Sustainable Development Goals.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
          {guides.map(g => {
            const Icon = g.icon;
            return (
              <div
                key={g.id}
                className="card-elevated hover-lift"
                style={{
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '12px',
                      backgroundColor: g.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={28} color={g.iconColor} strokeWidth={2.2} />
                    </div>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: '#F1F5F9',
                      color: '#475569',
                      padding: '4px 8px',
                      borderRadius: '6px'
                    }}>
                      {g.sdg.split('—')[0].trim()}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0F172A', marginBottom: '10px' }}>
                    {g.title}
                  </h4>

                  <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, marginBottom: '20px' }}>
                    {g.desc}
                  </p>
                </div>

                <div style={{
                  borderTop: '1px solid #F1F5F9',
                  paddingTop: '14px',
                  fontSize: '0.82rem',
                  color: '#059669',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Zap size={14} />
                  <span>{g.stats}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

