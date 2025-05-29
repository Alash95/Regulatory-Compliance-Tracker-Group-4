import azure.functions as func
import logging
import os
import requests
import pdfplumber
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from azure.storage.blob import BlobServiceClient

app = func.FunctionApp()

output_dir = "regulatory_documents"
os.makedirs(output_dir, exist_ok=True)

load_dotenv()

# Initialize Azure Blob Storage
blob_conn_str = os.getenv("AZURE_BLOB_CONNECTION_STRING")
blob_service_client = BlobServiceClient.from_connection_string(blob_conn_str)
container_name = "regulatory-docs"
container_client = blob_service_client.get_container_client(container_name)

# Ensure the container exists
try:
    container_client.get_container_properties()
except Exception:
    blob_service_client.create_container(container_name)
    logging.info(f"Created container: {container_name}")


# PDF sources (only working and verified ones)
pdf_links = {
    # CBN
    "CBN_Customer_Due_Diligence_2023": "https://www.cbn.gov.ng/Out/2023/CCD/CBN%20Customer%20Due%20diligence%20Reg.%202023-combined.pdf",
    "CBN_AML_CFT_2022": "https://www.cbn.gov.ng/Out/2022/FPRD/AML%20CIRCULAR%20AND%20REGULATIONS%20MERGED.pdf",

    # SEC
    "SEC_AML_CFT_Regulations_2022": "https://sec.gov.ng/wp-content/uploads/2022/10/SEC-AMLCFTCPF-REGULATIONS-12-MAY-2022.pdf",
    "SEC_AML_CFT_Manual": "https://sec.gov.ng/files/AML%20CFT%20COMPLIANCE%20MANUAL.pdf"
}

def upload_to_blob(file_path, blob_name):
    try:
        with open(file_path, "rb") as data:
            container_client.upload_blob(name=blob_name, data=data, overwrite=True)
            logging.info(f"Uploaded {blob_name} to Azure Blob Storage")
    except Exception as e:
        logging.error(f"Failed to upload {blob_name} to blob storage: {e}")

def download_and_extract_pdf(name, url):
    logging.info(f"Downloading PDF: {name}")
    try:
        pdf_path = os.path.join(output_dir, f"{name}.pdf")
        text_path = os.path.join(output_dir, f"{name}.txt")

        response = requests.get(url, timeout=15)
        response.raise_for_status()

        with open(pdf_path, 'wb') as f:
            f.write(response.content)

        with pdfplumber.open(pdf_path) as pdf:
            all_text = "\n".join(page.extract_text() or "" for page in pdf.pages)

        if not all_text.strip():
            logging.warning(f"No extractable text in {name}")

        with open(text_path, 'w', encoding='utf-8') as f:
            f.write(all_text)

        upload_to_blob(pdf_path, f"{name}.pdf")
        upload_to_blob(text_path, f"{name}.txt")

    except Exception as e:
        logging.error(f"Failed to download or extract {name}: {e}")

def scrape_punch_articles():
    url = "https://punchng.com/topics/money-laundering/"
    logging.info(f"Scraping Punch News: {url}")

    try:
        response = requests.get(url, timeout=15)
        soup = BeautifulSoup(response.text, 'html.parser')

        articles = soup.find_all("article")
        if not articles:
            logging.warning("No articles found.")

        for i, article in enumerate(articles[:5]):
            title = article.find("h2").get_text(strip=True)
            link = article.find("a")["href"]
            logging.info(f"Article: {title} - {link}")

            article_response = requests.get(link)
            article_soup = BeautifulSoup(article_response.text, "html.parser")
            content_tags = article_soup.find_all("p")
            article_text = "\n".join(tag.get_text(strip=True) for tag in content_tags)

            file_name = f"Punch_{i+1}_{title[:50].replace(' ', '_')}.txt"
            file_path = os.path.join(output_dir, file_name)

            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(f"{title}\n{link}\n\n{article_text}")

            upload_to_blob(file_path, file_name)

    except Exception as e:
        logging.error(f"Failed to scrape Punch: {e}")

@app.timer_trigger(schedule="0 */5 * * * *", arg_name="myTimer", run_on_startup=False, use_monitor=False)
def watchdogScraper(myTimer: func.TimerRequest) -> None:
    if myTimer.past_due:
        logging.info("Timer is past due!")

    logging.info("Running watchdog scraper...")

    for name, link in pdf_links.items():
        download_and_extract_pdf(name, link)

    scrape_punch_articles()

    logging.info("Watchdog scrape complete.")
