import {initializeVoxtersPet} from "../metas/voxters-pet/src/voxters-pet";

try{
    initializeVoxtersPet();
}catch(err){}


const root = new Entity();
engine.addEntity(root);

const rows = 10;
const columns = 10;

let iR = 0;
let iC = 0;
class UpdateSystem implements ISystem {
    private callback;
    constructor(callback:any){
        this.callback = callback;
        engine.addSystem(this);
    }
    update(dt:number){
        this.callback(dt);
    }
    dispose(){
        this.callback = null;
        engine.removeSystem(this);
    }
}
/* 
var createBenchmarkNyan = (parent:Entity, {position}:any) => {
    const entity = new Entity();
    const shape = new GLTFShape(`metas/voxters-pet/models/nyancat_original.glb`);
    
    entity.addComponent(shape);
    entity.addComponent(new Transform({
        position,
        scale:new Vector3(0.3,0.3,0.3)
    }));
    entity.setParent(parent);
    let count = 0;
    let direction = 0.5;
    entity.getComponent(GLTFShape).visible = false;
    const originalX = position.x;
    const update = (dt:number) => {
        const position = entity.getComponent(Transform).position.clone();
        count += dt*direction;
        if(direction > 0 && count >= 1){
            direction = -1*direction;
            count = 1;
            
        }else if(direction < 0 && count <= 0){
            direction = -1*direction;
            count = 0;
            
        }
        
        entity.getComponent(Transform).position.set(position.x+dt*direction, position.y,position.z)

    }
    engine.addSystem(new UpdateSystem(update));
    return entity;
}
const benchPets = [];
while(iR < rows){
    while(iC < columns){
        benchPets.push(createBenchmarkNyan(root, {
            position:new Vector3(10+ iC * 1.5 , 1, 10 + iR*1.5)
        }));
        
        iC++;
    }
    iC = 0;
    iR++;
}

const benchButton = new Entity();
benchButton.addComponent(new BoxShape());
let added = 0;
benchButton.addComponent(new OnPointerDown(()=>{
    if(added === 100) return;
    benchPets[added].getComponent(GLTFShape).visible = true;
    added++;
}, {hoverText:'Add to 100'}));

benchButton.addComponent(new Transform({
    position: new Vector3(24,0.5,24)
}))
benchButton.setParent(root);

 */