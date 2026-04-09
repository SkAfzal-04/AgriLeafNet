from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import time


# =========================
# 🚀 DRIVER FACTORY
# =========================
def create_driver():
    options = webdriver.ChromeOptions()
    options.add_argument("--headless=new")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")

    return webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=options
    )


# =========================
# 🔍 MAIN SCRAPER FUNCTION
# =========================
def scrape_product(medicine):

    driver = create_driver()

    try:
        search_query = medicine.lower().strip()
        search_url = f"https://www.bighaat.com/search?q={search_query.replace(' ', '+')}"

        driver.get(search_url)
        time.sleep(3)

        items = driver.find_elements(By.XPATH, "//a[contains(@href, '/products/')]")

        if not items:
            return None, None, None

        # ✅ FILTER PRODUCTS BASED ON MEDICINE NAME
        for item in items:
            name = item.text.strip()
            link = item.get_attribute("href")

            if not name or not link:
                continue

            # 🔥 KEY FIX: Match medicine keyword
            if search_query.split()[0] not in name.lower():
                continue

            # Open product page
            driver.get(link)
            time.sleep(2)

            # Extract rating (optional)
            try:
                rating_elem = driver.find_element(
                    By.CSS_SELECTOR,
                    "span.jdgm-prev-badge__stars"
                )
                rating = rating_elem.get_attribute("data-score")
            except:
                rating = None

            return name, link, rating

        # ❌ If no relevant product found
        return None, None, None

    except Exception as e:
        print("❌ Scraping error:", e)
        return None, None, None

    finally:
        driver.quit()