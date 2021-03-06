#!/usr/bin/bash

clear

./network.sh down
echo "******************************************************************************************"
echo "                                   CREATING A NETWORK"
echo "******************************************************************************************"
./network.sh up -ca
echo "******************************************************************************************"
echo "                                   CREATING A CHANNEL"
echo "******************************************************************************************"
./network.sh createChannel
echo "******************************************************************************************"
echo "                                   DEPLOYING A CHAINCODE"
echo "******************************************************************************************"
./network.sh deployCC -ccn basic -ccp ../asset-transfer-basic/chaincode-javascript/ -ccv 1.0 -ccl javascript

