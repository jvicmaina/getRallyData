const request = require('request');
const cheerio = require('cheerio');
const countryList = require('country-list');
const Geonames = require('geonames');


const url = 'https://www.ewrc-results.com/season/2024/';
const START_ID_2022 = 73369; // Last ID for 2022
const START_ID_2023 = 80000; // Starting ID for 2023
const START_ID_2024 = 90000; // Starting ID for 2024

// Initialize GeoNames client
//const geoNamesClient = new Geonames({ username: 'vicwithai' });
//const Geonames = require('geonames');

// Use the static method provided by the GeoNames library directly
//const Geonames = require('geonames');

async function getCountryInfo() {
    try {
        const countryInfo = await Geonames.countryInfo({ country: 'US' });
        console.log(countryInfo);
    } catch (error) {
        console.error('Error:', error);
    }
}

getCountryInfo();





// Function to generate sequential IDs for each year
function generateId(year, index) {
    if (year === '2022') {
        return (START_ID_2022 + index).toString();
    } else if (year === '2023') {
        return (START_ID_2023 + index).toString();
    } else if (year === '2024') {
        return (START_ID_2024 + index).toString();
    }
}

// Function to check if a word corresponds to a country name using the country-list library
function isCountryName(word) {
    return countryList.getName(word) !== undefined;
}

// Function to check if a word corresponds to a place name using GeoNames
async function isPlaceName(word) {
    try {
        const result = await geoNamesClient.search({ q: word });
        return result && result.geonames && result.geonames.length > 0;
    } catch (error) {
        console.error('Error while checking place name:', error);
        return false;
    }
}

// Object to store event IDs
const EVENT_IDS = {};

// Make a GET request to fetch the HTML content of the webpage
request(url, async function(error, response, html) {
    if (!error && response.statusCode == 200) {
        // Load the HTML content into Cheerio
        const $ = cheerio.load(html);

        // Select all items with the specified class and iterate over them
        $('.season-event.text-center.mt-3.position-relative').each(async function(index, element) {
            // Extract the text content of each item
            let itemText = $(this).text().trim();
            // Remove unwanted characters at the beginning of the event name
            itemText = itemText.replace(/^\d+\.\s*/, ''); // Remove digits followed by a dot and whitespace
            const parts = itemText.split(/\s{2,}/); // Split by 2 or more spaces
            const year = parts[0].trim();
            const eventName = parts.slice(1).join(' ').trim(); // Join all parts except the first one as the event name
            // Extract country name or place name from event name
            const country = parts.find(async word => await isPlaceName(word) || isCountryName(word)) || '';
            const name = eventName.replace(country, '').trim().toLowerCase().replace(/\s+/g, '-');
            const id = generateId(year, index); // Generate ID based on year and index
            
            // Add event ID to the corresponding year and country in the EVENT_IDS object
            if (!EVENT_IDS[year]) {
                EVENT_IDS[year] = {};
            }
            if (!EVENT_IDS[year][country]) {
                EVENT_IDS[year][country] = {};
            }
            EVENT_IDS[year][country][name] = { name: name, id: id };
        });

        console.log(EVENT_IDS); // Output the generated event IDs
    } else {
        console.log('Error fetching webpage:', error);
    }
});


