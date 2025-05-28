# Regulatory Compliance Watchdog

This is an Azure Functions app designed to automatically monitor, extract, and summarize regulatory policy documents and news relevant to the Nigerian financial sector. It also evaluates compliance against KYC requirements using AI.

## Features

- Timer-triggered function that runs every 5 minutes
- Downloads PDF documents from verified Nigerian regulatory sources
- Extracts text using `pdfplumber`
- Summarizes documents with Azure OpenAI (via Semantic Kernel)
- Computes a compliance score based on KYC practices and company type
- Scrapes anti-money laundering news from Punch Nigeria
- Stores outputs including raw text, summaries, scores, and articles

## Configuration

Use either `.env` or `local.settings.json` for the following:

```env
OPENAI_API_KEY=your-key
OPENAI_ENDPOINT=https://your-resource.openai.azure.com
OPENAI_DEPLOYMENT_NAME=gpt-4o
COMPANY_KYC_DESCRIPTION=We collect NIN and utility bills
COMPANY_TYPE=Fintech
