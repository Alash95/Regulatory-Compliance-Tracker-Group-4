import azure.functions as func
import logging
import os
import requests
import pdfplumber
from bs4 import BeautifulSoup
import openai
from dotenv import load_dotenv

app = func.FunctionApp()

output_dir = "regulatory_documents"
os.makedirs(output_dir, exist_ok=True)

load_dotenv()

# PDF sources (expanded)
pdf_links = {
    # CBN
    "CBN_Customer_Due_Diligence_2023": "https://www.cbn.gov.ng/Out/2023/CCD/CBN%20Customer%20Due%20diligence%20Reg.%202023-combined.pdf",
    "CBN_AML_CFT_2022": "https://www.cbn.gov.ng/Out/2022/FPRD/AML%20CIRCULAR%20AND%20REGULATIONS%20MERGED.pdf",

    # SEC
    "SEC_AML_CFT_Regulations_2022": "https://sec.gov.ng/wp-content/uploads/2022/10/SEC-AMLCFTCPF-REGULATIONS-12-MAY-2022.pdf",
    "SEC_AML_CFT_Manual": "https://sec.gov.ng/files/AML%20CFT%20COMPLIANCE%20MANUAL.pdf",

    # FIRS
    "FIRS_Common_Reporting_Regulations": "https://old.firs.gov.ng/wp-content/uploads/2020/10/6f675124-b234-4482-ef83-0ef3e1e6d10fINCOME-TAX-COMMON-REPORTING-STANDARD.pdf",

    # NFIU
    "NFIU_STR_Guidelines_2024": "https://nfiu.gov.ng/advisory/NFIU-Guidelines-STR-Reporting-2024.pdf",

    # NDIC
    "NDIC_Mobile_Money_Guidelines": "https://ndic.gov.ng/files/Pass-Through-Deposit-Insurance-Guidelines.pdf",

    # NITDA
    "NITDA_NDPR_2019": "https://nitda.gov.ng/wp-content/uploads/2019/01/NigeriaDataProtectionRegulationNDPR.pdf",
    "NITDA_NDPR_Implementation_2020": "https://nitda.gov.ng/wp-content/uploads/2020/11/NDPR-Implementation-Framework.pdf",

    # NIBSS
    "NIBSS_BVN_Guidelines_2021": "https://nibss-plc.com.ng/wp-content/uploads/2021/04/BVN-Matching-Guidelines-v2.pdf"
}

def summarize_document(name, text):
    try:
        openai.api_key = os.getenv("OPENAI_API_KEY")
        openai.api_base = os.getenv("OPENAI_ENDPOINT")
        openai.api_type = "azure"
        openai.api_version = "2023-05-15"
        deployment = os.getenv("OPENAI_DEPLOYMENT_NAME")

        response = openai.ChatCompletion.create(
            engine=deployment,
            messages=[
                {"role": "system", "content": "Summarize this Nigerian regulatory document into clear English with bullet points and practical takeaways."},
                {"role": "user", "content": text[:12000]}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        logging.error(f"Failed to summarize {name}: {e}")
        return None

def download_and_extract_pdf(name, url):
    logging.info(f"Downloading PDF: {name}")
    try:
        pdf_path = os.path.join(output_dir, f"{name}.pdf")
        text_path = os.path.join(output_dir, f"{name}.txt")
        summary_path = os.path.join(output_dir, f"{name}_SUMMARY.txt")

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

        logging.info(f"Saved raw text: {text_path}")

        summary = summarize_document(name, all_text)
        if summary:
            with open(summary_path, 'w', encoding='utf-8') as f:
                f.write(summary)
            logging.info(f"Saved summary: {summary_path}")
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

            logging.info(f"Saved article: {file_name}")
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
