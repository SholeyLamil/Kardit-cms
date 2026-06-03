import scrape from 'website-scraper';

const options = {
    // 1. Point this to your active VS Code Live Server URL
    urls: ['http://localhost:5500'], 
    
    // 2. The folder name where your individual pages will save
    directory: './extracted_pages', 
    
    // 3. This tells it to download sub-pages linked in your navigation menu
    recursive: true,
    maxDepth: 2,
    
    // 4. Keeps the file formatting clean
    subdirectories: [
        {directory: 'img', extensions: ['.jpg', '.png', '.svg', '.gif', '.webp']},
        {directory: 'js', extensions: ['.js']},
        {directory: 'css', extensions: ['.css']}
    ]
};

// Run the scraper
scrape(options).then((result) => {
    console.log("Success! Your individual pages are ready in the 'extracted_pages' folder.");
}).catch((err) => {
    console.error("Error during scraping:", err);
});
