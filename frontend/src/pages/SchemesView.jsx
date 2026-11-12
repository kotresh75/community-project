import React, { useState } from 'react';
import {
  Landmark,
  Sun,
  IndianRupee,
  CheckCircle2,
  ExternalLink,
  Info,
  Calculator,
  FileText,
  HelpCircle,
  ShieldCheck,
  Zap,
  Flame,
  Tractor,
  Layers,
  ArrowRight,
  Clock,
  Sparkles
} from 'lucide-react';
import { getSchemeText } from '../i18n/schemesI18n';

export default function SchemesView({ t, lang = 'en' }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeFaq, setActiveFaq] = useState(null);

  const st = (key) => getSchemeText(lang, key);

  // Subsidy Calculator State
  const [calcType, setCalcType] = useState('solar_residential');
  const [capacityKw, setCapacityKw] = useState(3);

  // Document checklist state
  const [checkedDocs, setCheckedDocs] = useState({
    bill: true,
    aadhaar: true,
    bank: false,
    roof_proof: false,
    rwa_noc: false
  });

  // Calculate Subsidies based on official MNRE benchmarks
  const calculateSubsidy = () => {
    if (calcType === 'solar_residential') {
      const benchmarkCostPerKw = 60000;
      const totalCost = capacityKw * benchmarkCostPerKw;
      let subsidy = 0;
      if (capacityKw === 1) {
        subsidy = 30000;
      } else if (capacityKw === 2) {
        subsidy = 60000;
      } else {
        // 3 kW or above capped at 78,000 for standard residential
        subsidy = Math.min(78000, 78000);
      }
      const netCost = totalCost - subsidy;
      const monthlyUnits = capacityKw * 120; // Avg 4 units/kW/day * 30 days
      const monthlySavings = monthlyUnits * 7.5; // Average tariff Rs 7.50/unit
      const paybackYears = (netCost / (monthlySavings * 12)).toFixed(1);
      const co2AvoidedKg = Math.round(monthlyUnits * 12 * 0.82);

      return {
        totalCost,
        subsidy,
        netCost,
        monthlyUnits,
        monthlySavings: Math.round(monthlySavings),
        paybackYears,
        co2AvoidedKg,
        schemeName: 'PM Surya Ghar: Muft Bijli Yojana (Central CFA)'
      };
    } else if (calcType === 'solar_pump') {
      // 5 HP pump ~ 3.7 kW
      const hp = capacityKw * 1.5;
      const totalCost = Math.round(capacityKw * 75000);
      const subsidy = Math.round(totalCost * 0.60); // 30% Central + 30% State under PM-KUSUM Component B
      const netCost = totalCost - subsidy;
      const monthlyDieselSaved = Math.round(capacityKw * 85 * 90); // Replacing diesel pump running costs
      const paybackYears = (netCost / (monthlyDieselSaved * 12)).toFixed(1);
      const co2AvoidedKg = Math.round(capacityKw * 1800);

      return {
        totalCost,
        subsidy,
        netCost,
        monthlyUnits: Math.round(capacityKw * 140),
        monthlySavings: monthlyDieselSaved,
        paybackYears: Math.max(1.8, paybackYears),
        co2AvoidedKg,
        schemeName: 'PM-KUSUM Scheme Component B (60% Combined Subsidy)'
      };
    } else {
      // Biogas (GOBARdhan / National Bioenergy)
      const totalCost = capacityKw <= 2 ? 42000 : 75000;
      const subsidy = capacityKw <= 2 ? 14350 : 22000;
      const netCost = totalCost - subsidy;
      const monthlyLpgSavings = 1100; // 1 LPG cylinder cost
      const paybackYears = (netCost / (monthlyLpgSavings * 12)).toFixed(1);
      const co2AvoidedKg = Math.round(capacityKw * 950);

      return {
        totalCost,
        subsidy,
        netCost,
        monthlyUnits: Math.round(capacityKw * 35),
        monthlySavings: monthlyLpgSavings,
        paybackYears,
        co2AvoidedKg,
        schemeName: 'National Bioenergy Programme (Family Biogas Subsidy)'
      };
    }
  };

  const calcResult = calculateSubsidy();

  const schemes = [
    {
      id: 'pmsuryaghar',
      category: 'solar',
      name: 'PM Surya Ghar: Muft Bijli Yojana',
      ministry: 'Ministry of New & Renewable Energy (MNRE), Govt. of India',
      target: '1 Crore Residential Households & RWAs across India',
      subsidyDetails: '₹30,000 for 1 kW | ₹60,000 for 2 kW | ₹78,000 for ≥3 kW systems. RWAs get ₹18,000/kW for common services (up to 500 kW).',
      eligibility: [
        'Resident Indian citizen with a valid residential electricity connection.',
        'Suitable shadow-free rooftop ownership or shared RWA roof access.',
        'ALMM (Approved List of Models and Manufacturers) certified solar panels only.',
        'Bank account linked with Aadhaar for Direct Benefit Transfer (DBT).'
      ],
      portalUrl: 'https://pmsuryaghar.gov.in',
      tag: 'Flagship Central Scheme',
      color: '#059669',
      icon: Sun
    },
    {
      id: 'pmkusum',
      category: 'rural',
      name: 'PM-KUSUM Scheme (Solar Agriculture & Feeder Solarisation)',
      ministry: 'Ministry of New and Renewable Energy & State Agricultural Departments',
      target: 'Farmers, Cooperatives, Panchayats, & Water User Associations',
      subsidyDetails: 'Up to 60% capital subsidy (30% Central Govt + 30% State Govt). Farmers contribute only 10%–40% (bank loan support up to 30%).',
      eligibility: [
        'Individual farmers, groups of farmers, or FPOs owning agricultural land.',
        'Replacing existing diesel irrigation pumps with standalone solar pumps (Comp B).',
        'Solarisation of existing grid-connected agricultural tube-wells (Comp C).',
        'Selling surplus green electricity to local DISCOMs for additional farm revenue.'
      ],
      portalUrl: 'https://pmkusum.mnre.gov.in',
      tag: 'Agricultural & Rural Energy',
      color: '#D97706',
      icon: Tractor
    },
    {
      id: 'gobardhan',
      category: 'biogas',
      name: 'GOBARdhan & SATAT Bio-Energy Scheme',
      ministry: 'Department of Drinking Water and Sanitation & Ministry of Petroleum',
      target: 'Rural Villages, Gram Panchayats, Dairy Farms, & Bio-CNG Entrepreneurs',
      subsidyDetails: 'Up to ₹50 Lakhs per district under Swachh Bharat Mission (Grameen) for community bio-methanation. Family units get ₹9,800 to ₹22,000 capital subsidy.',
      eligibility: [
        'Gram Panchayats, dairy cooperatives, or individual cattle-owning households.',
        'Continuous availability of cattle dung, kitchen food waste, or agro-residue.',
        'Agreement to produce clean cooking gas and distribute bio-slurry as organic fertilizer.',
        'SATAT commercial plants receive guaranteed off-take contracts by IOCL/BPCL/HPCL.'
      ],
      portalUrl: 'https://gobardhan.co.in',
      tag: 'Waste-to-Wealth & Clean Cooking',
      color: '#10B981',
      icon: Flame
    },
    {
      id: 'karnataka_netmetering',
      category: 'state',
      name: 'Karnataka Solar Net Metering & KREDL Rooftop Policy',
      ministry: 'Karnataka Renewable Energy Development Ltd (KREDL) & BESCOM',
      target: 'All domestic, commercial, and institutional consumers in Karnataka',
      subsidyDetails: 'Bi-directional net metering grid exports. Surplus units exported during the day offset peak evening consumption on the monthly BESCOM bill.',
      eligibility: [
        'Active low-tension (LT) or high-tension (HT) connection under BESCOM/MESCOM/HESCOM.',
        'Grid-tie inverter meeting IEEE 1547 and CEA safety standards with anti-islanding.',
        'Solar rooftop capacity up to 100% of sanctioned load (or as per KERC regulations).',
        'Building bye-law compliance for mandatory solar water heating systems.'
      ],
      portalUrl: 'https://kredlinfo.in',
      tag: 'Karnataka State Policy',
      color: '#2563EB',
      icon: Zap
    }
  ];

  const filteredSchemes = selectedCategory === 'all'
    ? schemes
    : schemes.filter(s => s.category === selectedCategory);

  const faqs = [
    {
      q: 'Is the PM Surya Ghar subsidy credited to the vendor or directly to the citizen?',
      a: 'The central subsidy is disbursed directly into the consumer\'s bank account through Direct Benefit Transfer (DBT) within 30 days of net-meter commissioning. The consumer only pays the net amount to the empanelled vendor or claims the reimbursement directly.'
    },
    {
      q: 'Do apartment flat owners qualify for solar subsidies?',
      a: 'Yes! Resident Welfare Associations (RWAs) and Group Housing Societies (GHS) are eligible for ₹18,000 per kW central subsidy up to 500 kW capacity for powering common area utilities (lifts, water treatment, streetlights, and basement lighting).'
    },
    {
      q: 'What is the ALMM mandate, and why is it mandatory for subsidy?',
      a: 'ALMM stands for Approved List of Models and Manufacturers published by MNRE. To protect citizens from substandard imports, only domestic solar modules meeting strict Bureau of Indian Standards (BIS) and MNRE quality benchmarks qualify for central financial assistance.'
    },
    {
      q: 'How long do subsidized solar panels last, and what warranty is provided?',
      a: 'Empanelled vendors must provide a mandatory 5-year comprehensive system maintenance warranty. The solar photovoltaic modules themselves carry a 25-year performance warranty (guaranteeing at least 80% rated efficiency at year 25).'
    }
  ];

  const toggleDoc = (key) => {
    setCheckedDocs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const docCount = Object.values(checkedDocs).filter(Boolean).length;
  const docPercent = Math.round((docCount / 5) * 100);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0B2545 0%, #134074 100%)',
        color: '#FFFFFF',
        borderRadius: '16px',
        padding: '36px 32px',
        marginBottom: '28px',
        boxShadow: '0 15px 30px -10px rgba(11, 37, 69, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(5, 150, 105, 0.25)',
            color: '#34D399',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            border: '1px solid rgba(5, 150, 105, 0.4)'
          }}>
            <Landmark size={14} />
            <span>{st('badge')}</span>
          </span>

          <span style={{
            fontSize: '0.78rem',
            color: '#CBD5E1',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            padding: '4px 10px',
            borderRadius: '20px'
          }}>
            {st('badge_sub')}
          </span>
        </div>

        <h1 style={{
          fontSize: '2.1rem',
          fontWeight: 800,
          margin: '0 0 10px 0',
          fontFamily: "'Space Grotesk', sans-serif",
          letterSpacing: '-0.02em'
        }}>
          {st('title')}
        </h1>
        <p style={{
          fontSize: '1.05rem',
          color: '#CBD5E1',
          margin: 0,
          lineHeight: 1.55,
          maxWidth: '720px'
        }}>
          {st('subtitle')}
        </p>
      </div>

      {/* Interactive Subsidy Calculator */}
      <div className="card-elevated" style={{ padding: '28px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: '#DCFCE7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#059669'
          }}>
            <Calculator size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {st('calc_heading')}
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#64748B', margin: 0 }}>
              {st('calc_sub')}
            </p>
          </div>
        </div>

        {/* Inputs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              {st('scheme_type')}
            </label>
            <select
              value={calcType}
              onChange={(e) => setCalcType(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '0.94rem',
                backgroundColor: '#F8FAFC',
                fontWeight: 600,
                color: '#1E293B'
              }}
            >
              <option value="solar_residential">{st('opt_solar')}</option>
              <option value="solar_pump">{st('opt_pump')}</option>
              <option value="biogas">{st('opt_biogas')}</option>
            </select>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{ fontSize: '0.86rem', fontWeight: 700, color: '#334155' }}>
                {st('capacity_label')}
              </label>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#059669' }}>
                {capacityKw} {calcType === 'biogas' ? 'm³ Gas / Day' : 'kW Peak'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max={calcType === 'biogas' ? '5' : '10'}
              step="1"
              value={capacityKw}
              onChange={(e) => setCapacityKw(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#059669', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94A3B8', marginTop: '4px' }}>
              <span>1 {calcType === 'biogas' ? 'm³' : 'kW'}</span>
              <span>3 kW</span>
              <span>{calcType === 'biogas' ? '5 m³' : '10 kW'}</span>
            </div>
          </div>
        </div>

        {/* Calculation Output Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '14px',
          padding: '20px',
          backgroundColor: '#F8FAFC',
          borderRadius: '12px',
          border: '1px solid #E2E8F0'
        }}>
          <div>
            <div style={{ fontSize: '0.76rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>
              {st('benchmark_cost')}
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1E293B', marginTop: '4px' }}>
              ₹{calcResult.totalCost.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>
              Standard empanelled rate
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.76rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase' }}>
              {st('govt_subsidy')}
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
              - ₹{calcResult.subsidy.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 600, marginTop: '2px' }}>
              {st('dbt_label')}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.76rem', color: '#2563EB', fontWeight: 700, textTransform: 'uppercase' }}>
              {st('net_cost')}
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563EB', marginTop: '4px' }}>
              ₹{calcResult.netCost.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
              {st('after_sub')}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.76rem', color: '#D97706', fontWeight: 700, textTransform: 'uppercase' }}>
              {st('payback')}
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#D97706', marginTop: '4px' }}>
              {calcResult.paybackYears} Years
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px' }}>
              {st('free_years')}
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '16px',
          padding: '10px 14px',
          backgroundColor: '#ECFDF5',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.86rem',
          color: '#065F46',
          flexWrap: 'wrap',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="#059669" />
            <span>{st('monthly_saved')}: <strong>~₹{calcResult.monthlySavings.toLocaleString('en-IN')}/month</strong> ({calcResult.monthlyUnits} units)</span>
          </div>
          <span style={{ fontWeight: 600 }}>{st('co2_label')}: {calcResult.co2AvoidedKg} kg/year</span>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[
          { id: 'all', label: st('cat_all') },
          { id: 'solar', label: st('cat_solar') },
          { id: 'rural', label: st('cat_rural') },
          { id: 'biogas', label: st('cat_biogas') },
          { id: 'state', label: st('cat_state') }
        ].map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: selectedCategory === cat.id ? '2px solid #059669' : '1px solid #CBD5E1',
              backgroundColor: selectedCategory === cat.id ? '#ECFDF5' : '#FFFFFF',
              color: selectedCategory === cat.id ? '#059669' : '#475569',
              fontWeight: selectedCategory === cat.id ? 700 : 500,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Schemes Catalog Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '36px' }}>
        {filteredSchemes.map(scheme => {
          const SIcon = scheme.icon;
          return (
            <div
              key={scheme.id}
              className="card-elevated"
              style={{
                padding: '28px',
                borderLeft: `5px solid ${scheme.color}`,
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: `${scheme.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: scheme.color
                  }}>
                    <SIcon size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                      {scheme.name}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#64748B', margin: '2px 0 0 0' }}>
                      {scheme.ministry}
                    </p>
                  </div>
                </div>

                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backgroundColor: `${scheme.color}15`,
                  color: scheme.color,
                  padding: '4px 10px',
                  borderRadius: '20px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}>
                  {scheme.tag}
                </span>
              </div>

              {/* Subsidy Highlight Strip */}
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '8px',
                padding: '12px 16px',
                border: '1px solid #E2E8F0',
                marginBottom: '16px'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', marginBottom: '2px' }}>
                  {st('subsidy_structure')}
                </div>
                <div style={{ fontSize: '0.96rem', fontWeight: 700, color: '#059669' }}>
                  {scheme.subsidyDetails}
                </div>
              </div>

              {/* Eligibility Criteria */}
              <div style={{ marginBottom: '18px' }}>
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  {st('eligibility_title')}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '8px' }}>
                  {scheme.eligibility.map((el, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.86rem', color: '#475569' }}>
                      <CheckCircle2 size={16} color="#059669" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <span>{el}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                <a
                  href={scheme.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    backgroundColor: '#0B2545',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    textDecoration: 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <span>{st('apply_btn')}</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step-by-Step 5-Stage Roadmap */}
      <div className="card-elevated" style={{ padding: '28px', marginBottom: '28px' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
          {st('workflow_heading')}
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#64748B', marginBottom: '22px' }}>
          {st('workflow_sub')}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
          {[
            { step: '1', title: st('step1_title'), desc: st('step1_desc') },
            { step: '2', title: st('step2_title'), desc: st('step2_desc') },
            { step: '3', title: st('step3_title'), desc: st('step3_desc') },
            { step: '4', title: st('step4_title'), desc: st('step4_desc') },
            { step: '5', title: st('step5_title'), desc: st('step5_desc') }
          ].map((stItem, i) => (
            <div key={i} style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#059669',
                color: '#FFFFFF',
                fontWeight: 800,
                fontSize: '0.86rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px'
              }}>
                {stItem.step}
              </div>
              <h4 style={{ fontSize: '0.94rem', fontWeight: 700, color: '#1E293B', marginBottom: '4px' }}>
                {stItem.title}
              </h4>
              <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0, lineHeight: 1.45 }}>
                {stItem.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Document Readiness Tracker */}
      <div className="card-elevated" style={{ padding: '28px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              {st('doc_heading')}
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748B', margin: '2px 0 0 0' }}>
              {st('doc_sub')}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: docPercent === 100 ? '#059669' : '#2563EB' }}>
              {docPercent}% {st('doc_ready')}
            </span>
            <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{docCount} of 5 verified</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden', marginBottom: '18px' }}>
          <div style={{
            height: '100%',
            width: `${docPercent}%`,
            backgroundColor: docPercent === 100 ? '#059669' : '#2563EB',
            transition: 'width 0.3s ease'
          }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
          {[
            { key: 'bill', label: st('doc_bill') },
            { key: 'aadhaar', label: st('doc_aadhaar') },
            { key: 'bank', label: st('doc_bank') },
            { key: 'roof_proof', label: st('doc_roof') },
            { key: 'rwa_noc', label: st('doc_rwa') }
          ].map(doc => (
            <label
              key={doc.key}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: checkedDocs[doc.key] ? '#ECFDF5' : '#F8FAFC',
                border: checkedDocs[doc.key] ? '1px solid #A7F3D0' : '1px solid #E2E8F0',
                cursor: 'pointer',
                fontSize: '0.88rem',
                color: checkedDocs[doc.key] ? '#065F46' : '#475569',
                fontWeight: checkedDocs[doc.key] ? 600 : 500
              }}
            >
              <input
                type="checkbox"
                checked={checkedDocs[doc.key]}
                onChange={() => toggleDoc(doc.key)}
                style={{ width: '16px', height: '16px', accentColor: '#059669' }}
              />
              <span>{doc.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="card-elevated" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '16px' }}>
          {st('faq_heading')}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {faqs.map((faq, i) => {
            const isOpen = activeFaq === i;
            return (
              <div
                key={i}
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : i)}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    backgroundColor: isOpen ? '#F8FAFC' : '#FFFFFF',
                    border: 'none',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontWeight: 700,
                    fontSize: '0.92rem',
                    color: isOpen ? '#059669' : '#1E293B'
                  }}
                >
                  <span>{faq.q}</span>
                  <span style={{ fontSize: '1.1rem', color: '#94A3B8' }}>{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <div style={{ padding: '14px 18px', backgroundColor: '#FFFFFF', borderTop: '1px solid #F1F5F9', fontSize: '0.88rem', color: '#475569', lineHeight: 1.55 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

