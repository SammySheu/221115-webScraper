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
        await page.goto('https://www.ifsc-climbing.org/index.php/world-competition/last-result');
        await delay(3000);
        const component = await page.$('iframe.jch-lazyloaded');
        await delay(3000);

        //Extract data from frame document
        let frame = await component.contentFrame();
        await delay(3000);
        
        const years = await frame.$('#years');
        await years.select('2021');
        await delay(3000);

        const indexes = await frame.$('#indexes');
        await indexes.select('/api/v1/season_leagues/404');
        await delay(3000);

        info.push('2021');
        const eventArray = await frame.evaluate( () => {
            const eventNode = document.querySelector('#events');

            let array = [];
            for(let i=1; i<eventNode.children.length; i++){
                array[i-1] = new Array(2);
                array[i-1][0] = eventNode.children[i].value;
                array[i-1][1] = eventNode.children[i].textContent;
                // array.push(eventNode.children[i].value + ' ' + eventNode.children[i].textContent);
                // console.log(eventNode.children[i].value);
            }
            return array;
        })
        console.log(eventArray);
        console.log(eventArray.length);

        let data = [];
        let eventNumber = 0;
        const events = await frame.$('#events');
        const categories = await frame.$('#categories');
        for(let i=0; i<eventArray.length; i++){
            await events.select(eventArray[i][0]);
            await delay(3000);
            console.log(`examine i = ${i} ${eventArray[i][0]}`);
            
            const eventCategory = await frame.evaluate(  () => {
                const stringToLook = document.querySelector('#categories');
                
                for(let j=1; j<stringToLook.children.length; j++){
                    
                    if(stringToLook.children[j].textContent.includes('BOULDER Women')) 
                        return stringToLook.children[j].value;
                }
            });
            console.log(eventCategory);
            if(eventCategory){
                await categories.select(eventCategory);
                await delay(3000);

                data[eventNumber] = await frame.evaluate( () => {
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
                await fs.writeFile(`./data-${eventArray[i][1]}.txt`, JSON.stringify(data[eventNumber], null, 2) , 'utf-8');
                console.log(eventArray[i][0]);
                eventNumber++;
            }
        }
        
        

        // After select dropdown menu, save data into ./data.txt
        // const data = await frame.evaluate( () => {
        //     const tableNode = document.querySelector('#table_id > tbody');
        //     let dataJson = [];
        //     for(let i=0 ; i<tableNode.children.length ; i++){
        //         const rank = tableNode.children[i].children[0].children[0].textContent;
        //         const name = tableNode.children[i].children[1].children[0].textContent;
        //         dataJson.push({rank, name});
        //     }
        //     return dataJson;
        // }) ;
        
        // await fs.writeFile('./data.txt', JSON.stringify(data, null, 2) , 'utf-8');
        // console.log(data);
        
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

