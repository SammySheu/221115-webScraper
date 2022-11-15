const puppeteer = require('puppeteer');
const fs = require('fs/promises');

async function getIFSCdataWithPuppeteer(){
    try{
        //Init Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://www.ifsc-climbing.org/index.php/world-competition/last-result');
        const component = await page.$('iframe.jch-lazyloaded');
        await delay(3000);

        //Extract data from frame document
        let frame = await component.contentFrame();
        
        const years = await frame.$('#years');
        await years.select('2022');
        await delay(3000);

        const indexes = await frame.$('#indexes');
        await indexes.select('/api/v1/season_leagues/404');
        await delay(3000);

        const events = await frame.$('#events');
        await events.select('/api/v1/events/1233');
        await delay(3000);

        const categories = await frame.$('#categories');
        await categories.select('/api/v1/events/1233/result/7');
        await delay(3000);
        

        // After select dropdown menu, save data into ./data.txt
        const data = await frame.evaluate( () => {
            const tableNode = document.querySelector('#table_id > tbody');
            let dataJson = [];
            for(let i=0 ; i<tableNode.children.length ; i++){
                const rank = tableNode.children[i].children[0].children[0].textContent;
                const name = tableNode.children[i].children[1].children[0].textContent;
                dataJson.push({rank, name});
            }
            return dataJson;
        }) ;
        
        await fs.writeFile('./data.txt', JSON.stringify(data, null, 2) , 'utf-8');
        console.log(data);
        
    } catch(error){
        console.log(error);
    }
    function delay(timeout) {
        return new Promise((resolve) => {
          setTimeout(resolve, timeout);
        });
      }
}

module.exports = getIFSCdataWithPuppeteer;
// getIFSCdataWithPuppeteer();

