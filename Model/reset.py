import os
from config import DB_NAME

def drop_database():
    if os.path.exists(DB_NAME):
        try:
            os.remove(DB_NAME)
            print(f"✅ Database '{DB_NAME}' deleted successfully.")
        except Exception as e:
            print(f"❌ Error deleting database: {e}")
    else:
        print(f"⚠️ Database '{DB_NAME}' does not exist.")


if __name__ == "__main__":
    confirm = input("⚠️ This will delete the database. Type 'yes' to continue: ").strip().lower()

    if confirm == "yes":
        drop_database()
    else:
        print("❌ Operation cancelled.")