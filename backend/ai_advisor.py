"""
AI Clean Energy Advisor Engine for C.R.E.A.M.
Powered by Groq Cloud API (qwen/qwen3.8-27b high-speed LLM)
with automatic fallback to the C.R.E.A.M. Engineering Knowledge Base.
Supports multilingual responses without raw markdown symbol artifacts or token loops.
"""

import os
import re
import json
import urllib.request
import urllib.error

LANGUAGE_NAMES = {
    "en": "English",
    "kn": "Kannada (ಕನ್ನಡ)",
    "hi": "Hindi (हिन्दी)",
    "ta": "Tamil (தமிழ்)",
    "te": "Telugu (తెలుగు)",
    "ml": "Malayalam (മലയാളം)",
    "mr": "Marathi (मराठी)",
    "bn": "Bengali (বাংলা)",
    "gu": "Gujarati (ગુજરાતી)",
    "ur": "Urdu (اردو)"
}

def load_env_api_key():
    """Reads Groq API key from environment variable or .env file."""
    key = os.environ.get("GROQ_API_KEY", "") or os.environ.get("API_KEY", "")
    if not key:
        env_file = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
        if os.path.exists(env_file):
            with open(env_file, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line.startswith("API_KEY=") or line.startswith("GROQ_API_KEY="):
                        key = line.split("=", 1)[1].strip().strip('"').strip("'")
                        break
    return key

def clean_text_for_speech_and_display(raw_text: str) -> str:
    """
    1. Strips markdown asterisks (**, *, ***)
    2. Detects and truncates any repetitive token looping hallucinations
    3. Normalizes whitespace and bullets for pristine audio and visual output.
    """
    # 1. Strip markdown asterisks
    cleaned = re.sub(r"\*{1,3}", "", raw_text)
    
    # 2. Token-level loop detector & suppressor (handles Indic scripts like 'ಡಾ. ಡಾ. ಡಾ.')
    words = cleaned.split()
    if words:
        clean_words = []
        repeat_count = 0
        last_word = None
        for w in words:
            # Normalize token for repetition check (alphanumeric only)
            token_stem = re.sub(r"[^\w]", "", w.lower())
            if token_stem and token_stem == last_word:
                repeat_count += 1
                if repeat_count >= 1:
                    # Halt output immediately when an infinite repetition loop begins
                    break
            else:
                repeat_count = 0
                clean_words.append(w)
                last_word = token_stem
        cleaned = " ".join(clean_words)

    # 3. Standardize bullet points
    cleaned = re.sub(r"^\s*[-•]\s*", "• ", cleaned, flags=re.MULTILINE)
    # 4. Remove redundant newlines
    cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
    return cleaned.strip()

def build_system_prompt(lang: str) -> str:
    lang_name = LANGUAGE_NAMES.get(lang, "English")
    return f"""You are the official AI Clean Energy Advisor for C.R.E.A.M. (Community Renewable Energy Awareness and Management Portal), an academic societal project under VTU Course 1BCP308 supporting UN SDGs 7, 11, and 15.

CRITICAL MULTILINGUAL & PRONUNCIATION INSTRUCTIONS:
1. You MUST formulate your ENTIRE response strictly in {lang_name}.
   - If {lang_name} is Kannada, write ONLY in Kannada script (ಕನ್ನಡ).
   - If {lang_name} is Hindi, write ONLY in Devanagari script (हिन्दी).
   - If {lang_name} is Tamil, write ONLY in Tamil script (தமிழ்).
   - If {lang_name} is Telugu, write ONLY in Telugu script (తెలుగు).
   - Do NOT mix English words or Latin letters into non-English responses, so native text-to-speech audio pronounces words accurately.
2. DO NOT use markdown asterisks (never use '**' or '***').
3. Keep answers concise, natural, and under 80 words so voice audio plays cleanly without lag.
4. Topics you cover:
   - Rooftop Solar PV & PM Surya Ghar subsidies (₹30k for 1kW, ₹60k for 2kW, ₹78k for ≥3kW).
   - Community Biogas & Wet Waste Segregation (0.04 m³ gas per kg food waste; prevents landfill methane).
   - Household Energy Conservation (LED lighting, 28W BLDC fans, solar water heaters).
   - Central Electricity Authority (CEA) baseline grid emission factor: 0.82 kg CO2 per kWh avoided.
   - Community awareness drives & inspection camps."""

EXPERT_KNOWLEDGE_BASE = {
    "en": [
        {
            "keywords": ["solar", "sun", "rooftop", "photovoltaic", "pv", "panel", "subsidy", "surya", "ghar"],
            "title": "Rooftop Solar PV & PM Surya Ghar Guidelines",
            "answer": (
                "Rooftop Solar Photovoltaic systems generate decentralized clean electricity directly from sunlight.\n\n"
                "• PM Surya Ghar Muft Bijli Yojana Subsidies:\n"
                "  - ₹30,000 for 1 kW systems\n"
                "  - ₹60,000 for 2 kW systems\n"
                "  - ₹78,000 for 3 kW and higher systems\n"
                "• Feasibility: 1 kW requires ~100 sq.ft. of shadow-free rooftop area and generates ~4 to 4.5 kWh daily.\n"
                "• Net Metering: Surplus power is exported to the utility grid, lowering electric bills by up to 80%."
            ),
            "suggested_view": "home"
        },
        {
            "keywords": ["biogas", "methane", "waste", "wet", "food", "kitchen", "compost", "digester"],
            "title": "Community Biogas & Organic Waste Valorization",
            "answer": (
                "Community Anaerobic Digesters convert household kitchen food waste into clean cooking gas and organic compost.\n\n"
                "• Energy Yield: 1 kg of wet waste yields approximately 0.04 m³ of biogas, providing 15-20 minutes of domestic cooking.\n"
                "• Climate Action: Prevents unmanaged landfill decomposition and eliminates fugitive methane emissions (supporting UN SDG 15).\n"
                "• Rule: Always maintain 100% wet waste segregation—keep plastics and chemicals out."
            ),
            "suggested_view": "home"
        },
        {
            "keywords": ["calculator", "formula", "savings", "cea", "emission", "kwh", "bill", "tariff", "co2", "carbon"],
            "title": "Physics Calculation Basis & Grid Emission Factors",
            "answer": (
                "The C.R.E.A.M. Practice Estimator executes standard engineering formulas:\n\n"
                "1. Monthly Energy Saved (kWh) = [(W_old - W_new) × Quantity × Hours/Day × Days/Month] / 1000\n"
                "2. Monthly Cost Saved (₹) = Monthly kWh Saved × Electricity Tariff (₹/kWh)\n"
                "3. Annual CO₂ Avoided (kg) = (Monthly kWh Saved × 12) × 0.82 kg CO₂/kWh\n\n"
                "• Reference: The 0.82 kg CO₂/kWh factor is strictly sourced from the Central Electricity Authority (CEA) national baseline database."
            ),
            "suggested_view": "estimator"
        },
        {
            "keywords": ["checklist", "bldc", "fan", "led", "geyser", "habits", "practice", "ready", "readiness"],
            "title": "Household Energy Conservation & Appliance Transitions",
            "answer": (
                "Key high-impact household readiness steps:\n\n"
                "• 100% LED Shift: Replacing 60W bulbs with 9W LEDs cuts lighting power demand by over 80%.\n"
                "• 28W BLDC Fans: Replacing 75W induction fans saves ~50W continuously per fan.\n"
                "• Solar Water Heating: Evacuated Tube Collectors preheat water, displacing 2000W electric geysers during morning peak hours."
            ),
            "suggested_view": "practices"
        },
        {
            "keywords": ["drive", "camps", "workshop", "event", "inspection", "coordinator", "community"],
            "title": "Community Awareness Drives & Technical Inspection Camps",
            "answer": (
                "Community Drives are decentralized on-ground events coordinated by verified local volunteers:\n\n"
                "• Rooftop Solar Clinics: Assess rooftop structural suitability and assist with net-metering applications.\n"
                "• Wet-Waste Workshops: Demonstrations on two-bin segregation and domestic composting.\n"
                "• Coordinator Access: Coordinators schedule drives and publish verified notices."
            ),
            "suggested_view": "community"
        }
    ],
    "kn": [
        {
            "keywords": ["solar", "sun", "rooftop", "subsidy", "surya", "ghar", "ಸೋಲಾರ್", "ಸೂರ್ಯ", "ಕನ್ನಡ"],
            "title": "ಮೇಲ್ಛಾವಣಿ ಸೌರ ವಿದ್ಯುತ್ ಮತ್ತು ಸಹಾಯಧನ ಮಾರ್ಗದರ್ಶಿ",
            "answer": (
                "ಮೇಲ್ಛಾವಣಿ ಸೌರ ವಿದ್ಯುತ್ ವ್ಯವಸ್ಥೆಯು ಸೂರ್ಯನ ಬೆಳಕಿನಿಂದ ಶುದ್ಧ ವಿದ್ಯುತ್ ಉತ್ಪಾದಿಸುತ್ತದೆ.\n\n"
                "• ಪಿಎಂ ಸೂರ್ಯ ಘರ್ ಯೋಜನೆ ಸಹಾಯಧನ:\n"
                "  - 1 ಕಿಲೋವ್ಯಾಟ್ ವ್ಯವಸ್ಥೆಗೆ ₹30,000\n"
                "  - 2 ಕಿಲೋವ್ಯಾಟ್ ವ್ಯವಸ್ಥೆಗೆ ₹60,000\n"
                "  - 3 ಕಿಲೋವ್ಯಾಟ್ ಅಥವಾ ಹೆಚ್ಚಿನ ವ್ಯವಸ್ಥೆಗೆ ₹78,000\n"
                "• ಸ್ಥಳಾವಕಾಶ: 1 ಕಿಲೋವ್ಯಾಟ್‌ಗೆ ಸುಮಾರು 100 ಚದರ ಅಡಿ ನೆರಳಿಲ್ಲದ ಜಾಗ ಬೇಕಾಗುತ್ತದೆ ಮತ್ತು ದಿನಕ್ಕೆ ಸುಮಾರು 4 ರಿಂದ 4.5 ಯೂನಿಟ್ ವಿದ್ಯುತ್ ಉತ್ಪಾದನೆಯಾಗುತ್ತದೆ.\n"
                "• ನೆಟ್ ಮೀಟರಿಂಗ್ ಮೂಲಕ ಉಳಿದ ವಿದ್ಯುತ್ ಅನ್ನು ಗ್ರಿಡ್‌ಗೆ ನೀಡಿ ಬಿಲ್ ಅನ್ನು 80 ಪ್ರತಿಶತದವರೆಗೆ ಕಡಿಮೆ ಮಾಡಬಹುದು."
            ),
            "suggested_view": "home"
        },
        {
            "keywords": ["biogas", "waste", "wet", "food", "kitchen", "ಬಯೋ", "ಕಸ", "ಹಸಿ"],
            "title": "ಸಮುದಾಯ ಬಯೋ-ಗ್ಯಾಸ್ ಮತ್ತು ಹಸಿ ಕಸ ಸದ್ಬಳಕೆ",
            "answer": (
                "ಸಮುದಾಯ ಬಯೋ-ಗ್ಯಾಸ್ ಘಟಕಗಳು ಮನೆಯ ಹಸಿ ಕಸವನ್ನು ಶುದ್ಧ ಅಡುಗೆ ಅನಿಲ ಮತ್ತು ಸಾವಯವ ಗೊಬ್ಬರವಾಗಿ ಪರಿವರ್ತಿಸುತ್ತವೆ.\n\n"
                "• ಇಂಧನ ಉತ್ಪಾದನೆ: 1 ಕೆಜಿ ಹಸಿ ಕಸದಿಂದ ಸುಮಾರು 0.04 ಘನ ಮೀಟರ್ ಬಯೋ-ಗ್ಯಾಸ್ ಉತ್ಪತ್ತಿಯಾಗುತ್ತದೆ, ಇದು 15-20 ನಿಮಿಷಗಳ ಅಡುಗೆಗೆ ಸಾಕಾಗುತ್ತದೆ.\n"
                "• ಪರಿಸರ ಸಂರಕ್ಷಣೆ: ತ್ಯಾಜ್ಯದಿಂದ ಮೀಥೇನ್ ಹೊರಸೂಸುವಿಕೆಯನ್ನು ತಡೆದು ಸ್ವಚ್ಛ ಪರಿಸರಕ್ಕೆ ನೆರವಾಗುತ್ತದೆ (SDG 15 ಗುರಿ).\n"
                "• ನಿಯಮ: ಹಸಿ ಕಸದಲ್ಲಿ ಪ್ಲಾಸ್ಟಿಕ್ ಅಥವಾ ರಾಸಾಯನಿಕ ವಸ್ತುಗಳು ಸೇರದಂತೆ ಶೇಕಡಾ 100 ರಷ್ಟು ಪ್ರತ್ಯೇಕಿಸಿ."
            ),
            "suggested_view": "home"
        }
    ],
    "hi": [
        {
            "keywords": ["solar", "sun", "rooftop", "subsidy", "surya", "ghar", "सौर", "सूर्य", "हिन्दी"],
            "title": "रूफटॉप सोलर एवं पीएम सूर्य घर योजना",
            "answer": (
                "रूफटॉप सोलर सिस्टम सूर्य के प्रकाश से स्वच्छ बिजली उत्पन्न करता है।\n\n"
                "• पीएम सूर्य घर मुफ्त बिजली योजना सब्सिडी:\n"
                "  - 1 किलोवाट सिस्टम पर ₹30,000\n"
                "  - 2 किलोवाट सिस्टम पर ₹60,000\n"
                "  - 3 किलोवाट या अधिक पर ₹78,000\n"
                "• जगह की आवश्यकता: 1 किलोवाट के लिए लगभग 100 वर्ग फुट छाया-मुक्त छत की आवश्यकता होती है।\n"
                "• नेट मीटरिंग से अतिरिक्त बिजली ग्रिड को देकर बिल में 80% तक बचत की जा सकती है।"
            ),
            "suggested_view": "home"
        },
        {
            "keywords": ["biogas", "waste", "wet", "food", "kitchen", "बायोगैस", "कचरा", "गीला"],
            "title": "सामुदायिक बायोगैस एवं गीला कचरा प्रबंधन",
            "answer": (
                "सामुदायिक बायोगैस संयंत्र रसोई के गीले कचरे को स्वच्छ खाना पकाने की गैस और जैविक खाद में बदलते हैं।\n\n"
                "• ऊर्जा उत्पादन: 1 किग्रा गीले कचरे से लगभग 0.04 घन मीटर बायोगैस मिलती है, जो 15-20 मिनट की कुकिंग के लिए पर्याप्त है।\n"
                "• पर्यावरण लाभ: यह लैंडफिल में मीथेन गैस बनने से रोकता है और यूएन एसडीजी 15 का समर्थन करता है।\n"
                "• नियम: गीले कचरे में प्लास्टिक या रसायन कभी न मिलाएं।"
            ),
            "suggested_view": "home"
        }
    ]
}

def query_groq_llm(prompt: str, lang: str, api_key: str) -> str:
    """Calls Groq's high-speed inference API with qwen/qwen3.8-27b with repetition penalty."""
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36"
    }
    system_prompt = build_system_prompt(lang)
    payload = {
        "model": "qwen/qwen3.8-27b",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.4,
        "frequency_penalty": 0.6,
        "presence_penalty": 0.6,
        "max_tokens": 160
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers=headers)
    
    with urllib.request.urlopen(req, timeout=10) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        raw = res["choices"][0]["message"]["content"].strip()
        return clean_text_for_speech_and_display(raw)

