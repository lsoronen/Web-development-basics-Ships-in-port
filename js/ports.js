const ports = {
    "Hamina": "Haminan_Satama",
    "Helsinki": "Helsingin_Satama",
    "Kemi": "Kemin_satama",
    "Kokkola": "Kokkolan_satama",
    "Kotka": "Kotkan_Satama",
    "Oulu": "Oulun_satama",
    "Raahe": "Raahen_satama",
    "Turku": "Turun_satama"
  };
  
  async function translateText(text, sourceLang = 'fi', targetLang = 'en') {
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        const result = await response.json();
        return result[0].map(item => item[0]).join('');
    } catch (error) {
        console.log("Failed to translate " + text)
    }
  }
  
  async function fetchPortSummaries() {
    for (const [name, wikiPage] of Object.entries(ports)) {
      try {
        const summaryUrl = `https://fi.wikipedia.org/api/rest_v1/page/summary/${wikiPage}`;
        const response = await fetch(summaryUrl);
        if (!response.ok) throw new Error(`Failed to fetch ${name}`);
  
        const data = await response.json();
        const originalExtract = data.extract;
        const translatedExtract = await translateText(originalExtract);
        const link = data.content_urls.desktop.page;
  
        const articles = document.querySelectorAll('#main article');
        for (const article of articles) {
          const h3 = article.querySelector('h3');
          if (h3 && h3.textContent.trim() === `Port of ${name}`) {
            const p = article.querySelector('p');
            if (p) {
              p.innerHTML = translatedExtract //`${translatedExtract}`;

                const linkElement = document.createElement('a');
                linkElement.href = link;
                linkElement.target = '_blank';
                linkElement.textContent = 'Article in Wikipedia';

                p.insertAdjacentElement('afterend', linkElement);
            }
            break;
          }
        }
      } catch (error) {
        console.error(`Error fetching info for ${name}:`, error);
      }
    }
  }
  
  document.addEventListener('DOMContentLoaded', fetchPortSummaries);