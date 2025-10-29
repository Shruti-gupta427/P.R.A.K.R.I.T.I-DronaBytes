# scraper.py
import requests
from bs4 import BeautifulSoup
import sys
import re
from urllib.parse import urlparse


def scrape_and_save(url):
    try:
        # Fetch the content of the URL
        print(f" Scraping {url}...")
        response = requests.get(url)
        response.raise_for_status()  # Raise an error for bad responses

        # Parse the HTML
        soup = BeautifulSoup(response.content, 'html.parser')

        # Find the main content (this works well for articles)
        # We get the title for the filename and all paragraphs for the content
        title = soup.find('h1').get_text() if soup.find('h1') else 'scraped_content'
        paragraphs = soup.find_all('p')

        content = f"Source URL: {url}\n\nTitle: {title}\n\n"
        content += "\n".join([para.get_text() for para in paragraphs])

        # Create a clean filename from the title
        clean_title = re.sub(r'[^a-zA-Z0-9]', '_', title.lower())
        filename = f"data/{clean_title[:50]}.txt"

        # Save the content to a file in the 'data' folder
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(content)

        print(f"✅ Successfully saved content to {filename}")

    except Exception as e:
        print(f"Error scraping {url}: {e}")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scraper.py <URL>")
    else:
        scrape_and_save(sys.argv[1])