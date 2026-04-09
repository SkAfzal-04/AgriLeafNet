from openai import OpenAI
from config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)


# =========================
# 🧹 CLEAN PARSER
# =========================
def parse_llm_response(text):
    medicines = []

    lines = [l.strip() for l in text.split("\n") if l.strip()]

    i = 0
    while i < len(lines) - 1:
        name = lines[i]
        usage = lines[i + 1]

        medicines.append({
            "medicine": name,
            "usage": usage
        })

        i += 2  # move in pairs

    return medicines[:3]  # strict limit


# =========================
# 🌍 TRANSLATION (FINAL STEP ONLY)
# =========================
def translate_text(text, target_lang="en"):
    if target_lang == "en":
        return text

    LANG_MAP = {
        "en": "English",
        "hi": "Hindi",
        "bn": "Bengali",
        "ta": "Tamil",
        "te": "Telugu"
    }

    language = LANG_MAP.get(target_lang, "English")

    prompt = f"""
    Translate the following text into {language}.

    STRICT RULES:
    - DO NOT translate medicine names (like Mancozeb, Chlorothalonil)
    - DO NOT change formatting
    - DO NOT add or remove anything
    - Only translate normal sentences

    Text:
    {text}
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0
        )

        return response.choices[0].message.content.strip()

    except Exception as e:
        print("❌ Translation Error:", e)
        return text


# =========================
# 🤖 LLM FUNCTION (STRICT OUTPUT)
# =========================
def get_medicines_from_llm(disease: str,lang="en"):
    prompt = f"""
    You are a professional agricultural expert.

    A farmer reports: "{disease}" in potato crops.

    Suggest EXACTLY 3 real medicines.

    STRICT FORMAT (NO EXTRA TEXT):

    Medicine Name
    Usage in 1 line

    Medicine Name
    Usage in 1 line

    Medicine Name
    Usage in 1 line

    RULES:
    - Only real medicines
    - Medicine names in English
    - No numbering
    - No bullets
    - No explanations
    """

    try:
        response = client.chat.completions.create(
            model="gpt-4.1-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2
        )

        text = response.choices[0].message.content.strip()

        medicines = parse_llm_response(text)

        return medicines

    except Exception as e:
        print("❌ LLM Error:", e)
        return []


# =========================
# 🧠 RAG RESPONSE GENERATOR
# =========================
def generate_rag_response(disease, data, lang="en"):
    if not data:
        return "No recommendations found."

    headers = {
        "en": f"Recommended medicines for {disease}:\n\n",
        "hi": f"{disease} के लिए अनुशंसित दवाएं:\n\n",
        "bn": f"{disease} এর জন্য প্রস্তাবিত ওষুধ:\n\n",
        "ta": f"{disease} க்கான பரிந்துரைக்கப்பட்ட மருந்துகள்:\n\n",
        "te": f"{disease} కోసం సిఫార్సు చేసిన మందులు:\n\n"
    }

    response = headers.get(lang, headers["en"])

    for i, item in enumerate(data, 1):
        response += f"{i}. {item['medicine']}\n"
        response += f"   Usage: {item['usage']}\n\n"

    return response


# =========================
# 🚀 FINAL PIPELINE FUNCTION
# =========================
def get_final_response(disease, lang="en"):
    medicines = get_medicines_from_llm(disease)

    rag_response = generate_rag_response(disease, medicines, lang)

    # ✅ TRANSLATE ONLY FINAL RESPONSE
    final_response = translate_text(rag_response, lang)

    return final_response