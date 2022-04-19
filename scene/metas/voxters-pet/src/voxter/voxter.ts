const availableModels = [0,2, 9, 10, 13, 17, 19, 20, 10021, 10022, 10024, 10026, 10055, 10056, 10057, 10058, 10063, 10065, 42069, 52552];

const shapes = availableModels.reduce((acc:any, catId)=>{
  const shape = new GLTFShape(`metas/voxters-pet/models/${catId}.glb`);
  shape.isPointerBlocker = false;
  shape.withCollisions = false;
  acc[catId] = shape;
  return acc;
}, {});

function getAvailableOrDefault(catId:number) {
  if(~availableModels.indexOf(catId)) return catId;
  return 0;
}



export const createVoxter = (name:string, x:number, y:number, z:number, catId:number, mouthIndex:number, eyeColorIndex:number, headIndex:number) => {
    const callbacks:any = {
      onClick:null
    };
    const state:any = {
      currentModel:getAvailableOrDefault(catId)
    }
    const voxter = new Entity();     
    const shape = shapes[state.currentModel];
    voxter.addComponent(shape);
    voxter.addComponent(new Transform({
      scale:new Vector3(0.25,0.25,0.25),
      position:new Vector3(2,1,2)
    }))
    engine.addEntity(voxter);
    
    const clip = new AudioClip("metas/voxters-pet/sounds/nyan_short.mp3")
    const source = new AudioSource(clip)
  //  voxter.addComponent(source);
    source.loop = true;
    source.playing = false;
    let hasClick = false;
    return {
      reproduce:()=>{
        source.playing = true;
        source.loop = true;
      },
      stop:()=>{
        source.playing = false;
      },
      onClick:(fn:any)=>{
        if(!hasClick){
          hasClick = true;
          const entity = new Entity();
          const box =new BoxShape();
          box.withCollisions = false;
          box.isPointerBlocker = true;
          entity.addComponent(box);
          const material = new Material();
          entity.addComponent(material);
          entity.addComponent(new Transform({
            position: new Vector3(1,1,0),
            scale:new Vector3(4.5,3,0.5)
          }))
          material.albedoColor = new Color4(1,0,0,0);
          entity.setParent(voxter);
          entity.addComponent(new OnPointerDown(()=>{
            callbacks.onClick && callbacks.onClick();
          }, {hoverText:"switch"}));
        }
        callbacks.onClick = fn;
      },
      applyDna:(catId:any)=>{
        state.currentModel = getAvailableOrDefault(catId)
        voxter.addComponentOrReplace(shapes[state.currentModel]);
      },
      getEntity:()=>voxter,
      setPosition:(position:Vector3)=>{
        voxter.getComponent(Transform).position.copyFrom(position)
      },
      dispose:()=>{
        voxter.setParent(null);
        engine.removeEntity(voxter);
      },
      lookAt:(target:Vector3)=>{
        voxter.getComponent(Transform).lookAt(target);
      },
      update:(dt:number)=>{

      }
    };
  };
