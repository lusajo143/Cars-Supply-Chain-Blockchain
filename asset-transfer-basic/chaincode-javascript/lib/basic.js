'use strict';

const { Contract } = require('fabric-contract-api');


class basic extends Contract {

    async InitLedger(ctx){
        const data = {
            From: 'init',
            To: 'init',
            Time: 'init',
            Amount: 0,
            Id: 'init'
        }

        await ctx.stub.putState("init", Buffer.from(JSON.stringify(data)));
        
        console.log("Added sucessfully...");
    }

    async addTransaction(ctx, id, from, to, amount, time) {
        const data = {
            From: from,
            To: to,
            Amount: amount,
            Time: time,
            Id: id
        };

        await ctx.stub.putState(id ,Buffer.from(JSON.stringify(data)));
        console.log("Added ******");

        return JSON.stringify(data);

    }

    async getTransaction(ctx, id) {
        const dataJson = await ctx.stub.getState(id);

        if (!dataJson || dataJson.length === 0) {
            throw new Error("Failed");
        }

        return dataJson.toString();
    }

    async updateTransaction(ctx, id) {
        const rdata = await ctx.stub.getState(id);

        if (!rdata || rdata.length === 0) {
            throw new Error("Failed to load data");
        }

        const jdata = JSON.parse(rdata.toString());

        const data = {
            From: jdata.To,
            To: jdata.From,
            Time: jdata.Time,
            Amount: jdata.Amount,
            Id: id
        };

        await ctx.stub.putState(id,Buffer.from(JSON.stringify(data)));

        return data.toString();
    }


}

module.exports = basic;