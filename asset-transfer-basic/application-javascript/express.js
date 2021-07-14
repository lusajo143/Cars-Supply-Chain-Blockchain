
'use strict';

const { Gateway, Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const path = require('path');
const { buildCAClient, registerAndEnrollUser, enrollAdmin } = require('../../test-application/javascript/CAUtil.js');
const { buildCCPOrg1, buildWallet } = require('../../test-application/javascript/AppUtil.js');
const { count } = require('console');
const { url } = require('inspector');

const channelName = 'mychannel';
const chaincodeName = 'basic';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'appUser';

function prettyJSONString(inputString) {
	return JSON.stringify(JSON.parse(inputString), null, 2);
}


async function addOEM(res,ID, counts, image, country, hq, website) {
    const ccp = buildCCPOrg1();
    
    const gateway = new Gateway();

    const wallet = await Wallets.newFileSystemWallet(walletPath);

    try {
        
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
        const result = await contract.submitTransaction('addOEM', ID, counts, image, country, website,hq);
        console.log('*** Result 12233: committed');
        
        res.writeHead(200, {'Content-Type':'application/json'})
        res.write(result.toString());
        res.end();
        
    } catch (error){
        console.error(error);
    }
}


// async function main() {
// 	try {
		
//             let server = http.createServer(async function(req, res){
//                 if (req.method == "GET") {
//                     if (req.url === '/') {
//                         fs.readFile('web/index.htm', function(err, data) {
//                             res.writeHead(200, {'Content-Type':'text/html'});
//                             res.write(data);
//                             res.end();
//                         });
//                     } else if (req.url == '/get-started') {
//                         fs.readFile('web/get-started.htm', function(err, data) {
//                             res.writeHead(200, {'Content-Type':'text/html'});
//                             res.write(data);
//                             res.end();
//                         });
//                     } else if (req.url == '/web/sign-up') {
//                         fs.readFile('web/sign-up.htm', function(err, data) {
//                             res.writeHead(200, {'Content-Type':'text/html'});
//                             res.write(data);
//                             res.end();
//                         });
//                     } else if (req.url === '/register') {
//                         
//                     } else if (req.url === '/add') {
//                         // dat = [
//                         //     {
//                         //         'name':'lusajo'
//                         //     },
//                         //     {
//                         //         'name':'menard'
//                         //     }
//                         // ];
//                         dat = {
//                             'title':'lusajo'
//                         };
//                         res.writeHead(200, {'Content-Type':'application/json'});
//                         res.write(JSON.stringify(dat));
//                         res.end();

//                     } else if (req.url === '/get') {
//                         const ccp = buildCCPOrg1();
    
//                         const gateway = new Gateway();
    
//                         const wallet = await Wallets.newFileSystemWallet(walletPath);
    
//                         try {
//                             // setup the gateway instance
//                             // The user will now be able to create connections to the fabric network and be able to
//                             // submit transactions and query. All transactions submitted by this gateway will be
//                             // signed by this user using the credentials stored in the wallet.
//                             await gateway.connect(ccp, {
//                                 wallet,
//                                 identity: org1UserId,
//                                 discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
//                             });
    
//                             // Build a network instance based on the channel where the smart contract is deployed
//                             const network = await gateway.getNetwork(channelName);
    
//                             // Get the contract from the network.
//                             const contract = network.getContract(chaincodeName);
    
    
//                             console.log('\n--> Evaluate Transaction');
//                             const result1 = await contract.evaluateTransaction('getOEM', 'Toyota');
//                             console.log(`*** Result********: ${prettyJSONString(result1.toString())}`);
            
    
//                             res.writeHead(200, {'Content-Type':'application/json'});
//                             res.write(result1.toString());
//                             res.end();
//                         } catch (error){
//                             console.error(error);
//                         }
//                     } else if (req.url == '/pic/car1') {
//                         fs.readFile('web/assets/car1.jpg', function(err, data){
//                             res.writeHead(200, {'Content-Type':'image/jpeg'});
//                             res.end(data);
//                         });
//                     } else if (req.url == '/pic/oems') {
//                         fs.readFile('web/assets/oems.jpg', function(err, data){
//                             res.writeHead(200, {'Content-Type':'image/jpeg'});
//                             res.end(data);
//                         });
//                     } else if (req.url == '/pic/owner') {
//                         fs.readFile('web/assets/owner.jpg', function(err, data){
//                             res.writeHead(200, {'Content-Type':'image/jpeg'});
//                             res.end(data);
//                         });
//                     } else if (req.url == '/pic/cowner') {
//                         fs.readFile('web/assets/cowner.jpg', function(err, data){
//                             res.writeHead(200, {'Content-Type':'image/jpeg'});
//                             res.end(data);
//                         });
//                     } else if (req.url == '/pic/transporter') {
//                         fs.readFile('web/assets/transport.jpg', function(err, data){
//                             res.writeHead(200, {'Content-Type':'image/jpeg'});
//                             res.end(data);
//                         });
//                     } else if (req.url == '/pic/factory') {
//                         fs.readFile('web/assets/factory.jpg', function(err, data){
//                             res.writeHead(200, {'Content-Type':'image/jpeg'});
//                             res.end(data);
//                         });
//                     }
//                 } else if (req.method == 'POST') {
//                     if (req.url === '/addOEM') {
//                         var body = '';
//                         req.on('data', function (data){
//                             body += data;
//                             body = JSON.parse(decodePost(body));
//                             // console.log(body);
                            
//                         });
                        
//                         req.on('end', function() {

//                             result = addOEM(res,body.ID, body.counts, body.image, body.country, body.hq, body.website);

//                         });
//                     } else if (req.url == "/web/action/sign-up") {
//                         var body = '';
//                         req.on('data', function (data){
//                             body += data;
//                             body = JSON.parse(decodePost(body));
//                             console.log('reo '+body.Username);
//                         });

//                         req.on('end', function(){
                            
//                             res.writeHead(200, {'Content-Type':'application/json'});
//                             res.write(JSON.stringify(body));
//                             res.end();
//                             console.log(body.Username+" ls");
//                         });

                        
                        
                        
//                     }
//                 }
//             });

//             server.listen(5000);
//             console.log("Server is listening...")
			

// 			// console.log('\n--> Evaluate Transaction: ReadAsset, function returns an asset with a given assetID');
// 			// result = await contract.evaluateTransaction('ReadAsset', 'asset13');
// 			// console.log(`*** Result: ${prettyJSONString(result.toString())}`);
// 			// console.log('\n--> Evaluate Transaction');
// 			// const result1 = await contract.evaluateTransaction('getTransaction', 'dodoma');
// 			// console.log(`*** Result********: ${prettyJSONString(result1.toString())}`);

// 			// console.log('\n--> Evaluate Transaction: AssetExists, function returns "true" if an asset with given assetID exist');
// 			// result = await contract.evaluateTransaction('AssetExists', 'asset1');
// 			// console.log(`*** Result: ${prettyJSONString(result.toString())}`);

// 			// console.log('\n--> Submit Transaction: UpdateAsset asset1, change the appraisedValue to 350');
// 			// await contract.submitTransaction('UpdateAsset', 'asset1', 'blue', '5', 'Tomoko', '350');
// 			// console.log('*** Result: committed');
// 			// console.log('\n--> Submit Transaction: UpdateAsset asset1, change the appraisedValue to 350');
// 			// const resultUpdate = await contract.submitTransaction('updateTransaction', 'dodoma');
// 			// console.log('*** Result: committed');
// 			// console.log(`*** ResultUpdate ${prettyJSONString(resultUpdate.toString())}`);


// 	} catch (error) {
// 		console.error(`******** FAILED to run the application: ${error}`);
// 	}
// }

// main();


async function SignInAdmin(res, username, password) {
    const ccp = buildCCPOrg1();
    
    const gateway = new Gateway();

    const wallet = await Wallets.newFileSystemWallet(walletPath);

    try {
        
        await gateway.connect(ccp, {
            wallet,
            identity: org1UserId,
            discovery: { enabled: true, asLocalhost: true } // using asLocalhost as this gateway is using a fabric network deployed locally
        });

        // Build a network instance based on the channel where the smart contract is deployed
        const network = await gateway.getNetwork(channelName);

        // Get the contract from the network.
        const contract = network.getContract(chaincodeName);

        console.log('\n--> Signing In admin user');
        const result = await contract.submitTransaction('authenticateAdmin', username, password);
        console.log('*** Admin Sign In committed');
        
        if (result) {
            console.log(result)
            console.log(typeof(result))
            res.send('Success')
        } else {
            res.send('Wrond Username or Password')
        }
        
    } catch (error){
        console.error(error);
    }
}



var express = require('express')
var session = require('express-session')

var app = express();

var web = '/web/';

// Mount assets
app.use(express.static('web/'));

// Decode url
app.use(express.urlencoded());

// For handling sessions
app.use(session({
    secret: 'car-key',
    resave: false,
    saveUninitialized: false,
}))

app.set('json spaces', 40);


app.get('/', function(req, res){
    if (!req.session.username) {
        res.sendFile(web+'index.htm',{root: __dirname});
    } else {
        res.sendFile(web+'owners/index.htm', {root: __dirname})
    }
});

app.post('/sign-up', function(req, res, next) {
    if (!req.session.username) {
        req.session.username = 'lusajo'
        res.sendFile(web+'owners/index.htm', {root: __dirname})
    } else {
        res.sendFile(web+'owners/index.htm', {root: __dirname})
    }
})

app.get('/sign-in', function(req, res, next) {
    res.sendFile(web+'sign-in.htm', {root: __dirname})
})

app.get('/head', function(req, res) {
    res.json({'name':'lusajo menard'});
})

app.get('/services_carOwner', function(req, res){
    if (!req.session.username) {
        res.sendFile(web+'index.htm',{root: __dirname});
    } else {
        res.json([
            {'id':1,'name':'View My Cars', 'details':'How healthy is your car?.\nTrace your car timeline from OEM to you.'},
            {'id':2,'name':'Sell Car', 'details': 'Transfer your car ownership to another user.'},
            {'id':3,'name':'View OEMs', 'details':'Know your OEM well before buying a car. Navigate their new products and buy direct from them.'}
        ])
    }
})

async function RegisterUser(res) {
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
        
        res.json({'Result':'Done registration'})
    } finally {

    }
}

app.get('/register-user', function(req, res){
    // if (!req.session.username) {
    //     res.sendFile(web+'index.htm',{root: __dirname});
    // } else {
    //     RegisterUser()
    // }
    RegisterUser(res)
})

app.post('/sign-inAdmin', function(req, res){
    console.log(req.body)
    if (req.body.type === 'Admin')
        SignInAdmin(res, req.body.Username, req.body.Password)
    else
        res.send('No user sign in yet')
        
}) 

app.listen(5000, function() {
    console.log("Server is listening...");
});