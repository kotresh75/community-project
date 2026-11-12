import React from 'react';
import { Users, CheckCircle2, BookmarkCheck, Calendar } from 'lucide-react';

export default function ImpactStrip({ summary, t }) {
  const cards = [
    {
      label: t('stat_members'),
      value: summary.total_members,
      icon: Users,
      gradient: 'linear-gradient(135deg, #0B2545 0%, #134074 100%)',
      accent: '#38BDF8'
    },
    {
      label: t('stat_habits'),
      value: summary.habits_adopted,
      icon: CheckCircle2,
      gradient: 'linear-gradient(135deg, #047857 0%, #059669 100%)',
      accent: '#6EE7B7'
    },
    {
      label: t('stat_pledges'),
      value: summary.total_pledges,
      icon: BookmarkCheck,
      gradient: 'linear-gradient(135deg, #B45309 0%, #D97706 100%)',
      accent: '#FCD34D'
    },
    {
      label: t('stat_drives'),
      value: summary.upcoming_drives,
      icon: Calendar,
      gradient: 'linear-gradient(135deg, #1D4ED8 0%, #2563EB 100%)',
      accent: '#93C5FD'
    }
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '16px',
      marginBottom: '32px'
    }}>
      {cards.map((c, i) => {
        const Icon = c.icon;
        return (
          <div
            key={i}
            className="hover-lift"
            style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              padding: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
            }}
          >
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: c.gradient,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
            }}>
              <Icon size={24} color="#FFFFFF" strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.1 }}>
                {c.value}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500, marginTop: '2px' }}>
                {c.label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

