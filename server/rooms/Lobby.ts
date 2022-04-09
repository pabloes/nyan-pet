import { Room } from "colyseus";
import { Schema, ArraySchema, MapSchema, type } from "@colyseus/schema";
import { getUserNyanCats } from "./voxters-service";
//int16 32,767
//uint24 
const choiceMap = {};//publicKey - catId
class Vector3 extends Schema {
    @type('int16')
    x = -1;
    @type('int16')
    y = -1;
    @type('int16')
    z = -1;
}

class SupporterPlayer extends Schema {
    @type(Vector3)
    playerPosition = new Vector3();

    @type('uint32')
    tokenId;

    @type('string')
    name;

    @type(["number"])
    tokenIds;

    publicKey:string;
    
    constructor(tokenId:number, name, tokenIds:number[], publicKey){
        super();
        this.tokenId = tokenId;
        this.name = name;
        this.tokenIds = new ArraySchema<number>(...tokenIds);
        this.publicKey = publicKey;
    }
}

class State extends Schema {
    //represents 1 machine
    
    //currentPlayer (id, name, sessionId)
    //currentMinigame (id, startedAt)
    @type({ map: SupporterPlayer })    
    supporters = new MapSchema<SupporterPlayer>();
}

export class VoxtersLobby extends Room<State> {
    private realm;
    private land;
    onCreate({realm, user, land}){
        console.log("created nyan-pet lobby room", user.diplayName, realm, land);
        this.realm = realm;
        this.land = land;
        this.setState(new State());
        this.onMessage(1, (client, {x,y,z})=>{
           const supporter = this.state.supporters.get(client.sessionId);                     
           Object.assign(supporter.playerPosition, {x,y,z});           
        });

        this.onMessage("switch", (client)=>{
            const supporterPlayer = this.state.supporters.get(client.sessionId);
            console.log("switch", client.sessionId, supporterPlayer.toJSON(), supporterPlayer.tokenIds);
            const currentIndex = supporterPlayer.tokenIds.indexOf(supporterPlayer.tokenId);
            if(currentIndex === -1 || currentIndex >= supporterPlayer.tokenIds.length-1){
                supporterPlayer.tokenId = supporterPlayer.tokenIds[0];
            }else{
                supporterPlayer.tokenId = supporterPlayer.tokenIds[currentIndex+1];
            }
            choiceMap[supporterPlayer.publicKey] = supporterPlayer.tokenId;
        });
    }

    async onJoin(client, {realm, user, land}){
        console.log("joined nyan-pet lobby room", user.displayName, realm, land);
        const {publicKey, hasConnectedWeb3, userId, displayName} = user;
        //TODO check async if the player owns voxter helmet
        const userNyanCats = await getUserNyanCats(user);
        
        if(userNyanCats?.length){ 
            const defaultCatID = Number(choiceMap[publicKey]);  
            const selectedCatId = Number(~userNyanCats.indexOf(defaultCatID)
                ? defaultCatID
                : userNyanCats[0]);

            client.send('hasVoxter', selectedCatId);
            choiceMap[publicKey] = selectedCatId;
            this.state.supporters.set(client.sessionId, new SupporterPlayer(selectedCatId, displayName, userNyanCats, publicKey));
        }
    }

    onLeave(client, consented){
        console.log("onLeave lobby", consented);
        this.state.supporters.delete(client.sessionId);
    }

    onDispose(){
        console.log("onDispose");        
    }
}