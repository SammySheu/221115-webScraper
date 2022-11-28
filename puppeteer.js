const puppeteer = require('puppeteer');
const fs = require('fs/promises');

async function getIFSCdataWithPuppeteer(){
    try{
        //Init Puppeteer
        let info = [];
        const browser = await puppeteer.launch(
            {
                headless: false,
                slowMol: 200,
            // args: ['--disable-features=site-per-process'],
            }
        );
        const page = await browser.newPage();
        await page.goto('https://www.ifsc-climbing.org/index.php/world-competition/ranking');
        await delay(3000);
        
        const component = await page.$('iframe.jch-lazyloaded');
        await delay(3000);
        

        //Extract data from frame document
        let frame = await component.contentFrame();
        await delay(3000);
        

        const years = await frame.$('#years');
        await years.select('2019');
        await delay(3000);

        const title = ['lead', 'boulder', 'speed'];
        // await frame.click(`#speed-women`);
        // for(let i=1; i<3; i++){
            let i=1;
            console.log('Now go to a new page');
            const [newPage] = await Promise.all([
                new Promise(resolve => page.once('popup', resolve)),
                frame.click(`#${title[i]}-women`),
            ]);
            console.log(newPage.url());
            await delay(3000);
            
            const newComponent = await newPage.$('#calendar');
            await delay(3000);
            
            //Extract data from frame document
            let newFrame = await newComponent.contentFrame();
            await delay(3000);
    
            let data = [];
            
            data = await newFrame.evaluate( () => {
                const tableNode = document.querySelector('#table_id > tbody');
                console.log(tableNode);
                let dataJson = [];
                for(let j=0 ; j<tableNode.children.length-2 ; j++){
                    const rank = tableNode.children[j].children[0].children[0].textContent;
                    const name = tableNode.children[j].children[1].children[0].textContent + ' ' + tableNode.children[j].children[2].children[0].textContent;
                    dataJson.push({rank, name});
                }
                return dataJson;
            }) ;
            console.log(data);
            
            await fs.writeFile(`./data-${title[i]}-2019.txt`, JSON.stringify(data, null, 2) , 'utf-8');
            await newPage.close();
        // }
        
        
    } catch(error){
        console.log(error);
    }
    function delay(timeout) {
        return new Promise((resolve) => {
          setTimeout(resolve, timeout);
        });
      }
}

// module.exports = getIFSCdataWithPuppeteer;
getIFSCdataWithPuppeteer();

