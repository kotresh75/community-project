import React, { useState } from 'react';
import { CheckSquare, BookmarkPlus, Plus, ShieldCheck, Check, Sparkles } from 'lucide-react';

const PRACTICES = [
  { key: 'solar_rooftop_audit', title: 'Rooftop Solar Feasibility Assessment', cat: 'Solar', desc: 'Inspect shadow-free roof area, tilt angle, and sanctioned connected load with local BESCOM utility.' },
  { key: 'led_lighting_retrofit', title: '100% LED Household Lighting Shift', cat: 'Conservation', desc: 'Replace incandescent, halogen, and CFL bulbs with 9W/12W high-efficiency LEDs.' },
  { key: 'bldc_fan_transition', title: 'Energy-Efficient 28W BLDC Fans Transition', cat: 'Conservation', desc: 'Replace old 75W induction ceiling fans with 28W brushless DC motor smart ceiling fans.' },
  { key: 'solar_water_heater', title: 'Solar Thermal Water Heating Setup', cat: 'Solar', desc: 'Install rooftop evacuated tube collector (ETC) solar water heaters to offset morning electric geysers.' },
  { key: 'community_biogas_segregation', title: 'Household Wet-Waste Segregation for Biogas', cat: 'Biogas', desc: '100% daily source-segregation of organic kitchen food waste to feed community anaerobic digesters.' },
  { key: 'peak_load_staggering', title: 'Off-Peak Heavy Appliance Scheduling', cat: 'Conservation', desc: 'Run heavy loads (washing machines, water pumps) during off-peak midday solar peak hours.' }
];

export default function PracticesView({ user, completedPractices, onTogglePractice, pledges, onAddPledge, onOpenAuth, t }) {
  const [newTitle, setNewTitle] = useState('');
  const [category, setCategory] = useState('solar');
  const [loading, setLoading] = useState(false);

  const handleSubmitPledge = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setLoading(true);
    await onAddPledge(newTitle.trim(), category);
    setNewTitle('');
    setLoading(false);
  };

  const completedCount = Object.values(completedPractices).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / PRACTICES.length) * 100);

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Title & Auth Banner */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#ECFDF5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <CheckSquare size={20} color="#059669" />
          </div>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            {t('nav_practices')}
          </h2>
        </div>
        <p style={{ fontSize: '0.95rem', color: '#64748B', margin: 0 }}>
          Commit to concrete clean energy practices and track your household's transition readiness.
        </p>
      </div>

      {!user && (
        <div style={{
          backgroundColor: '#FFFBEB',
          border: '1px solid #FDE68A',
          padding: '16px 20px',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '28px'
        }}>
          <div>
            <div style={{ fontWeight: 700, color: '#92400E', fontSize: '0.95rem' }}>
              Sign in to save your checklist progress
            </div>
            <div style={{ fontSize: '0.85rem', color: '#B45309', marginTop: '2px' }}>
              Your progress will be saved to your profile and reflected in community live metrics.
            </div>
          </div>
          <button
            onClick={() => onOpenAuth('login')}
            className="btn-green hover-lift"
            style={{ padding: '8px 18px', fontSize: '0.88rem' }}
          >
            Sign In Now
          </button>
        </div>
      )}

      {/* Progress Bar Card */}
      {user && (
        <div className="card-elevated" style={{ padding: '20px 24px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>
              Household Clean Energy Readiness
            </span>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#059669' }}>
              {completedCount} of {PRACTICES.length} Completed ({progressPercent}%)
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              backgroundColor: '#059669',
              transition: 'width 0.4s ease'
            }} />
          </div>
        </div>
      )}

      {/* Checklist Grid */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
          Actionable Clean Energy Checklist
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {PRACTICES.map(p => {
            const isDone = !!completedPractices[p.key];
            return (
              <div
                key={p.key}
                onClick={() => onTogglePractice(p.key)}
                className="hover-lift"
                style={{
                  backgroundColor: isDone ? '#F0FDF4' : '#FFFFFF',
                  border: isDone ? '1px solid #86EFAC' : '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  border: isDone ? '2px solid #059669' : '2px solid #CBD5E1',
                  backgroundColor: isDone ? '#059669' : '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginTop: '2px',
                  flexShrink: 0,
                  transition: 'all 0.2s'
                }}>
                  {isDone && <Check size={16} color="#FFFFFF" strokeWidth={3} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      fontWeight: 700,
                      fontSize: '1rem',
                      color: isDone ? '#166534' : '#0F172A'
                    }}>
                      {p.title}
                    </span>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: isDone ? '#DCFCE7' : '#F1F5F9',
                      color: isDone ? '#15803D' : '#475569',
                      padding: '2px 8px',
                      borderRadius: '12px'
                    }}>
                      {p.cat}
                    </span>
                  </div>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.88rem', color: isDone ? '#15803D' : '#64748B', lineHeight: 1.5 }}>
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Adoption Pledges Tracker */}
      <div className="card-elevated" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <BookmarkPlus size={22} color="#0B2545" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Clean Energy Adoption Pledges
          </h3>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#64748B', margin: '0 0 20px 0' }}>
          Make a verified public commitment to future renewable energy milestones.
        </p>

        {user ? (
          <div>
            <form onSubmit={handleSubmitPledge} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <input
                type="text"
                required
                placeholder="e.g. Schedule solar roof inspection before next month..."
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                style={{
                  flex: 1,
                  minWidth: '240px',
                  padding: '10px 14px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  fontSize: '0.92rem',
                  outline: 'none'
                }}
              />
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{
                  padding: '10px 14px',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  fontSize: '0.92rem',
                  backgroundColor: '#FFFFFF',
                  outline: 'none'
                }}
              >
                <option value="solar">Solar Energy</option>
                <option value="biogas">Biogas & Waste</option>
                <option value="conservation">Conservation</option>
                <option value="other">Other</option>
              </select>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary hover-lift"
                style={{ padding: '10px 20px' }}
              >
                <Plus size={18} />
                <span>Commit Pledge</span>
              </button>
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {pledges.length === 0 ? (
                <div style={{
                  padding: '24px',
                  textAlign: 'center',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '8px',
                  color: '#94A3B8',
                  fontSize: '0.9rem'
                }}>
                  You have not committed any adoption pledges yet. Add your first clean energy pledge above!
                </div>
              ) : (
                pledges.map(pl => (
                  <div
                    key={pl.id}
                    style={{
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '14px 18px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.95rem' }}>
                        {pl.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px', textTransform: 'capitalize' }}>
                        Category: {pl.category}
                      </div>
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: pl.status === 'adopted' ? '#DCFCE7' : '#FEF3C7',
                      color: pl.status === 'adopted' ? '#15803D' : '#B45309',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      textTransform: 'uppercase'
                    }}>
                      {pl.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            backgroundColor: '#F8FAFC',
            borderRadius: '8px',
            color: '#64748B',
            fontSize: '0.92rem'
          }}>
            Please sign in to track and commit pledges.
          </div>
        )}
      </div>
    </div>
  );
}

