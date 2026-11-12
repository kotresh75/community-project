import React from 'react';
import {
  Sparkles,
  Landmark,
  Sun,
  MapPin,
  Flame,
  LayoutDashboard,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Wrench,
  BookOpen,
  ClipboardList,
  Award,
  Recycle,
  Zap
} from 'lucide-react';

export default function ComingSoonView({ currentView, onNavigate }) {
  const pageConfigs = {
    schemes: {
      title: "Government Schemes & Green Subsidies Directory",
      shortTitle: "Schemes & Subsidies",
      subtitle: "Official central & state financial assistance programs for renewable energy adoption.",
      icon: Landmark,
      color: "#D97706",
      bgLight: "#FEF3C7",
      targetRelease: "Stage 5 / SEE Release",
      sdgTag: "SDG 7 — Clean & Affordable Energy",
      keyFeatures: [
        "PM Surya Ghar Muft Bijli Yojana: Direct step-by-step subsidy application guide (up to ₹78,000 for ≥3kW).",
        "PM-KUSUM Scheme: Solar agriculture pumps and rural solar feeder micro-grids walkthrough.",
        "SATAT & GOBARdhan Schemes: Community bio-CNG and wet-waste processing incentives.",
        "State DISCOM Links: Direct portal integration with BESCOM, MESCOM, and national rooftop registries."
      ]
    },
    'solar-audit': {
      title: "Solar Rooftop Feasibility & Space Audit",
      shortTitle: "Solar Roof Audit",
      subtitle: "Comprehensive engineering audit calculating roof load, tilt angles, and investment payback.",
      icon: Sun,
      color: "#059669",
      bgLight: "#ECFDF5",
      targetRelease: "Stage 5 / SEE Release",
      sdgTag: "SDG 7 & SDG 11 — Sustainable Urban Energy",
      keyFeatures: [
        "Shadow-Free Area Calculator: Compute exact usable square footage (100 sq.ft. per kW standard).",
        "Payback Period Analysis: Calculate capital expenditure breakeven timeline (typically 3.5 to 4.2 years).",
        "Sanctioned Load Sizing: Match rooftop PV capacity to your home utility tariff and sanction limit.",
        "Exportable PDF Feasibility Report: Download an engineering brief ready for vendor quotation."
      ]
    },
    wards: {
      title: "Ward-Wise Community Clean Energy Map",
      shortTitle: "Ward Green Map",
      subtitle: "Interactive geospatial visualization of decentralized renewable adoption across city wards.",
      icon: MapPin,
      color: "#2563EB",
      bgLight: "#EFF6FF",
      targetRelease: "Stage 5 / SEE Release",
      sdgTag: "SDG 11 — Sustainable Cities & Communities",
      keyFeatures: [
        "Interactive Ward Overview: Explore green adoption velocity across local neighborhood wards.",
        "Community Solar Leaderboard: Track total rooftop kW capacity installed per ward.",
        "Landfill Diversion Metrics: Compare daily wet-waste kilograms diverted to community biogas.",
        "Ward Green Badges: Celebrate wards achieving 50kW and 100kW decentralized clean energy milestones."
      ]
    },
    'biogas-hub': {
      title: "Wet Waste & Biogas Neighborhood Hub",
      shortTitle: "Biogas & Composting",
      subtitle: "Decentralized bio-methanation centers, organic compost distribution, and waste diversion.",
      icon: Flame,
      color: "#10B981",
      bgLight: "#D1FAE5",
      targetRelease: "Stage 5 / SEE Release",
      sdgTag: "SDG 15 — Life on Land & Forest Conservation",
      keyFeatures: [
        "Community Biodigester Locator: Map nearest organic waste bio-methanation plants.",
        "Free Enriched Compost Booking: Reserve nutrient-rich bio-slurry compost for domestic gardening.",
        "Kitchen Segregation Guidelines: Visual dos & don'ts for zero-contamination biodigester feed.",
        "Methane Abatement Counters: Real-time tracking of avoided fugitive landfill emissions."
      ]
    },
    vendors: {
      title: "Empanelled Clean Energy Vendors & Technician Directory",
      shortTitle: "Vendors & Techs [A]",
      subtitle: "Verified local rooftop solar installers, solar water heater repair technicians, and biogas contractors.",
      icon: Wrench,
      color: "#0284C7",
      bgLight: "#E0F2FE",
      targetRelease: "Stage 5 / SEE Release",
      sdgTag: "SDG 7 & SDG 8 — Decent Work & Clean Energy",
      keyFeatures: [
        "MNRE Empanelled Vendors: Verified listings of approved vendors eligible for national rooftop solar subsidies.",
        "Local Maintenance Technicians: On-demand booking for solar water heater descaling, inverter battery tests, and panel cleaning.",
        "Benchmark Price Index: Transparent rate card (₹55,000–₹65,000 per kW) protecting citizens from predatory overcharging.",
        "Citizen Rating & Review System: Public community feedback and verification badges for authentic local businesses."
      ]
    },
    articles: {
      title: "Renewable Energy Knowledge Hub & Research Articles",
      shortTitle: "Knowledge Articles",
      subtitle: "Technical guides, policy briefs, case studies, and engineering explainers for sustainable community living.",
      icon: BookOpen,
      color: "#4F46E5",
      bgLight: "#EEF2FF",
      targetRelease: "Stage 5 / SEE Release",
      sdgTag: "SDG 7 & SDG 4 — Quality Education & Clean Energy",
      keyFeatures: [
        "Technical Explainers: Deep-dive guides on Monocrystalline vs. Polycrystalline PV, Net Metering vs. Gross Metering.",
        "Local Field Case Studies: Documentation of successful community biogas installations and rooftop solar adoption in Karnataka.",
        "Seasonal Energy Conservation Guides: Practical monsoon maintenance and peak-summer cooling optimization strategies.",
        "VTU Academic Publications: Student-authored technical reviews and societal impact papers under Course 1BCP308."
      ]
    },
    survey: {
      title: "Community Energy Field Survey & Baseline Analytics",
      shortTitle: "Field Survey [D]",
      subtitle: "Structured empirical survey capturing household energy consumption, baseline awareness, and adoption intent.",
      icon: ClipboardList,
      color: "#0D9488",
      bgLight: "#CCFBF1",
      targetRelease: "Stage 5 / SEE Release",
      sdgTag: "SDG 11 & PO 6 — Empirical Societal Assessment",
      keyFeatures: [
        "5-Minute Household Energy Questionnaire: Log monthly electricity units, cooking fuel, rooftop area, and budget.",
        "Baseline vs. Post-Intervention Analytics: Statistical metrics evaluating awareness growth before and after portal deployment.",
        "Review 2 & SEE Evaluation Table: One-click exportable survey tables and charts ready for the VTU viva presentation.",
        "Ward Demographic Insights: Identify high-energy consumption zones and low-awareness clusters for targeted drives."
      ]
    },
    certificate: {
      title: "Green Citizen Certificate & Verifiable Pledge Registry",
      shortTitle: "Green Certificate [E]",
      subtitle: "Official verifiable digital certificates recognizing household carbon reduction pledges and clean energy adoption.",
      icon: Award,
      color: "#EA580C",
      bgLight: "#FFEDD5",
      targetRelease: "Stage 5 / SEE Release",
      sdgTag: "SDG 13 — Climate Action Recognition",
      keyFeatures: [
        "Instant Printable Certificate: Official academic layout featuring VTU Course 1BCP308 credentials and unique Pledge ID.",
        "Quantified CO₂ Milestone Badges: Bronze (100 kg/yr), Silver (500 kg/yr), and Gold (1000+ kg/yr) recognition tiers.",
        "Verifiable QR Code: Scan code to authenticate active pledge status on the live C.R.E.A.M. portal database.",
        "Social & Community Sharing: Shareable achievement cards for Resident Welfare Association (RWA) noticeboards."
      ]
    },
    recycling: {
      title: "Solar PV, Battery & E-Waste Recycling Lifecycle Hub",
      shortTitle: "E-Waste Recycling [F]",
      subtitle: "Safe end-of-life disposal guidelines for solar panels, lead-acid inverter batteries, and household electronic waste.",
      icon: Recycle,
      color: "#16A34A",
      bgLight: "#DCFCE7",
      targetRelease: "Stage 5 / SEE Release",
      sdgTag: "SDG 15 — Life on Land & Pollution Prevention",
      keyFeatures: [
        "Authorized Collection Center Locator: Mapped drop-off points for spent inverter batteries and damaged solar PV cells.",
        "Battery Buyback Rate Guide: Estimated scrap/exchange value (₹1,500–₹3,000) for recycling lead-acid batteries with licensed recyclers.",
        "Toxicity Risk Education: Detailed awareness on preventing lead, cadmium, and antimony leaching into groundwater and agricultural soil.",
        "Scientific Circular Economy Protocol: Step-by-step breakdown of silver, silicon, and copper recovery from decommissioned solar modules."
      ]
    },
    'grid-health': {
      title: "Ward Grid Reliability & Power Outage Intelligence",
      shortTitle: "Grid Outages [G]",
      subtitle: "Citizen-powered monitoring of power outages, voltage stability, and diesel generator economic displacement.",
      icon: Zap,
      color: "#DC2626",
      bgLight: "#FEE2E2",
      targetRelease: "Stage 5 / SEE Release",
      sdgTag: "SDG 7 & SDG 11 — Resilient Clean Energy Infrastructure",
      keyFeatures: [
        "Real-time Outage Reporting: Crowdsource power cut start time, duration, and ward location for BESCOM grid accountability.",
        "Diesel vs. Solar Storage Cost Calculator: Prove that DG backup costs ₹28–₹35/kWh while solar battery storage amortizes to ₹7/kWh.",
        "Voltage Fluctuation Alert Log: Track low-voltage events that damage household motors and inverter transformers.",
        "Micro-Grid Priority Map: Pinpoint vulnerable localities requiring priority rooftop solar + battery energy storage systems (BESS)."
      ]
    },
    dashboard: {
      title: "Coordinator Administrative Management Suite",
      shortTitle: "Coordinator Portal",
      subtitle: "Back-office management tools for verified volunteers, field coordinators, and ward administrators.",
      icon: LayoutDashboard,
      color: "#7C3AED",
      bgLight: "#F5F3FF",
      targetRelease: "Stage 5 / SEE Release",
      sdgTag: "Administrative Role-Based Access Tier",
      keyFeatures: [
        "Awareness Drive Scheduler: Formulate technical solar clinics and manage resident RSVPs.",
        "Notice Bulletin Publisher: Broadcast verified utility maintenance alerts and subsidy deadlines.",
        "Attendance CSV Export: Generate certified attendance sheets for societal project reviews.",
        "Community Growth Analytics: Real-time trends in habit adoption and citizen participation."
      ]
    }
  };

  const config = pageConfigs[currentView] || pageConfigs.schemes;
  const Icon = config.icon;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto' }}>
      {/* Hero Banner */}
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
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            color: '#FCD34D',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            border: '1px solid rgba(245, 158, 11, 0.35)'
          }}>
            <Clock size={14} />
            <span>DEVELOPMENT MILESTONE — COMING SOON</span>
          </span>

          <span style={{
            fontSize: '0.78rem',
            color: '#94A3B8',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
            padding: '4px 10px',
            borderRadius: '20px'
          }}>
            {config.targetRelease}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            backgroundColor: config.bgLight,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)'
          }}>
            <Icon size={30} color={config.color} strokeWidth={2.4} />
          </div>

          <div>
            <h2 style={{
              fontSize: '2rem',
              fontWeight: 800,
              margin: '0 0 8px 0',
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: '-0.02em'
            }}>
              {config.title}
            </h2>
            <p style={{ fontSize: '1.02rem', color: '#CBD5E1', margin: 0, lineHeight: 1.5, maxWidth: '640px' }}>
              {config.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Planned Feature Blueprint */}
      <div className="card-elevated" style={{ padding: '28px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Engineering Feature Blueprint
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#64748B', margin: '4px 0 0 0' }}>
              Deliverables designed for final semester implementation & integration.
            </p>
          </div>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            backgroundColor: '#F1F5F9',
            color: '#475569',
            padding: '4px 10px',
            borderRadius: '6px'
          }}>
            {config.sdgTag}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '16px' }}>
          {config.keyFeatures.map((feat, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '16px',
                backgroundColor: '#F8FAFC',
                borderRadius: '10px',
                border: '1px solid #E2E8F0'
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#ECFDF5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                <CheckCircle2 size={16} color="#059669" />
              </div>
              <p style={{ margin: 0, fontSize: '0.92rem', color: '#334155', lineHeight: 1.5 }}>
                {feat}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Explore Other Upcoming Pages Strip */}
      <div className="card-elevated" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
            Explore All 11 Planned Portal Modules (Coming Soon):
          </h4>
          <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>
            Click any module to inspect its blueprint
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
          {Object.entries(pageConfigs).map(([key, item]) => {
            const ItemIcon = item.icon;
            const isCurrent = key === currentView;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onNavigate(key)}
                className="hover-lift"
                style={{
                  padding: '12px 14px',
                  borderRadius: '8px',
                  border: isCurrent ? `2px solid ${item.color}` : '1px solid #E2E8F0',
                  backgroundColor: isCurrent ? item.bgLight : '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  backgroundColor: `${item.color}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <ItemIcon size={15} color={item.color} />
                </div>
                <span style={{ fontSize: '0.84rem', fontWeight: isCurrent ? 700 : 600, color: isCurrent ? item.color : '#0F172A' }}>
                  {item.shortTitle}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

