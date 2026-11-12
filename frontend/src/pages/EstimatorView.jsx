import React, { useState } from 'react';
import {
  Calculator,
  Zap,
  IndianRupee,
  CloudRain,
  Info,
  CheckCircle2,
  HelpCircle,
  TrendingDown,
  Leaf,
  Lightbulb,
  Building2,
  TreeDeciduous,
  ArrowRight
} from 'lucide-react';

export default function EstimatorView({ t }) {
  const [inputs, setInputs] = useState({
    old_watts: 60,
    new_watts: 9,
    quantity: 5,
    hours_per_day: 6,
    days_per_month: 30,
    tariff_per_kwh: 7.0
  });

  const [result, setResult] = useState({
    monthly_kwh_saved: 45.9,
    monthly_cost_saved: 321.3,
    annual_kwh_saved: 550.8,
    annual_cost_saved: 3855.6,
    annual_co2_avoided_kg: 451.66
  });

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('explanation'); // explanation | preset | formula

  // Preset scenarios to help users understand immediately
  const presets = [
    {
      name: '5x Incandescent (60W) → LED (9W)',
      desc: 'Typical living room & bedroom lighting retrofit',
      old_w: 60,
      new_w: 9,
      qty: 5,
      hours: 6
    },
    {
      name: '3x Regular Fan (75W) → 28W BLDC',
      desc: 'Ceiling fans running throughout day & night',
      old_w: 75,
      new_w: 28,
      qty: 3,
      hours: 12
    },
    {
      name: 'Electric Geyser (2000W) → Solar Water Heater',
      desc: 'Offsetting peak morning water heating with rooftop solar',
      old_w: 2000,
      new_w: 0,
      qty: 1,
      hours: 1.5
    }
  ];

  const handleApplyPreset = (p) => {
    setInputs(prev => ({
      ...prev,
      old_watts: p.old_w,
      new_watts: p.new_w,
      quantity: p.qty,
      hours_per_day: p.hours
    }));
  };

  const handleCalculate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/tools/estimate-practice-impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Human equivalents for real-world context
  const treeEquivalents = (result.annual_co2_avoided_kg / 21.7).toFixed(1); // 1 mature tree absorbs ~21.7kg CO2/yr
  const coalAvoidedKg = (result.annual_kwh_saved * 0.45).toFixed(1); // ~0.45kg coal per kWh in Indian grid

  return (
    <div style={{ maxWidth: '1040px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.25)'
          }}>
            <Calculator size={22} color="#FFFFFF" strokeWidth={2.4} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', margin: 0, letterSpacing: '-0.02em' }}>
              {t('calc_title')}
            </h2>
            <p style={{ fontSize: '0.92rem', color: '#64748B', margin: '2px 0 0 0' }}>
              {t('calc_subtitle')}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Presets Strip */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <Lightbulb size={18} color="#D97706" />
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Quick Common Household Scenarios (Click to Load)
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '10px' }}>
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="hover-lift"
              style={{
                textAlign: 'left',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                backgroundColor: '#F8FAFC',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0B2545' }}>{p.name}</span>
              <span style={{ fontSize: '0.75rem', color: '#64748B' }}>{p.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Input Form + Result Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '32px' }}>
        {/* Form Container */}
        <div className="card-elevated" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0B2545', margin: 0 }}>
              Input Appliance Parameters
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#64748B', backgroundColor: '#F1F5F9', padding: '3px 8px', borderRadius: '6px', fontWeight: 600 }}>
              Stateless (Zero DB write)
            </span>
          </div>

          <form onSubmit={handleCalculate} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  {t('calc_old_watts')}
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={inputs.old_watts}
                  onChange={e => setInputs({ ...inputs, old_watts: parseFloat(e.target.value) || 0 })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    fontWeight: 600
                  }}
                />
                <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>e.g. 60W bulb, 75W fan</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  {t('calc_new_watts')}
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={inputs.new_watts}
                  onChange={e => setInputs({ ...inputs, new_watts: parseFloat(e.target.value) || 0 })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    fontWeight: 600
                  }}
                />
                <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>e.g. 9W LED, 28W BLDC</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  {t('calc_quantity')}
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={inputs.quantity}
                  onChange={e => setInputs({ ...inputs, quantity: parseInt(e.target.value) || 1 })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    fontWeight: 600
                  }}
                />
                <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Number of units in home</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  {t('calc_hours')}
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="24"
                  required
                  value={inputs.hours_per_day}
                  onChange={e => setInputs({ ...inputs, hours_per_day: parseFloat(e.target.value) || 0 })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    fontWeight: 600
                  }}
                />
                <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Daily active usage</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  {t('calc_days')}
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  required
                  value={inputs.days_per_month}
                  onChange={e => setInputs({ ...inputs, days_per_month: parseInt(e.target.value) || 30 })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    fontWeight: 600
                  }}
                />
                <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Active days / month (1-31)</span>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#475569', marginBottom: '6px' }}>
                  {t('calc_tariff')}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  required
                  value={inputs.tariff_per_kwh}
                  onChange={e => setInputs({ ...inputs, tariff_per_kwh: parseFloat(e.target.value) || 7.0 })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    fontSize: '0.95rem',
                    outline: 'none',
                    fontWeight: 600
                  }}
                />
                <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>e.g. BESCOM slab ₹7.00/unit</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary hover-lift"
              style={{ width: '100%', padding: '13px', marginTop: '6px' }}
            >
              <Zap size={18} />
              <span>{loading ? 'Re-calculating...' : t('calc_calculate')}</span>
            </button>
          </form>
        </div>

        {/* Results Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            color: '#FFFFFF',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 12px 28px -6px rgba(5, 150, 105, 0.35)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <CheckCircle2 size={20} color="#A7F3D0" />
              <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#D1FAE5' }}>
                VERIFIED SAVINGS FORECAST
              </span>
            </div>

            <div style={{ marginBottom: '22px' }}>
              <div style={{ fontSize: '0.88rem', color: '#D1FAE5', marginBottom: '4px' }}>
                Annual Financial Savings
              </div>
              <div style={{ fontSize: '2.8rem', fontWeight: 800, letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>₹</span>
                <span>{result.annual_cost_saved.toLocaleString()}</span>
              </div>
              <div style={{ fontSize: '0.9rem', color: '#A7F3D0', marginTop: '4px', fontWeight: 500 }}>
                Monthly savings: ₹{result.monthly_cost_saved.toLocaleString()} / month
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <div>
                <div style={{ fontSize: '0.82rem', color: '#D1FAE5', marginBottom: '2px' }}>Energy Saved</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800 }}>
                  {result.annual_kwh_saved} <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>kWh/yr</span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.82rem', color: '#D1FAE5', marginBottom: '2px' }}>CO₂ Emissions Avoided</div>
                <div style={{ fontSize: '1.45rem', fontWeight: 800 }}>
                  {result.annual_co2_avoided_kg} <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>kg/yr</span>
                </div>
              </div>
            </div>
          </div>

          {/* Real-World Environmental Equivalency Card */}
          <div className="card-elevated" style={{ padding: '20px' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1E293B', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px' }}>
              🌳 Real-World Environmental Equivalency
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={{ backgroundColor: '#F0FDF4', padding: '12px', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#166534', fontWeight: 700, fontSize: '0.85rem' }}>
                  <TreeDeciduous size={16} />
                  <span>Tree Equivalent</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803D', marginTop: '4px' }}>
                  ≈ {treeEquivalents} trees
                </div>
                <div style={{ fontSize: '0.72rem', color: '#4ADE80', marginTop: '2px' }}>
                  Carbon absorbed / year
                </div>
              </div>

              <div style={{ backgroundColor: '#F8FAFC', padding: '12px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155', fontWeight: 700, fontSize: '0.85rem' }}>
                  <TrendingDown size={16} />
                  <span>Coal Avoided</span>
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
                  ≈ {coalAvoidedKg} kg
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '2px' }}>
                  Thermal grid fuel saved
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deep-Dive Explanation Tabs (What Does Each Number Mean?) */}
      <div className="card-elevated" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', gap: '10px', borderBottom: '1px solid #E2E8F0', paddingBottom: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => setActiveTab('explanation')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'explanation' ? '#0B2545' : '#F1F5F9',
              color: activeTab === 'explanation' ? '#FFFFFF' : '#475569',
              fontWeight: 700,
              fontSize: '0.88rem'
            }}
          >
            📘 What Does Each Metric Mean?
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('formula')}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'formula' ? '#0B2545' : '#F1F5F9',
              color: activeTab === 'formula' ? '#FFFFFF' : '#475569',
              fontWeight: 700,
              fontSize: '0.88rem'
            }}
          >
            🔬 Standard Engineering Formula & Physics Basis
          </button>
        </div>

        {activeTab === 'explanation' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div style={{ borderLeft: '3px solid #059669', paddingLeft: '14px' }}>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.98rem', marginBottom: '4px' }}>
                1. Monthly Energy Saved (kWh / Units)
              </div>
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                A <strong>kilowatt-hour (kWh)</strong> is the standard billing unit of electrical energy. When you shift from a 60W bulb to a 9W LED, you consume 51 fewer watts every hour. Across 5 bulbs used 6 hours daily for 30 days, you eliminate <strong>45.9 units of electricity</strong> directly from your monthly power meter.
              </p>
            </div>

            <div style={{ borderLeft: '3px solid #2563EB', paddingLeft: '14px' }}>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.98rem', marginBottom: '4px' }}>
                2. Monetary Savings (₹ In Your Pocket)
              </div>
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                Calculated by multiplying the energy saved by your local DISCOM utility tariff (e.g. BESCOM's average domestic slab of <strong>₹7.00 per unit</strong>). Saving 45.9 units each month directly cuts <strong>₹321.30 per month</strong> (amounting to <strong>₹3,855.60/year</strong>) off your family electricity bill without changing your daily habits.
              </p>
            </div>

            <div style={{ borderLeft: '3px solid #D97706', paddingLeft: '14px' }}>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.98rem', marginBottom: '4px' }}>
                3. Avoided CO₂ Emissions (Climate Impact)
              </div>
              <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                In India, over 70% of baseline grid power is generated by coal-fired thermal power plants. The Central Electricity Authority (CEA) establishes that every 1 kWh delivered generates <strong>0.82 kg of CO₂</strong> emissions. By cutting 550.8 kWh annually, your household prevents <strong>451.66 kg of greenhouse gases</strong> from entering the atmosphere.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'formula' && (
          <div>
            <div style={{ backgroundColor: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '16px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0B2545', marginBottom: '8px' }}>
                The Three Mathematical Equations Executed:
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: '0.88rem', color: '#1E293B', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div><code>1. Monthly kWh Saved = [ (W_old - W_new) × Quantity × Hours/Day × Days/Month ] / 1000</code></div>
                <div><code>2. Monthly Cost Saved (₹) = Monthly kWh Saved × Electricity Tariff (₹/kWh)</code></div>
                <div><code>3. Annual CO₂ Avoided (kg) = (Monthly kWh Saved × 12) × 0.82 kg CO₂/kWh</code></div>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
              <strong>Official Reference:</strong> Central Electricity Authority (CEA), Ministry of Power, Government of India — <em>Baseline Carbon Dioxide Emission Database for the Indian Power Sector (Version 19)</em>, establishing the national grid weighted average emission factor of 0.82 tCO₂/MWh (0.82 kg CO₂/kWh).
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
