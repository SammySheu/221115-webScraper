const fs = require('fs/promises');


(async () => {
    let title = ['lead', 'boulder', 'speed'];
    let data = [];
    for(let i=0; i<3; i++){
        data[i] = await fs.readFile(`./data-${title[i]}-2019.txt`, { encoding: 'utf8' });
        data[i] = JSON.parse(data[i]);
    }
    console.log(data);
    let finalData = [];
    for(let i=0; i<data[0].length; i++){
        let person = new Object();
        person.fullname = data[0][i].name;
        person.leadRank = data[0][i].rank;
        for(let j=0; j<data[1].length; j++){
            if(data[1][j].name === data[0][i].name){
                person.boulderRank = data[1][j].rank;
                break;
            }
        }
        for(let k=0; k<data[2].length; k++){
            if(data[2][k].name === data[0][i].name){
                person.speedRank = data[2][k].rank;
                break;
            }
        }
        person.combinedPoint = person.leadRank * person.boulderRank * person.speedRank;
        console.log(person);
        // break;
    }

})();