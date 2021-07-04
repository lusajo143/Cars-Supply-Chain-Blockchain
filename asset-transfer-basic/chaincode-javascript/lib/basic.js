// 'use strict';

// const { Contract } = require('fabric-contract-api');


// class basic extends Contract {
    
//     async InitLedger(ctx) {
//         const _oems = [
//             {
//                 ID: 'Toyota',
//                 Counts: 0,
//                 Image: 'images/toyota.png',
//                 Country: 'Tanzania',
//                 Website: 'https://www.toyota.com',
//                 HQ: 'Dar es salaam'
//             },
//             {
//                 ID: 'Subaru',
//                 Counts: 0,
//                 Image: 'images/subaru.jpeg',
//                 Country: 'Uganda',
//                 Website: 'https://www.subaru.org',
//                 HQ: 'Somewhere'
//             },
//             {
//                 ID: 'Volvo',
//                 Counts: 0,
//                 Image: 'images/volvo.jpeg',
//                 Country: 'Tanzania',
//                 Website: 'https://www.volvo.com',
//                 HQ: 'Dar es salaam'
//             },
//             {
//                 ID: 'BMW',
//                 Counts: 0,
//                 Image: 'images/bmw.jpg',
//                 Country: 'Tanzania',
//                 Website: 'https://www.bmw.com',
//                 HQ: 'Dodoma'
//             }
//         ];

//         for (const _oem of _oems) {
//             _oem.docType = '_oem';
//             await ctx.stub.putState(_oem.ID, Buffer.from(JSON.stringify(_oem)));
//             console.log('${_oem.ID} was initialized');
//         }

//     }

// }

// exports.module = basic;


'use strict';

const { Contract } = require('fabric-contract-api');


class basic extends Contract {

    async InitLedger(ctx){


        const _oems = [
            {
                ID: 'Toyota',
                Counts: 0,
                Image: 'images/toyota.png',
                Country: 'Tanzania',
                Website: 'https://www.toyota.com',
                HQ: 'Dar es salaam'
            },
            {
                ID: 'Subaru',
                Counts: 0,
                Image: 'images/subaru.jpeg',
                Country: 'Uganda',
                Website: 'https://www.subaru.org',
                HQ: 'Somewhere'
            },
            {
                ID: 'Volvo',
                Counts: 0,
                Image: 'images/volvo.jpeg',
                Country: 'Tanzania',
                Website: 'https://www.volvo.com',
                HQ: 'Dar es salaam'
            }
        ];

        for (const _oem of _oems) {
            _oem.docType = '_oem';
            await ctx.stub.putState(_oem.ID, Buffer.from(JSON.stringify(_oem)));
            console.log('${_oem.ID} was initialized');
        }
        
    }

    async addOEM(ctx, id, counts, image, country, website, hq) {
        const _oem = {
            ID: id,
            Counts: counts,
            Image: image,
            Country: country,
            Website: website,
            HQ: hq
        };

        await ctx.stub.putState(id ,Buffer.from(JSON.stringify(_oem)));
        console.log("Added ******");

        return JSON.stringify(_oem);

    }

    async getOEM(ctx, id) {
        const dataJson = await ctx.stub.getState(id);

        if (!dataJson || dataJson.length === 0) {
            throw new Error("Failed");
        }

        return dataJson.toString();
    }

    // async updateTransaction(ctx, id) {
    //     const rdata = await ctx.stub.getState(id);

    //     if (!rdata || rdata.length === 0) {
    //         throw new Error("Failed to load data");
    //     }

    //     const jdata = JSON.parse(rdata.toString());

    //     const data = {
    //         From: jdata.To,
    //         To: jdata.From,
    //         Time: jdata.Time,
    //         Amount: jdata.Amount,
    //         Id: id
    //     };

    //     await ctx.stub.putState(id,Buffer.from(JSON.stringify(data)));

    //     return data.toString();
    // }


}

module.exports = basic;