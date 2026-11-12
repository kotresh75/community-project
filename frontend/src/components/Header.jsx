import React, { useState } from 'react';
import {
  Sun,
  Shield,
  LogOut,
  Globe,
  UserCheck,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Award
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../i18n/languages';

export default function Header({ user, onLogout, onOpenAuth, lang, onLangChange, t }) {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === lang) || SUPPORTED_LANGUAGES[0];

  return (
    <header style={{
      backgroundColor: '#0B2545',
      color: '#FFFFFF',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 4px 20px -2px rgba(11, 37, 69, 0.25)'
    }}>
      {/* Top Academic Context Strip */}
      <div style={{
        backgroundColor: '#081C33',
        padding: '5px 24px',
        fontSize: '0.75rem',
        color: '#94A3B8',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            backgroundColor: '#059669',
            color: '#FFFFFF',
            padding: '1px 6px',
            borderRadius: '4px',
            fontWeight: 700,
            fontSize: '0.68rem',
            letterSpacing: '0.04em'
          }}>
            VTU CIE REVIEW 2
          </span>
          <span>Topic #40: Community Renewable Energy Awareness & Management Portal</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span>SDGs 7, 11, 15</span>
          <span style={{ color: '#475569' }}>|</span>
          <span style={{ color: '#10B981', fontWeight: 600 }}>Active Database Connected</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Brand Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)',
            flexShrink: 0
          }}>
            <Sun size={26} color="#FFFFFF" strokeWidth={2.4} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                fontSize: '1.4rem',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: '#FFFFFF',
                fontFamily: "'Space Grotesk', sans-serif"
              }}>
                C.R.E.A.M.
              </span>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: '#34D399',
                padding: '2px 8px',
                borderRadius: '6px',
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                CIVIC PORTAL
              </span>
            </div>
            <p style={{
              margin: '2px 0 0 0',
              fontSize: '0.82rem',
              color: '#94A3B8',
              fontWeight: 500,
              maxWidth: '460px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {t('app_title')}
            </p>
          </div>
        </div>

        {/* Right Actions: Language Switcher & User Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Custom Language Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="hover-lift"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                padding: '8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#FFFFFF',
                fontSize: '0.88rem',
                fontWeight: 600
              }}
            >
              <Globe size={16} color="#34D399" />
              <span>{currentLangObj.native} ({currentLangObj.label})</span>
              <ChevronDown size={14} color="#94A3B8" />
            </button>

            {langDropdownOpen && (
              <div style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 6px)',
                backgroundColor: '#0F172A',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '10px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                padding: '6px',
                width: '210px',
                zIndex: 100,
                maxHeight: '340px',
                overflowY: 'auto'
              }}>
                <div style={{
                  padding: '6px 10px',
                  fontSize: '0.72rem',
                  color: '#64748B',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  Select Regional Language (10)
                </div>
                {SUPPORTED_LANGUAGES.map(l => (
                  <button
                    key={l.code}
                    onClick={() => {
                      onLangChange(l.code);
                      setLangDropdownOpen(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: lang === l.code ? '#1E293B' : 'transparent',
                      color: lang === l.code ? '#34D399' : '#E2E8F0',
                      fontSize: '0.88rem',
                      fontWeight: lang === l.code ? 700 : 500,
                      textAlign: 'left'
                    }}
                  >
                    <span>{l.native}</span>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Account / Login */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                padding: '6px 14px',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: user.role === 'coordinator'
                    ? 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)'
                    : 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  color: '#FFFFFF'
                }}>
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#FFFFFF', lineHeight: 1.2 }}>
                    {user.name}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#94A3B8', textTransform: 'capitalize' }}>
                    {user.role} • {user.community_area}
                  </div>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="hover-lift"
                title="Sign Out"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#FCA5A5',
                  fontSize: '0.82rem',
                  fontWeight: 600
                }}
              >
                <LogOut size={16} />
                <span>{t('nav_logout')}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('login')}
              className="btn-green hover-lift"
              style={{ padding: '9px 20px', fontSize: '0.92rem' }}
            >
              <UserCheck size={18} />
              <span>{t('nav_login')}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
