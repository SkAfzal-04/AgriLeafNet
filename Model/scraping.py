from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
import time
import json

options = webdriver.ChromeOptions()
options.add_argument("--headless=new")

driver = webdriver.Chrome(
    service=Service(ChromeDriverManager().install()),
    options=options
)

def scroll_page():
    for _ in range(5):
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(2)

def scrape_bighaat(query):
    url = f"https://www.bighaat.com/search?q={query.replace(' ', '+')}"
    driver.get(url)
    time.sleep(5)

    scroll_page()

    products = []

    items = driver.find_elements(By.XPATH, "//a[contains(@href, '/products/')]")

    print("Found elements:", len(items))  # DEBUG

    for item in items:
        try:
            link = item.get_attribute("href")
            name = item.text.strip()

            if name:
                products.append({
                    "name": name,
                    "link": link
                })
        except:
            continue

    return products


all_products = []

queries = ["fungicide", "potato fertilizer", "late blight fungicide"]

for q in queries:
    print("Scraping:", q)
    data = scrape_bighaat(q)
    all_products.extend(data)

driver.quit()

# Remove duplicates
unique = {p["link"]: p for p in all_products}
all_products = list(unique.values())

# Save
with open("products.json", "w") as f:
    json.dump(all_products, f, indent=4)

print("Saved:", len(all_products))