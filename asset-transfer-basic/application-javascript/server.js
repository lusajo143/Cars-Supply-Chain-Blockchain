var http = require('http');
var fs = require('fs');

'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');

const channelName = 'mychannel';
const chaincodeName = 'basic';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'appUser';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}


function decodePost(data) {
    var obj = data.toString().split('&');

    json = {};


    obj.forEach(element => {
        var elementData = element.split('=');
        var key = elementData[0];
        var value = elementData[1];
        json[key] = value;
    });

    return JSON.stringify(json);
}


async function main() {
	try {
		
            let server = http.createServer(async function(req, res){
                if (req.method == "GET") {
                    if ('/') {
                        fs.readFile('home.htm', function(err, data) {
                            res.writeHead(200, {'Content-Type': 'text/html'});
                            res.write(data);
                            return res.end();
                          });
                    } else if (req.url === '/register') {
                        // build an in memory object with the network configuration (also known as a connection profile)
                        const ccp = buildCCPOrg1();
    
                        // build an instance of the fabric ca services client based on
                        // the information in the network configuration
                        const caClient = buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');
    
                        // setup the wallet to hold the credentials of the application user
                        const wallet = await buildWallet(Wallets, walletPath);
    
                        // in a real application this would be done on an administrative flow, and only once
                        await enrollAdmin(caClient, wallet, mspOrg1);
    
                        // in a real application this would be done only when a new user was required to be added
                        // and would be part of an administrative flow
                        await registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');
    
                        // Create a new gateway instance for interacting with the fabric network.
                        // In a real application this would be done as the backend server session is setup for
                        // a user that has been verified.
                        const gateway = new Gateway();
    
                        try {
                            // setup the gateway instance
                            // The user will now be able to create connections to the fabric network and be able to
                            // submit transactions and query. All transactions submitted by this gateway will be
                            // signed by this user using the credentials stored in the wallet.
                            await gateway.connect(ccp, {
                                wallet,
                                identity: org1UserId,
                                discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
                            });
    
                            // Build a network instance based on the channel where the smart contract is deployed
                            const network = await gateway.getNetwork(channelName);
    
                            // Get the contract from the network.
                            const contract = network.getContract(chaincodeName);
    
                            console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
                            await contract.submitTransaction('InitLedger');
                            console.log('*** Result: committed');
                            
                            res.writeHead(200, {'Content-Type':'text/html'});
                            res.write("<html><body>Done Registration</body></html>")
                            res.end();
                        } finally {
    
                        }
                    } else if (req.url === '/add') {
                        const ccp = buildCCPOrg1();
    
                        const gateway = new Gateway();
    
                        const wallet = await Wallets.newFileSystemWallet(walletPath);
    
                        try {
                            // setup the gateway instance
                            // The user will now be able to create connections to the fabric network and be able to
                            // submit transactions and query. All transactions submitted by this gateway will be
                            // signed by this user using the credentials stored in the wallet.
                            await gateway.connect(ccp, {
                                wallet,
                                identity: org1UserId,
                                discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
                            });
    
                            // Build a network instance based on the channel where the smart contract is deployed
                            const network = await gateway.getNetwork(channelName);
    
                            // Get the contract from the network.
                            const contract = network.getContract(chaincodeName);
    
                            console.log('\n--> Add transaction ___________');
                            const result = await contract.submitTransaction('addOEM', 'BMW', "0", 'images/bmw.jpg', 'Tanzania', 'https://www.bmw.org','Dodoma');
                            console.log('*** Result 12233: committed');
                            if (`${result}` !== '') {
                                console.log(`*** Result: ${prettyJSONString(result.toString())}`);
                            }
                            res.writeHead(200, {'Content-Type':'application/json'});
                            res.write(result.toString());
                            res.end();
                    } catch (error){
                        console.error(error);
                    }
                    } else if (req.url === '/get') {
                        const ccp = buildCCPOrg1();
    
                        const gateway = new Gateway();
    
                        const wallet = await Wallets.newFileSystemWallet(walletPath);
    
                        try {
                            // setup the gateway instance
                            // The user will now be able to create connections to the fabric network and be able to
                            // submit transactions and query. All transactions submitted by this gateway will be
                            // signed by this user using the credentials stored in the wallet.
                            await gateway.connect(ccp, {
                                wallet,
                                identity: org1UserId,
                                discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
                            });
    
                            // Build a network instance based on the channel where the smart contract is deployed
                            const network = await gateway.getNetwork(channelName);
    
                            // Get the contract from the network.
                            const contract = network.getContract(chaincodeName);
    
    
                            console.log('\n--> Evaluate Transaction');
                            const result1 = await contract.evaluateTransaction('getOEM', 'Toyota');
                            console.log(`*** Result********: ${prettyJSONString(result1.toString())}`);
            
    
                            res.writeHead(200, {'Content-Type':'application/json'});
                            res.write(result1.toString());
                            res.end();
                        } catch (error){
                            console.error(error);
                        }
                    }
                } else if (req.method == 'POST') {
                    if (req.url === '/gett') {
                        var body = '';
                        req.on('data', function (data){
                            body += data;
                            body = JSON.parse(decodePost(body));
                        });
                        
                        console.log(body);

                        res.end();
                    }
                }
            });

            server.listen(5000);
            console.log("Server is listening...")
			

			// console.log('\n--> Evaluate Transaction: ReadAsset, function returns an asset with a given assetID');
			// result = await contract.evaluateTransaction('ReadAsset', 'asset13');
			// console.log(`*** Result: ${prettyJSONString(result.toString())}`);
			// console.log('\n--> Evaluate Transaction');
			// const result1 = await contract.evaluateTransaction('getTransaction', 'dodoma');
			// console.log(`*** Result********: ${prettyJSONString(result1.toString())}`);

			// console.log('\n--> Evaluate Transaction: AssetExists, function returns "true" if an asset with given assetID exist');
			// result = await contract.evaluateTransaction('AssetExists', 'asset1');
			// console.log(`*** Result: ${prettyJSONString(result.toString())}`);

			// console.log('\n--> Submit Transaction: UpdateAsset asset1, change the appraisedValue to 350');
			// await contract.submitTransaction('UpdateAsset', 'asset1', 'blue', '5', 'Tomoko', '350');
			// console.log('*** Result: committed');
			// console.log('\n--> Submit Transaction: UpdateAsset asset1, change the appraisedValue to 350');
			// const resultUpdate = await contract.submitTransaction('updateTransaction', 'dodoma');
			// console.log('*** Result: committed');
			// console.log(`*** ResultUpdate ${prettyJSONString(resultUpdate.toString())}`);


	} catch (error) {
		console.error(`******** FAILED to run the application: ${error}`);
	}
}

main();
