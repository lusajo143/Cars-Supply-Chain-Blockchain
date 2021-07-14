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

        const cars = [
            {
                ID: 'car1',
                OEM: 'Toyota',
                Model: 'Mark II Grand',
                Year: 2007,
                Status: 'Not owned',
                Country: 'Japan'
            },
            {
                ID: 'car2',
                OEM: 'Volvo',
                Model: 'C 40',
                Year: 2020,
                Status: 'Not owned',
                Country: 'Germany'
            },
            {
                ID: 'car3',
                OEM: 'Toyota',
                Model: 'Mark II Grand',
                Year: 2007,
                Status: 'Not owned',
                Country: 'Japan'
            },
            {
                ID: 'car4',
                OEM: 'Toyota',
                Model: 'Mark II Grand',
                Year: 2007,
                Status: 'Not owned',
                Country: 'Japan'
            }
        ];

        for (const _oem of _oems) {
            _oem.docType = '_oem';
            await ctx.stub.putState(_oem.ID, Buffer.from(JSON.stringify(_oem)));
            console.log('${_oem.ID} was initialized');
        }

        for (const _car of cars) {
            _car.docType = '_car';
            await ctx.stub.putState(_car.ID, Buffer.from(JSON.stringify(_car)));
            console.log('${_car.ID} was inititialized');
        }

        // Add Admin user
        const _admin = {
            ID: 'admin',
            Username: 'Lusajo',
            Password: 'Menard'
        }

        await ctx.stub.putState(_admin.ID, Buffer.from(JSON.stringify(_admin)))
        console.log("Added Admin user successfully...")
        
    }

    async authenticateAdmin(ctx, username, password) {
        const _data = ctx.stub.getState('admin')

        if (!_data || _data.length === 0) {
            throw new Error("Failed to authenticate admin")
        }

        if (_data.Username === username && _data.Password === password)
            return "true"
        else
            return "false"
        
    }

    async addCar(ctx, id, oem, model, year, status, country) {
        const _car = {
            ID: id,
            OEM: oem,
            Model: model,
            Year: year,
            Status: status,
            Country: country
        }


        await ctx.stub.putState(_car.ID, Buffer.from(JSON.stringify(_car)))

        console.log('Added new car (${_car})')
        return JSON.stringify(_car)
    }

    async getCar(ctx, id){
        const carJson = await ctx.stub.getState(id)

        if (!carJson || carJson.length === 0) {
            throw new Error("Failed to get car")
        }

        return carJson.toString()
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