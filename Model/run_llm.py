from db import init_db
from pipeline import get_medicine_pipeline


def display_results(result):
    print("\n📡 Source:", result["source"])
    print("\n💬 Answer:", result.get("answer"), "\n")

    data = result.get("data", [])

    if not data:
        print("⚠️ No data found\n")
        return

    for i, item in enumerate(data, 1):
        print(f"{i}. Medicine: {item.get('medicine')}")
        print(f"   Usage: {item.get('usage')}")
        print(f"   Product: {item.get('product_name')}")
        print(f"   Link: {item.get('link')}")
        print(f"   Rating: {item.get('rating')}\n")


if __name__ == "__main__":
    print("🌱 Agri RAG LLM CLI\n")

    # ✅ Initialize DB
    init_db()

    while True:
        disease = input("Enter disease (or 'exit'): ").strip()

        if disease.lower() == "exit":
            print("👋 Exiting...")
            break

        if not disease:
            print("⚠️ Please enter a valid disease\n")
            continue

        print("\n🔄 Processing...\n")

        try:
            result = get_medicine_pipeline(disease)
            display_results(result)

        except Exception as e:
            print("❌ Error:", e)

        print("-" * 60 + "\n")