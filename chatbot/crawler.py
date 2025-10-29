# crawler.py (Final version, targeted with 'hlist')
import requests
from bs4 import BeautifulSoup
import re
import os
import time
from urllib.parse import urljoin, urlparse


def scrape_and_save(url, session):
    """
    Takes a single URL, scrapes its content, and saves it to a text file.
    """
    try:
        parsed_url = urlparse(url)
        clean_filename = re.sub(r'[^a-zA-Z0-9]', '_', parsed_url.path + parsed_url.query)
        filename = f"data/{clean_filename[:70]}.txt"

        if os.path.exists(filename):
            print(f"  -> Skipping {url} (already scraped)")
            return

        print(f"  -> Scraping {url}...")
        response = session.get(url)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'html.parser')

        title_span = soup.find('span', class_='mw-page-title-main')
        title = title_span.get_text(strip=True) if title_span else 'Scraped Content'

        content_div = soup.find('div', class_='mw-parser-output')
        if not content_div:
            print(f"     Could not find content for {url}")
            return

        paragraphs = content_div.find_all('p')

        content = f"Source URL: {url}\n\nTitle: {title}\n\n"
        content += "\n".join([para.get_text(strip=True) for para in paragraphs])

        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"     ✅ Saved to {filename}")

    except Exception as e:
        print(f"     ❌ Error scraping {url}: {e}")


def crawl_category_page(start_url):
    """
    Crawls the Wikipedia Index page by finding all 'hlist' divs.
    """
    print(f"--- 🕵️ Starting targeted crawl of Wikipedia index: {start_url} ---")
    session = requests.Session()

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    session.headers.update(headers)

    try:
        response = session.get(start_url)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')

        # --- THIS IS THE FINAL, CORRECTED LOGIC BASED ON YOUR INSPECTION ---
        # Find all the horizontal list containers which hold the article links
        horizontal_lists = soup.find_all('div', class_='hlist')

        all_article_links = []
        for hlist in horizontal_lists:
            # Find all the <a> tags within each list
            links = hlist.find_all('a')
            all_article_links.extend(links)

        print(f"--- Found {len(all_article_links)} total potential articles ---")

        article_count = 0
        for link_tag in all_article_links:
            relative_url = link_tag.get('href')

            # Filter for valid internal Wikipedia article links
            if (relative_url
                    and relative_url.startswith('/wiki/')
                    and ':' not in relative_url):
                article_count += 1
                full_url = urljoin(start_url, relative_url)
                scrape_and_save(full_url, session)
                time.sleep(1)  # Be polite!

        print(f"--- Scraped a total of {article_count} articles. ---")

    except Exception as e:
        print(f"❌ Error crawling category page {start_url}: {e}")

    print("--- Crawl finished! ---")


# --- MAIN EXECUTION BLOCK ---
if __name__ == "__main__":
    target_url = "https://en.wikipedia.org/wiki/Index_of_environmental_articles"

    os.makedirs('data', exist_ok=True)

    crawl_category_page(target_url)