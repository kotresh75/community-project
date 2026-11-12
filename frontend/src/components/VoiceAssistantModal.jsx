import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  HelpCircle,
  Sun,
  Flame,
  Calculator,
  CheckSquare,
  Users,
  MessageSquare
} from 'lucide-react';
import { VOICE_SCRIPTS } from '../i18n/voiceScripts';

export default function VoiceAssistantModal({ isOpen, onClose, lang, onNavigate }) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [supported, setSupported] = useState(true);

  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  const scripts = VOICE_SCRIPTS[lang] || VOICE_SCRIPTS.en;

  // Initialize Speech Synthesis & Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        // Map app language to recognition locale
        const langMap = { en: 'en-IN', kn: 'kn-IN', hi: 'hi-IN', ta: 'ta-IN', te: 'te-IN' };
        recognition.lang = langMap[lang] || 'en-IN';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          const text = event.results[0][0].transcript;
          setTranscript(text);
          processVoiceQuery(text);
        };

        recognition.onerror = (err) => {
          console.warn('Speech recognition error:', err);
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } else {
        setSupported(false);
      }
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [lang]);

  // Read initial greeting when modal opens
  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setResponseMessage(scripts.welcome);
      speakText(scripts.welcome);
    } else {
      if (synthRef.current) synthRef.current.cancel();
      if (recognitionRef.current && isListening) recognitionRef.current.stop();
    }
  }, [isOpen]);

  const getBestVoiceForLanguage = (targetLang, langCode) => {
    if (!synthRef.current || !synthRef.current.getVoices) return null;
    const voices = synthRef.current.getVoices();
    if (!voices || voices.length === 0) return null;

    // 1. Exact match e.g. "kn-IN" or "hi-IN"
    let match = voices.find(v => v.lang.toLowerCase() === targetLang.toLowerCase());
    if (match) return match;

    // 2. Prefix match e.g. "kn", "hi", "ta"
    match = voices.find(v => v.lang.toLowerCase().startsWith(langCode.toLowerCase()));
    if (match) return match;

    // 3. Indian English fallback for Indian context if regional voice not installed in OS
    match = voices.find(v => v.lang === 'en-IN' || v.name.toLowerCase().includes('india'));
    if (match) return match;

    // 4. Default browser voice
    return voices.find(v => v.default) || voices[0];
  };

  const audioPlayerRef = useRef(null);

  const stopSpeaking = () => {
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current.currentTime = 0;
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
  };

  const speakText = (text) => {
    stopSpeaking();

    // Clean up text before speech: strip asterisks, bullets, backticks
    const textToSpeak = text
      .replace(/\*{1,3}/g, '')
      .replace(/•/g, '')
      .replace(/`/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!textToSpeak) return;

    setIsSpeaking(true);

    // 1. Try High-Fidelity Regional Native Audio TTS Stream first
    try {
      const audioUrl = `/api/tools/tts?lang=${encodeURIComponent(lang)}&text=${encodeURIComponent(textToSpeak.slice(0, 220))}`;
      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;

      audio.onended = () => {
        setIsSpeaking(false);
      };

      audio.onerror = () => {
        // Fallback to browser SpeechSynthesis if network audio stream fails
        fallbackSpeechSynthesis(textToSpeak);
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio playback failed, falling back to Web Speech API:', err);
          fallbackSpeechSynthesis(textToSpeak);
        });
      }
    } catch (e) {
      fallbackSpeechSynthesis(textToSpeak);
    }
  };

  const fallbackSpeechSynthesis = (textToSpeak) => {
    if (!synthRef.current) {
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    const langVoiceMap = {
      en: 'en-IN',
      kn: 'kn-IN',
      hi: 'hi-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      ml: 'ml-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
      gu: 'gu-IN',
      ur: 'ur-IN'
    };
    const targetLocale = langVoiceMap[lang] || 'en-IN';
    utterance.lang = targetLocale;
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const chosenVoice = getBestVoiceForLanguage(targetLocale, lang);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utterance);
  };

  const startListening = () => {
    stopSpeaking();
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const processVoiceQuery = async (query) => {
    try {
      // Call backend AI Advisor endpoint
      const res = await fetch('/api/tools/ai-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, lang })
      });
      if (res.ok) {
        const data = await res.json();
        setResponseMessage(data.answer);
        speakText(data.answer);
        if (data.suggested_view && onNavigate) {
          onNavigate(data.suggested_view);
        }
        return;
      }
    } catch (err) {
      console.warn('Backend advisor query failed, using local fallback:', err);
    }

    // Local fallback
    const q = query.toLowerCase();
    let reply = scripts.unrecognized;

    if (q.includes('solar') || q.includes('sun') || q.includes('rooftop') || q.includes('ಸೋಲಾರ್') || q.includes('सौर')) {
      reply = scripts.solar;
      if (onNavigate) onNavigate('home');
    } else if (q.includes('biogas') || q.includes('waste') || q.includes('kitchen') || q.includes('ಬಯೋ') || q.includes('बायोगैस')) {
      reply = scripts.biogas;
      if (onNavigate) onNavigate('home');
    } else if (q.includes('calculator') || q.includes('savings') || q.includes('estimate') || q.includes('ಕ್ಯಾಲ್ಕುಲೇಟರ್') || q.includes('कैलकुलेटर') || q.includes('bill')) {
      reply = scripts.estimator;
      if (onNavigate) onNavigate('estimator');
    } else if (q.includes('checklist') || q.includes('practice') || q.includes('habit') || q.includes('ಪರಿಶೀಲನಾ') || q.includes('चेकलिस्ट')) {
      reply = scripts.practices;
      if (onNavigate) onNavigate('practices');
    } else if (q.includes('drive') || q.includes('camp') || q.includes('workshop') || q.includes('ಅಭಿಯಾನ') || q.includes('अभियान')) {
      reply = scripts.drives;
      if (onNavigate) onNavigate('community');
    }

    setResponseMessage(reply);
    speakText(reply);
  };

  if (!isOpen) return null;

  const topics = [
    { title: 'Rooftop Solar & Subsidies', query: 'Tell me about rooftop solar and PM Surya Ghar', icon: Sun, color: '#F59E0B' },
    { title: 'Community Biogas & Wet Waste', query: 'How does community biogas work?', icon: Flame, color: '#10B981' },
    { title: 'Electricity Bill Savings', query: 'How does the energy calculator calculate savings?', icon: Calculator, color: '#2563EB' },
    { title: 'Household Checklists', query: 'What practices are in the readiness checklist?', icon: CheckSquare, color: '#059669' },
    { title: 'Community Inspection Camps', query: 'Tell me about community awareness drives', icon: Users, color: '#7C3AED' }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(11, 37, 69, 0.7)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      zIndex: 100
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '20px',
        maxWidth: '560px',
        width: '100%',
        boxShadow: '0 25px 60px -15px rgba(11, 37, 69, 0.35)',
        overflow: 'hidden',
        border: '1px solid #E2E8F0'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0B2545 0%, #134074 100%)',
          color: '#FFFFFF',
          padding: '22px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}>
              <Sparkles size={22} color="#FFFFFF" />
            </div>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, fontFamily: "'Space Grotesk', sans-serif" }}>
                Civic Voice Assistant
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                Clean Energy Advisor & Navigation Guide
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Assistant Response Box */}
        <div style={{ padding: '24px' }}>
          <div style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '20px',
            marginBottom: '20px',
            minHeight: '120px',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: isSpeaking ? '#10B981' : '#94A3B8',
                  display: 'inline-block',
                  animation: isSpeaking ? 'pulse 1s infinite' : 'none'
                }} />
                <span>{isSpeaking ? 'Speaking...' : isListening ? 'Listening to your microphone...' : 'Assistant Ready'}</span>
              </div>

              {isSpeaking && (
                <button
                  onClick={stopSpeaking}
                  style={{
                    backgroundColor: '#F1F5F9',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '4px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.75rem',
                    color: '#64748B',
                    cursor: 'pointer'
                  }}
                >
                  <VolumeX size={14} />
                  <span>Mute</span>
                </button>
              )}
            </div>

            <div style={{
              fontSize: '0.96rem',
              color: '#1E293B',
              lineHeight: 1.6,
              margin: 0
            }}>
              {(() => {
                if (!responseMessage) return null;
                // Normalize markdown bullet lists and bold tags
                const normalized = responseMessage
                  .replace(/\*\s*\*\*/g, '\n• **')
                  .replace(/\*\s+/g, '\n• ')
                  .replace(/•\s*/g, '\n• ')
                  .trim();
                const lines = normalized.split('\n').map(l => l.trim()).filter(Boolean);

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {lines.map((line, idx) => {
                      const isBullet = line.startsWith('•') || line.startsWith('-');
                      const content = isBullet ? line.replace(/^[•\-]\s*/, '') : line;
                      const parts = content.split(/(\*\*[^*]+\*\*)/g);

                      return (
                        <div
                          key={idx}
                          style={{
                            display: isBullet ? 'flex' : 'block',
                            alignItems: 'flex-start',
                            gap: isBullet ? '8px' : 0,
                            fontSize: '0.94rem',
                            color: '#1E293B',
                            lineHeight: 1.55
                          }}
                        >
                          {isBullet && (
                            <span style={{
                              color: '#059669',
                              fontWeight: 700,
                              fontSize: '1.1rem',
                              lineHeight: 1.2,
                              flexShrink: 0
                            }}>•</span>
                          )}
                          <div>
                            {parts.map((part, pIdx) => {
                              if (part.startsWith('**') && part.endsWith('**')) {
                                return (
                                  <strong key={pIdx} style={{ color: '#0F172A', fontWeight: 700 }}>
                                    {part.slice(2, -2)}
                                  </strong>
                                );
                              }
                              return part;
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {transcript && (
              <div style={{
                marginTop: '12px',
                paddingTop: '10px',
                borderTop: '1px dashed #CBD5E1',
                fontSize: '0.82rem',
                color: '#64748B'
              }}>
                <strong>You said:</strong> "{transcript}"
              </div>
            )}
          </div>

          {/* Central Voice Action Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
            <button
              onClick={isListening ? () => recognitionRef.current && recognitionRef.current.stop() : startListening}
              className="hover-lift"
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: isListening ? '#DC2626' : '#059669',
                color: '#FFFFFF',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: isListening ? '0 0 0 8px rgba(220, 38, 38, 0.2)' : '0 8px 20px rgba(5, 150, 105, 0.35)',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }}
              title={isListening ? 'Click to stop listening' : 'Click and speak your question'}
            >
              {isListening ? <MicOff size={28} /> : <Mic size={28} />}
            </button>

            <button
              onClick={() => speakText(responseMessage)}
              disabled={isSpeaking}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: '#F1F5F9',
                border: '1px solid #CBD5E1',
                color: '#334155',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
              title="Re-play voice reading"
            >
              <Volume2 size={20} />
            </button>
          </div>

          <div style={{ textAlign: 'center', fontSize: '0.82rem', color: '#64748B', marginBottom: '20px' }}>
            {isListening
              ? '🎙️ Listening... speak now into your microphone'
              : 'Tap the green microphone to ask a question, or click any topic below:'}
          </div>

          {/* Quick Guided Voice Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {topics.map((t, idx) => {
              const Icon = t.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => processVoiceQuery(t.query)}
                  className="hover-lift"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: '#F8FAFC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Icon size={18} color={t.color} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>
                        {t.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                        "{t.query}"
                      </div>
                    </div>
                  </div>
                  <MessageSquare size={16} color="#94A3B8" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