module.exports = {

EVENT_IDS : {

    '2022' : {
        'monte' : {name: "rallye-automobile-de-monte-carlo", id: '72281'},
        'sweden' : {name: "rally-sweden", id: '72282'},
        'croatia' : {name: "croatia-rally", id: '73359'},
        'portugal' : {name: "vodafone-rally-de-portugal", id: '73360'},
        'sardinia' : {name: "rally-italia-sardegna", id: '73361'},
        'kenya' : {name: "safari-rally-kenya", id: '73362'},
        'Kenya' : {name: "safari-rally-kenya", id: '73362'},
        'estonia' : {name: "rally-estonia", id: '73363'},
        'finland' : {name: "rally-finland", id: '73364'},
        'acropolis' : {name: "acropolis-rally", id: '73366'},
        'greece' : {name: "acropolis-rally", id: '73366'},
        'new-zealand' : {name: "rally-new-zealand", id: '73367'},
        'catalunya' : {name: "rallyracc-catalunya-costa-daurada", id: '73368'},
        'japan' : {name: "rally-japan", id: '73369'},
    },

    '2021' : {
        'monte' : {name: "rallye-automobile-de-monte-carlo", id: '41079'},
        'arctic' : {name: "arctic-rally-finland-powered-by-capitalbox", id: '69715'},
        'croatia' : {name: "croatia-rally", id: '67214'},
        'portugal' : {name: "vodafone-rally-de-portugal", id: '68111'},
        'sardinia' : {name: "rally-italia-sardegna", id: '68112'},
        'kenya' : {name: "safari-rally-kenya", id: '68112'},
        'safari' : {name: "safari-rally-kenya", id: '68112'},
        'estonia' : {name: "rally-estonia", id: '68114'},
        'belgium' : {name: "renties-ypres-rally-belgium", id: '69179'},
        'ypres' : {name: "renties-ypres-rally-belgium", id: '69179'},
        'acropolis' : {name: "eko-acropolis-rally-of-gods", id: '71264'},
        'greece' : {name: "eko-acropolis-rally-of-gods", id: '71264'},
        'finland' : {name: "secto-rally-finland", id: '68115'},
        'catalunya' : {name: "rallyracc-catalunya-costa-daurada", id: '68118'},
        'monza' : {name: "forum8-aci-rally-monza", id: '72918'},
    },

    '2020' : {
        'monte' : {name: "rallye-automobile-de-monte-carlo", id: '59972'},
        'sweden' : {name: "rally-sweden", id: '60140'},
        'mexico' : {name: "rally-guanajuato-mexico", id: '60429'},
        'estonia' : {name: "rally-estonia", id: '61497'},
        'turkey' : {name: "rally-turkey-marmaris", id: '60436'},
        'sardinia' : {name: "rally-italia-sardegna", id: '60433'},
        'monza' : {name: "aci-rally-monza", id: '66881'},
    },

    '2019' : {
        'monte' : {name: "rallye-automobile-de-monte-carlo", id: '52398'},
        'sweden' : {name: "rally-sweden", id: '53052'},
        'mexico' : {name: "rally-guanajuato-mexico", id: '54450'},
        'corsica' : {name: "corsica-linea-tour-de-corse", id: '54464'},
        'argentina' : {name: "xion-rally-argentina", id: '54465'},
        'chile' : {name: "copec-rrally-chile", id: '54463'},
        'portugal' : {name: "vodafone-rally-de-portugal", id: '54466'},
        'sardinia' : {name: "rally-italia-sardegna", id: '54467'},
        'estonia' : {name: "shell-helix-rally-estonia", id: '54910'},
        'finland' : {name: "neste-rally-finland", id: '54468'},
        'germany' : {name: "adac-rallye-deutschland", id: '54469'},
        'turkey' : {name: "rally-turkey-marmaris", id: '54470'},
        'wales' : {name: "wales-rally-gb", id: '54471'},
        'catalunya' : {name: "rallyracc-catalunya-costa-daurada", id: '54472'}
    },
    
    '2018' : {
        'monte' : {name: "rallye-automobile-de-monte-carlo", id: '42870'},
        'sweden' : {name: "rally-sweden", id: '42875'},
        'mexico' : {name: "rally-guanajuato-mexico", id: '44257'},
        'corsica' : {name: "corsica-linea-tour-de-corse", id: '44258'},
        'argentina' : {name: "ypf-rally-argentina", id: '44259'},
        'portugal' : {name: "vodafone-rally-de-portugal", id: '44260'},
        'sardinia' : {name: "rally-italia-sardegna", id: '44261'},
        'finland' : {name: "neste-rally-finland", id: '44262'},
        'germany' : {name: "adac-rallye-deutschland", id: '44263'},
        'turkey' : {name: "rally-turkey-marmaris", id: '44264'},
        'wales' : {name: "dayinsure-wales-rally-gb", id: '43469'},
        'catalunya' : {name: "rallyracc-catalunya-costa-daurada", id: '44265'},
        'australia' : {name: "kennards-hire-rally-australia", id: '44266'},
    },

    '2017' : {
        'monte' : {name: "rallye-automobile-de-monte-carlo", id: '35143'},
        'sweden' : {name: "rally-sweden", id: '35751'},
        'mexico' : {name: "rally-guanajuato-mexico", id: '36014'},
        'corsica' : {name: "che-guevara-energy-drink-tour-de-corse", id: '36015'},
        'argentina' : {name: "ypf-rally-argentina", id: '36016'},
        'portugal' : {name: "vodafone-rally-de-portugal", id: '36017'},
        'sardinia' : {name: "rally-italia-sardegna", id: '36018'},
        'poland' : {name: "orlen-rally-poland", id: '36431'},
        'finland' : {name: "neste-rally-finland", id: '36019'},
        'germany' : {name: "adac-rallye-deutschland", id: '36020'},
        'catalunya' : {name: "rallyracc-catalunya-costa-daurada", id: '36021'},
        'wales' : {name: "dayinsure-wales-rally-gb", id: '36022'},
        'australia' : {name: "kennards-hire-rally-australia", id: '36023'},
    },

    '2016' : {
        'monte' : {name: "rallye-automobile-de-monte-carlo", id: '25982'},
        'sweden' : {name: "rally-sweden", id: '26241'},
        'mexico' : {name: "rally-guanajuato-mexico", id: '27501'},
        'argentina' : {name: "ypf-rally-argentina", id: '27493'},
        'portugal' : {name: "vodafone-rally-de-portugal", id: '27503'},
        'sardinia' : {name: "rally-italia-sardegna", id: '27500'},
        'poland' : {name: "pzm-rajd-polski-rally-poland", id: '27502'},
        'finland' : {name: "neste-rally-finland", id: '27496'},
        'germany' : {name: "adac-rallye-deutschland", id: '27498'},
        'corsica' : {name: "che-guevara-energy-drink-tour-de-corse", id: '27497'},
        'catalunya' : {name: "rallyracc-catalunya-costa-daurada", id: '27504'},
        'wales' : {name: "dayinsure-wales-rally-gb", id: '27499'},
        'australia' : {name: "kennards-hire-rally-australia", id: '27494'},
    },

    '2015' : {
        'monte' : {name: "rallye-automobile-de-monte-carlo", id: '18216'},
        'sweden' : {name: "rally-sweden", id: '19120'},
        'mexico' : {name: "rally-guanajuato-mexico", id: '19121'},
        'argentina' : {name: "xion-rally-argentina", id: '19122'},
        'portugal' : {name: "vodafone-rally-de-portugal", id: '19123'},
        'sardinia' : {name: "rally-italia-sardegna", id: '19124'},
        'poland' : {name: "lotos-rally-poland-rajd-polski", id: '19125'},
        'finland' : {name: "neste-oil-rally-finland", id: '19126'},
        'germany' : {name: "adac-rallye-deutschland", id: '19127'},
        'australia' : {name: "coates-hire-rally-australia", id: '19128'},
        'corsica' : {name: "tour-de-corse", id: '19499'},
        'catalunya' : {name: "rallyracc-catalunya-costa-daurada", id: '19130'},
        'wales' : {name: "wales-rally-gb", id: '19132'},
        
    },

    '2014' : {
        'monte' : {name: "rallye-automobile-de-monte-carlo", id: '13442'},
        'sweden' : {name: "rally-sweden", id: '13892'},
        'mexico' : {name: "rally-guanajuato-mexico", id: '13893'},
        'portugal' : {name: "vodafone-rally-de-portugal", id: '13894'},
        'argentina' : {name: "xion-rally-argentina", id: '13895'}, 
        'sardinia' : {name: "rally-italia-sardegna", id: '13896'},
        'poland' : {name: "lotos-rally-poland-rajd-polski", id: '13897'},
        'finland' : {name: "neste-oil-rally-finland", id: '13898'},
        'germany' : {name: "adac-rallye-deutschland", id: '13899'},
        'australia' : {name: "coates-hire-rally-australia", id: '13900'},
        'alsace' : {name: "rallye-de-france-alsace", id: '13901'},
        'catalunya' : {name: "rallyracc-catalunya-costa-daurada", id: '13902'},
        'wales' : {name: "wales-rally-gb", id: '13903'},
        
    }
}

}



