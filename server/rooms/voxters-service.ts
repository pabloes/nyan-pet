require('dotenv').config()
import Web3 from "web3";
import nyanAbi from "./contract/nyan.abi";
import hazyAbi from "./contract/hazy.abi";
const nyanAddress = "0xB32979486938AA9694BFC898f35DBED459F44424";
const aokiNyanAddress = "0xa4d8f0ac7af275f7e87d071ab1bd87a524b0007f";
const hazyAddress = "0xff6889ea7d06137edd949f8381a14f0ffc39ba80";

const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`);
const nyanContract = new web3.eth.Contract(nyanAbi as any, nyanAddress);
const aokiContract = new web3.eth.Contract(nyanAbi as any, aokiNyanAddress);
const hazyContract = new web3.eth.Contract(hazyAbi as any, hazyAddress);
const nyanCatIds = [2, 7, 9, 10, 12, 13, 17, 19, 20, 219, 576, 10021, 10022, 10023, 10024, 10026, 10054, 10055, 10056, 10057, 10058, 10063, 10065, 52552];

export const getUserNyanCats = async ({hasConnectedWeb3, publicKey}) => {
    if(hasConnectedWeb3){
        const nyanIds = await getIds(publicKey, nyanContract, nyanCatIds)
        const hasNyanAoki = (await getIds(publicKey, aokiContract, [1])).length;
        const hasHazy = Number(await getBalance(publicKey, hazyContract));
        console.log("hasHazy",hasHazy, typeof hasHazy);
        const result = [...nyanIds];
        if(hasNyanAoki){
            result.push(10058);
        }
        if(hasHazy){
            result.push(42069);//TODO
        }
        return result;
    }else{
        return [];
    }
}

export async function getBalance(publicKey, contract){
    return await contract.methods.balanceOf(publicKey).call();
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