import React, { useState } from 'react';
import { Users, Calendar, MapPin, Clock, Plus, Bell, Megaphone, Check } from 'lucide-react';

export default function CommunityView({ user, drives, onJoinDrive, notices, onAddDrive, onAddNotice, t }) {
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [driveForm, setDriveForm] = useState({
    title: '',
    description: '',
    location: '',
    drive_date: '',
    drive_time: ''
  });

  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeForm, setNoticeForm] = useState({
    title: '',
    content: '',
    category: 'announcement'
  });

  const isCoordinator = user && user.role === 'coordinator';

  const handleCreateDrive = async (e) => {
    e.preventDefault();
    await onAddDrive(driveForm);
    setShowDriveModal(false);
    setDriveForm({ title: '', description: '', location: '', drive_date: '', drive_time: '' });
  };

  const handleCreateNotice = async (e) => {
    e.preventDefault();
    await onAddNotice(noticeForm);
    setShowNoticeModal(false);
    setNoticeForm({ title: '', content: '', category: 'announcement' });
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Title */}
      <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              backgroundColor: '#EFF6FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={20} color="#2563EB" />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {t('nav_community')}
            </h2>
          </div>
          <p style={{ fontSize: '0.95rem', color: '#64748B', margin: 0 }}>
            Join local clean energy inspection drives and review official announcements.
          </p>
        </div>

        {isCoordinator && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowDriveModal(true)}
              className="btn-primary hover-lift"
              style={{ padding: '8px 16px', fontSize: '0.88rem' }}
            >
              <Plus size={16} />
              <span>Schedule Drive</span>
            </button>
            <button
              onClick={() => setShowNoticeModal(true)}
              className="btn-green hover-lift"
              style={{ padding: '8px 16px', fontSize: '0.88rem' }}
            >
              <Plus size={16} />
              <span>Post Notice</span>
            </button>
          </div>
        )}
      </div>

      {/* Drives Section */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
          Upcoming Community Awareness Drives
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {drives.length === 0 ? (
            <div className="card-elevated" style={{ padding: '32px', textAlign: 'center', color: '#94A3B8' }}>
              No upcoming community drives scheduled right now.
            </div>
          ) : (
            drives.map(d => (
              <div
                key={d.id}
                className="card-elevated hover-lift"
                style={{
                  padding: '24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px'
                }}
              >
                <div style={{ maxWidth: '620px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0F172A' }}>
                      {d.title}
                    </span>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: '#DCFCE7',
                      color: '#15803D',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      textTransform: 'uppercase'
                    }}>
                      {d.status}
                    </span>
                  </div>

                  <p style={{ margin: '0 0 14px 0', fontSize: '0.92rem', color: '#475569', lineHeight: 1.5 }}>
                    {d.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem', color: '#64748B' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={15} color="#059669" />
                      <span>{d.drive_date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={15} color="#059669" />
                      <span>{d.drive_time}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={15} color="#059669" />
                      <span>{d.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Users size={15} color="#2563EB" />
                      <span style={{ fontWeight: 600, color: '#2563EB' }}>{d.attendee_count} Registered</span>
                    </div>
                  </div>
                </div>

                {user && (
                  <button
                    onClick={() => onJoinDrive(d.id, !d.joined)}
                    className="hover-lift"
                    style={{
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      border: d.joined ? '1px solid #CBD5E1' : 'none',
                      backgroundColor: d.joined ? '#F1F5F9' : '#0B2545',
                      color: d.joined ? '#475569' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {d.joined ? (
                      <>
                        <Check size={16} color="#059669" strokeWidth={3} />
                        <span>Registered (Cancel)</span>
                      </>
                    ) : (
                      <span>Join Drive</span>
                    )}
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Notices Board */}
      <div className="card-elevated" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <Megaphone size={22} color="#059669" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
            Official Community Notices & Alerts
          </h3>
        </div>
        <p style={{ fontSize: '0.9rem', color: '#64748B', margin: '0 0 20px 0' }}>
          Verified government subsidies, utility notifications, and workshop bulletins.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notices.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', backgroundColor: '#F8FAFC', borderRadius: '8px', color: '#94A3B8' }}>
              No official announcements published yet.
            </div>
          ) : (
            notices.map(n => (
              <div
                key={n.id}
                style={{
                  borderLeft: '4px solid #059669',
                  backgroundColor: '#F8FAFC',
                  borderRadius: '0 8px 8px 0',
                  padding: '16px 20px',
                  border: '1px solid #E2E8F0',
                  borderLeftWidth: '4px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '1rem' }}>
                    {n.title}
                  </span>
                  <span style={{ fontSize: '0.72rem', backgroundColor: '#E2E8F0', color: '#475569', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                    {n.category}
                  </span>
                </div>
                <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>
                  {n.content}
                </p>
                <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                  Published by {n.author_name} • {n.created_at}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Schedule Drive Modal */}
      {showDriveModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(11, 37, 69, 0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 100
        }}>
          <div style={{ backgroundColor: '#FFF', borderRadius: '12px', maxWidth: '480px', width: '100%', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#0B2545' }}>Schedule Community Drive</h3>
            <form onSubmit={handleCreateDrive} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text" required placeholder="Drive Title (e.g. Solar Rooftop Inspection Camp)"
                value={driveForm.title} onChange={e => setDriveForm({ ...driveForm, title: e.target.value })}
                style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px' }}
              />
              <textarea
                required placeholder="Description of the event..." rows={3}
                value={driveForm.description} onChange={e => setDriveForm({ ...driveForm, description: e.target.value })}
                style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px' }}
              />
              <input
                type="text" required placeholder="Location / Community Hall"
                value={driveForm.location} onChange={e => setDriveForm({ ...driveForm, location: e.target.value })}
                style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px' }}
              />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <input
                  type="date" required
                  value={driveForm.drive_date} onChange={e => setDriveForm({ ...driveForm, drive_date: e.target.value })}
                  style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px' }}
                />
                <input
                  type="text" required placeholder="Time (e.g. 10:00 AM)"
                  value={driveForm.drive_time} onChange={e => setDriveForm({ ...driveForm, drive_time: e.target.value })}
                  style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ flex: 1, padding: '10px' }}>Schedule</button>
                <button type="button" onClick={() => setShowDriveModal(false)} style={{ padding: '10px 16px', background: '#E2E8F0', border: 'none', borderRadius: '6px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Post Notice Modal */}
      {showNoticeModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(11, 37, 69, 0.65)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', zIndex: 100
        }}>
          <div style={{ backgroundColor: '#FFF', borderRadius: '12px', maxWidth: '480px', width: '100%', padding: '24px' }}>
            <h3 style={{ margin: '0 0 16px 0', color: '#0B2545' }}>Post Official Notice</h3>
            <form onSubmit={handleCreateNotice} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text" required placeholder="Notice Title (e.g. PM Surya Ghar Subsidy Update)"
                value={noticeForm.title} onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })}
                style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px' }}
              />
              <textarea
                required placeholder="Content of the notice..." rows={4}
                value={noticeForm.content} onChange={e => setNoticeForm({ ...noticeForm, content: e.target.value })}
                style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px' }}
              />
              <select
                value={noticeForm.category} onChange={e => setNoticeForm({ ...noticeForm, category: e.target.value })}
                style={{ padding: '8px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', background: '#FFF' }}
              >
                <option value="announcement">General Announcement</option>
                <option value="subsidy_alert">Subsidy Alert</option>
                <option value="maintenance">Maintenance</option>
                <option value="drive_update">Drive Update</option>
              </select>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn-green" style={{ flex: 1, padding: '10px' }}>Publish Notice</button>
                <button type="button" onClick={() => setShowNoticeModal(false)} style={{ padding: '10px 16px', background: '#E2E8F0', border: 'none', borderRadius: '6px' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

