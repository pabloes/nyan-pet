require('dotenv').config()
import Web3 from "web3";
import nyanAbi from "./contract/nyan.abi";
const nyanAddress = "0xB32979486938AA9694BFC898f35DBED459F44424";
const aokiNyanAddress = "0xa4d8f0ac7af275f7e87d071ab1bd87a524b0007f";

const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`);
const nyanContract = new web3.eth.Contract(nyanAbi as any, nyanAddress);
const aokiContract = new web3.eth.Contract(nyanAbi as any, aokiNyanAddress);
const nyanCatIds = [2,13,12,10023,10054,19,10026,9,10022,10021,7,17,20,10024,10,52552,219,576,10055,10056,10057, 10058,10063,10065];

export const getUserNyanCats = async ({hasConnectedWeb3, publicKey}) => {
    if(hasConnectedWeb3){
        const nyanIds = await getIds(publicKey, nyanContract, nyanCatIds)
        const hasNyanAoki = (await getIds(publicKey, aokiContract, [1])).length;
        if(hasNyanAoki){
            return Array.from(new Set([...nyanIds, 10058]));
        }else{
            return nyanIds;
        }
    }else{
        return [];
    }
}


async function getIds (publicKey, contract, nyanCatIds) {
    const result = await contract.methods.balanceOfBatch(
        new Array(nyanCatIds.length).fill(publicKey),
        nyanCatIds
    ).call();
    const resultIds = nyanCatIds.reduce((acc, current, index)=>{
        if(Number(result[index])) acc.push(current);
        return acc;
    },[])
    return resultIds;
}