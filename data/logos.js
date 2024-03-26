const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

async function scrapeCarLogos() {
  try {
    const response = await axios.get('https://www.carlogos.org/car-brands/');
    const $ = cheerio.load(response.data);
    
    const logos = [];

    $('.logo-list a').each((index, element) => {
      const logoData = {};
      const logo = $(element).find('img');
      logoData.alt = logo.attr('alt');
      logoData.url = 'https://www.carlogos.org' + logo.attr('src');
      
      logos.push(logoData);
    });

    // Write the extracted data to a JSON file
    fs.writeFileSync('car_logos.json', JSON.stringify(logos, null, 2));
    
    // Absolute path to store logo files
    const logosDirectory = '/workspaces/WRC-API/data/logos';

    // Use wget command to download the logos
    logos.forEach((logo) => {
      const filename = logo.alt.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.png';
      const filePath = path.join(logosDirectory, filename);
      const command = `wget -O "${filePath}" "${logo.url}"`;
      console.log(`Downloading ${filename}...`);
      // Execute the wget command
      const exec = require('child_process').exec;
      const child = exec(command);
      child.stdout.pipe(process.stdout);
      child.stderr.pipe(process.stderr);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

scrapeCarLogos();
