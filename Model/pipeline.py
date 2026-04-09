from db import get_from_db, save_to_db
from llm import get_medicines_from_llm, generate_rag_response
from scraper import scrape_product


# =========================
# 🧹 NORMALIZE INPUT
# =========================
def normalize_disease(disease: str):
    return disease.lower().strip()


# =========================
# 🔍 CHECK DUPLICATE
# =========================
def is_duplicate(existing_records, medicine_name):
    for record in existing_records:
        if record["medicine"].lower() == medicine_name.lower():
            return record
    return None


# =========================
# 🚀 MAIN PIPELINE
# =========================
def get_medicine_pipeline(disease, lang="en"):

    disease = normalize_disease(disease)

    # =========================
    # STEP 1: GET EXISTING DATA (RAG BASE)
    # =========================
    existing = get_from_db(disease) or []

    # Convert existing medicines into lookup
    existing_map = {
        item["medicine"].lower(): item
        for item in existing
    }

    # =========================
    # STEP 2: LLM GENERATION
    # =========================
    medicines = get_medicines_from_llm(disease, lang)

    if not medicines:
        return {
            "source": "llm",
            "data": [],
            "answer": "No medicines found."
        }

    final_results = []

    # =========================
    # STEP 3: PROCESS EACH MEDICINE
    # =========================
    for med in medicines:
        med_name = med["medicine"].strip()
        usage = med.get("usage", "")

        # ✅ CASE 1: Already exists in DB (RAG HIT)
        if med_name.lower() in existing_map:
            final_results.append(existing_map[med_name.lower()])
            continue

        # ✅ CASE 2: NOT IN DB → SCRAPE
        try:
            product_name, link, rating = scrape_product(med_name)
        except Exception as e:
            print("❌ Scrape error:", e)
            product_name, link, rating = None, None, None

        record = {
            "disease": disease,
            "medicine": med_name,
            "usage": usage,
            "product_name": product_name,
            "link": link,
            "rating": rating
        }

        # =========================
        # STEP 4: SAVE (NO DUPLICATE)
        # =========================
        save_to_db(
            disease,
            med_name,
            usage,
            product_name,
            link,
            rating
        )

        final_results.append(record)

    # =========================
    # STEP 5: RESPONSE (RAG ENHANCED)
    # =========================
    return {
        "source": "rag+llm",
        "data": final_results,
        "answer": generate_rag_response(disease, final_results , lang)
    }