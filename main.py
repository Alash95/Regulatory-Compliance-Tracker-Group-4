import logging
from scraper import RegulatoryContentScraper
from storage import AzureStorage
import os
from datetime import datetime

def main():
    # Configure logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s'
    )
    
    try:
        # Initialize scraper
        scraper = RegulatoryContentScraper()
        
        # Initialize storage
        storage = AzureStorage(
            cosmos_connection_string=os.getenv('COSMOS_CONNECTION_STRING'),
            storage_connection_string=os.getenv('STORAGE_CONNECTION_STRING')
        )
        
        # Scrape each website
        for site_name in ScraperConfig.WEBSITES.keys():
            logging.info(f"Starting to scrape {site_name}")
            
            try:
                # Get content from website
                results = scraper.scrape_website(site_name)
                
                # Store results
                for content in results:
                    if storage.store_content(content):
                        logging.info(f"Successfully stored content: {content['title']}")
                    else:
                        logging.error(f"Failed to store content: {content['title']}")
                        
                logging.info(f"Completed scraping {site_name}: {len(results)} items found")
                
            except Exception as e:
                logging.error(f"Error processing {site_name}: {str(e)}")
                continue
                
    except Exception as e:
        logging.error(f"Critical error in main process: {str(e)}")

if __name__ == "__main__":
    main()