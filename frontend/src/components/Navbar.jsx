import React, { useState, useRef, useEffect } from 'react';
import {
  Home,
  Calculator,
  CheckSquare,
  Users,
  Sparkles,
  ChevronDown,
  Landmark,
  Sun,
  MapPin,
  Flame,
  LayoutDashboard,
  Wrench,
  BookOpen,
  ClipboardList,
  Award,
  Recycle,
  Zap
} from 'lucide-react';

export default function Navbar({ currentView, onViewChange, t }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);

  const coreNavItems = [
    {
      id: 'home',
      label: t('nav_home'),
      icon: Home,
      badge: 'SDGs'
    },
    {
      id: 'estimator',
      label: t('nav_estimator'),
      icon: Calculator,
      badge: 'CEA 0.82'
    },
    {
      id: 'practices',
      label: t('nav_practices'),
      icon: CheckSquare,
      badge: 'Action'
    },
    {
      id: 'community',
      label: t('nav_community'),
      icon: Users,
      badge: 'Drives'
    }
  ];

  const upcomingModules = [
    { id: 'schemes', label: 'Government Schemes & Subsidies', icon: Landmark, color: '#D97706', badge: 'LIVE' },
    { id: 'solar-audit', label: 'Solar Roof Feasibility Audit', icon: Sun, color: '#059669', badge: 'SOON' },
    { id: 'wards', label: 'Ward Clean Energy Map', icon: MapPin, color: '#2563EB', badge: 'SOON' },
    { id: 'biogas-hub', label: 'Biogas & Compost Hub', icon: Flame, color: '#10B981', badge: 'SOON' },
    { id: 'vendors', label: 'Empanelled Vendors & Techs [A]', icon: Wrench, color: '#0284C7', badge: 'SOON' },
    { id: 'articles', label: 'Knowledge Hub & Articles', icon: BookOpen, color: '#4F46E5', badge: 'SOON' },
    { id: 'survey', label: 'Citizen Field Survey [D]', icon: ClipboardList, color: '#0D9488', badge: 'SOON' },
    { id: 'certificate', label: 'Green Citizen Certificate [E]', icon: Award, color: '#EA580C', badge: 'SOON' },
    { id: 'recycling', label: 'Solar & E-Waste Recycling [F]', icon: Recycle, color: '#16A34A', badge: 'SOON' },
    { id: 'grid-health', label: 'Grid Reliability & Outages [G]', icon: Zap, color: '#DC2626', badge: 'SOON' },
    { id: 'dashboard', label: 'Coordinator Dashboard', icon: LayoutDashboard, color: '#7C3AED', badge: 'SOON' }
  ];

  const isComingSoonActive = upcomingModules.some(m => m.id === currentView);

  return (
    <nav style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E2E8F0',
      position: 'sticky',
      top: '90px',
      zIndex: 40,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '12px'
      }}>
        {/* Navigation Tabs (Smooth & scrollbar-free) */}
        <div className="navbar-tabs-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {coreNavItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  onViewChange(item.id);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '12px 14px',
                  border: 'none',
                  background: 'transparent',
                  color: isActive ? '#059669' : '#64748B',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  borderBottom: isActive ? '3px solid #059669' : '3px solid transparent',
                  borderRadius: '6px 6px 0 0',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  whiteSpace: 'nowrap',
                  cursor: 'pointer'
                }}
              >
                <Icon
                  size={17}
                  color={isActive ? '#059669' : '#64748B'}
                  strokeWidth={isActive ? 2.4 : 1.9}
                />
                <span>{item.label}</span>
                <span style={{
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  padding: '2px 5px',
                  borderRadius: '6px',
                  backgroundColor: isActive ? '#DCFCE7' : '#F1F5F9',
                  color: isActive ? '#15803D' : '#94A3B8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em'
                }}>
                  {item.badge}
                </span>
              </button>
            );
          })}

          {/* More Modules Dropdown (Coming Soon) */}
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(prev => !prev);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '12px 14px',
                border: 'none',
                background: dropdownOpen ? '#F8FAFC' : 'transparent',
                color: isComingSoonActive || dropdownOpen ? '#D97706' : '#64748B',
                fontWeight: isComingSoonActive || dropdownOpen ? 700 : 500,
                fontSize: '0.88rem',
                borderBottom: isComingSoonActive ? '3px solid #D97706' : '3px solid transparent',
                borderRadius: '6px 6px 0 0',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <Sparkles size={16} color={isComingSoonActive || dropdownOpen ? '#D97706' : '#64748B'} />
              <span>More Modules</span>
              <span style={{
                fontSize: '0.62rem',
                fontWeight: 700,
                padding: '2px 5px',
                borderRadius: '6px',
                backgroundColor: '#FEF3C7',
                color: '#B45309',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}>
                Soon
              </span>
              <ChevronDown
                size={13}
                color={dropdownOpen ? '#D97706' : '#94A3B8'}
                style={{
                  transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }}
              />
            </button>

            {dropdownOpen && (
              <div style={{
                position: 'absolute',
                left: 0,
                top: 'calc(100% + 6px)',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '12px',
                boxShadow: '0 12px 36px rgba(15, 23, 42, 0.18)',
                padding: '8px',
                width: '320px',
                maxHeight: '440px',
                overflowY: 'auto',
                zIndex: 999
              }}>
                <div style={{
                  padding: '6px 10px 8px 10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid #F1F5F9',
                  marginBottom: '4px'
                }}>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#94A3B8',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}>
                    Planned Stage 5 Modules
                  </span>
                  <span style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    backgroundColor: '#FEF3C7',
                    color: '#B45309',
                    padding: '1px 6px',
                    borderRadius: '10px'
                  }}>
                    11 TOTAL
                  </span>
                </div>

                {upcomingModules.map(m => {
                  const MIcon = m.icon;
                  const isCur = currentView === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewChange(m.id);
                        setDropdownOpen(false);
                      }}
                      className="hover-lift"
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: isCur ? '#F8FAFC' : 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        margin: '2px 0'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                        <div style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '6px',
                          backgroundColor: `${m.color}15`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <MIcon size={15} color={m.color} />
                        </div>
                        <span style={{
                          fontSize: '0.84rem',
                          fontWeight: 600,
                          color: '#1E293B',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {m.label}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '0.6rem',
                        fontWeight: 800,
                        backgroundColor: m.badge === 'LIVE' ? '#DCFCE7' : '#F1F5F9',
                        color: m.badge === 'LIVE' ? '#15803D' : '#64748B',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        flexShrink: 0,
                        marginLeft: '6px'
                      }}>
                        {m.badge || 'SOON'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Quick Civic Metric Tag (Compact & Responsively Hidden on narrow viewports) */}
        <div className="nav-civic-badge" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.78rem',
          color: '#64748B',
          fontWeight: 600,
          padding: '5px 12px',
          backgroundColor: '#F8FAFC',
          borderRadius: '20px',
          border: '1px solid #E2E8F0',
          whiteSpace: 'nowrap',
          flexShrink: 0
        }}>
          <span style={{
            width: '7px',
            height: '7px',
            borderRadius: '50%',
            backgroundColor: '#10B981',
            display: 'inline-block'
          }} />
          <span>Civic Data Stream</span>
        </div>
      </div>
    </nav>
  );
}
