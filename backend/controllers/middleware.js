const Web3 = require('web3');
const cwr = require('../utils/createWebResponse');
const axios = require("axios");
const header = async (res) => {
  const Header = res.setHeader('Content-Type', 'application/json');
  return Header;
}
global.header = header;

const etherscan = async (req, res, next) => {
  try {
    const endpoint =
      req.body.endpoint?.trim() ||
      req.query.endpoint?.trim() ||
      req.params.endpoint?.trim;

    req.etherscan = require('etherscan-api').init(
      process.env.ETHERSCAN_API_KEY,
      endpoint,
      Number(process.env.QUERY_TIMEOUT),
    );
    next();
  } catch (e) {
    return cwr.errorWebResp(res, 500, `E0000 - etherscan`, e.message);
  }
};


const web3 = async (req, res, next) => {
  try {
    req.endpoint = req.body.endpoint?.trim() || req.query.endpoint?.trim();
    const parseEndpoint = switchBaseUrl(req.endpoint, 'rpc');
    req.httpProvider = new Web3.providers.HttpProvider(parseEndpoint);
    req.web3 = new Web3(req.httpProvider);
    let network = await req.web3.eth.net.getNetworkType();
    if (network === 'main') {
      network = 'mainnet';
    }
    req.network = network;
    next();
  } catch (e) {
    return cwr.errorWebResp(res, 500, `E0000 - infuraBaseUrl`, e.message);
  }
};

const switchBaseUrl = (network, protocol) => {
  if (ethereumChainIDs[network])
    return ethereumEndpoint(network, protocol) + process.env.INFURA_PROJECT_ID;
  return network;
};

const ethereumEndpoint = (network, protocol) => {
  if (protocol === 'rpc') return `https://${network}.infura.io/v3/`;
  return undefined;
};


/*
const callblock = () => {
  network = ['mainnet','ropsten','kovan','rinkeby','goerli']
  for(let i = 0; i < 5; i++){
    axios.post('http://localhost:5000/eth/network/postblockinfo',
      {
        endpoint: network[i],
        blockn: "6500"
      }
    )
      .then(function (response) {
      })
      .catch(function (error) {
        console.log(error);
      });
  }}

callblock();
setInterval(function(){
  callblock();
}, 600000);// 30분에 한 번씩 호출
*/



const ethereumChainIDs = {
  mainnet: 1,
  ropsten: 3,
  rinkeby: 4,
  goerli: 5,
  kovan: 42,
};


module.exports = {
  etherscan,
  web3
};