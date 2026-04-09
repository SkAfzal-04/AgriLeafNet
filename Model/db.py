import sqlite3
from config import DB_NAME

conn = sqlite3.connect(DB_NAME, check_same_thread=False)
cursor = conn.cursor()


# =========================
# 🧹 NORMALIZE
# =========================
def normalize(text):
    return text.lower().strip()


# =========================
# 🧱 INIT DB (WITH UNIQUE)
# =========================
def init_db():
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS medicines (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        disease TEXT,
        medicine TEXT,
        usage TEXT,
        product_name TEXT,
        link TEXT,
        rating TEXT,
        UNIQUE(disease, medicine)
    )
    """)
    conn.commit()


# =========================
# 💾 SAVE (NO DUPLICATES)
# =========================
def save_to_db(disease, medicine, usage, product_name, link, rating):

    disease = normalize(disease)
    medicine = medicine.strip()

    try:
        cursor.execute("""
            INSERT OR IGNORE INTO medicines
            (disease, medicine, usage, product_name, link, rating)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (disease, medicine, usage, product_name, link, rating))

        conn.commit()

    except Exception as e:
        print("❌ DB Save Error:", e)


# =========================
# 🔍 FETCH
# =========================
def get_from_db(disease):

    disease = normalize(disease)

    cursor.execute("""
        SELECT disease, medicine, usage, product_name, link, rating
        FROM medicines
        WHERE disease=?
    """, (disease,))

    rows = cursor.fetchall()

    if not rows:
        return []

    return [
        {
            "disease": r[0],
            "medicine": r[1],
            "usage": r[2],
            "product_name": r[3],
            "link": r[4],
            "rating": r[5]
        }
        for r in rows
    ]