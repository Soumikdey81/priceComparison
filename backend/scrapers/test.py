from flipkart import FlipkartScraper  # Adjust import if needed

def main():
    scraper = FlipkartScraper()

    query = "laptop"  # Change query to test different products
    print(f"Searching Flipkart for: {query}")

    try:
        results = scraper.search(query)
        print(f"Found {len(results)} products:\n")

        for product in results:
            print(f"- {product['name']}")
            print(f"  ₹{product['price']} | {product['url']}")
            print()

    except Exception as e:
        print(f"Scraper error: {e}")

if __name__ == "__main__":
    main()