def query_ai_advisor(query: str, lang: str = "en") -> dict:
    """Answers user clean energy queries using Groq LLM or Engineering Knowledge Base fallback."""
    api_key = load_env_api_key()
    
    # Determine target view for UI navigation
    q_lower = query.lower()
    suggested_view = "home"
    if any(k in q_lower for k in ["calculator", "estimate", "savings", "bill", "tariff", "kwh", "cost", "co2", "ಲೆಕ್ಕ", "गणना"]):
        suggested_view = "estimator"
    elif any(k in q_lower for k in ["checklist", "habit", "practice", "led", "bldc", "fan", "geyser", "ready", "ಪಟ್ಟಿ", "सूची"]):
        suggested_view = "practices"
    elif any(k in q_lower for k in ["drive", "camp", "workshop", "event", "meeting", "join", "notice", "ಅಭಿಯಾನ", "शिविर"]):
        suggested_view = "community"

    # Single-word greeting/language selector queries handled gracefully
    if q_lower in ["ಕನ್ನಡ", "kannada", "hi", "hindi", "हिन्दी", "hello", "ನಮಸ್ಕಾರ"]:
        lang_kb = EXPERT_KNOWLEDGE_BASE.get(lang, EXPERT_KNOWLEDGE_BASE["en"])
        greeting = lang_kb[0]
        return {
            "title": f"C.R.E.A.M. Advisor ({LANGUAGE_NAMES.get(lang, 'English')})",
            "answer": clean_text_for_speech_and_display(greeting["answer"]),
            "suggested_view": "home",
            "source": "C.R.E.A.M. Knowledge Base"
        }

    # Try Groq AI Cloud first if key available
    if api_key:
        try:
            groq_answer = query_groq_llm(query, lang, api_key)
            if groq_answer and len(groq_answer) > 20:
                return {
                    "title": f"Groq AI Advisor ({LANGUAGE_NAMES.get(lang, 'English')})",
                    "answer": groq_answer,
                    "suggested_view": suggested_view,
                    "source": "Groq Cloud (qwen/qwen3.8-27b)"
                }
        except Exception as e:
            pass

    # Knowledge Base fallback in selected language or English
    lang_kb = EXPERT_KNOWLEDGE_BASE.get(lang, EXPERT_KNOWLEDGE_BASE["en"])
    best_match = None
    max_score = 0
    for item in lang_kb:
        score = sum(1 for kw in item["keywords"] if kw in q_lower)
        if score > max_score:
            max_score = score
            best_match = item
            
    if best_match and max_score > 0:
        return {
            "title": best_match["title"],
            "answer": clean_text_for_speech_and_display(best_match["answer"]),
            "suggested_view": best_match.get("suggested_view", suggested_view),
            "source": "C.R.E.A.M. Engineering Knowledge Base"
        }

    # Fallback to English knowledge base if regional had no match
    if lang != "en":
        for item in EXPERT_KNOWLEDGE_BASE["en"]:
            score = sum(1 for kw in item["keywords"] if kw in q_lower)
            if score > max_score:
                max_score = score
                best_match = item
        if best_match and max_score > 0:
            return {
                "title": best_match["title"],
                "answer": clean_text_for_speech_and_display(best_match["answer"]),
                "suggested_view": best_match.get("suggested_view", suggested_view),
                "source": "C.R.E.A.M. Engineering Knowledge Base"
            }

    return {
        "title": "Clean Energy Civic Advisor",
        "answer": clean_text_for_speech_and_display(
            f"Regarding your query on '{query}': In community clean energy management, "
            "prioritize rooftop solar PV assessment, high-efficiency 9W LED and 28W BLDC appliance retrofits, "
            "and household wet-waste segregation. You can use our Practice Estimator to calculate savings or review the Readiness Checklist."
        ),
        "suggested_view": suggested_view,
        "source": "C.R.E.A.M. Advisor"
    }
