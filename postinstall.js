const cwd = (process.env.INIT_CWD || process.cwd());
console.log("Setup nyan-pet files into " + cwd);
const path = require("path");
const fs = require("fs-jetpack");
const metaBase = 'scene/metas/voxters-pet';
var execSync = require('child_process').execSync;

fs.copy(
    path.resolve(__dirname, metaBase),
    path.resolve(cwd, metaBase.replace("scene/","")),
    { overwrite: true }
);


const packageFile = path.resolve(cwd, `package.json`);
console.log("SCENE PACKAGE", packageFile);
const package = fs.read(packageFile, 'json');
const tsConfigFile = path.resolve(cwd,`tsconfig.json`);
console.log("REVIEWING TSCONFIG FILE", tsConfigFile);
const tsConfig = fs.read(tsConfigFile, 'json');
console.log("TSCONFIG", tsConfig);

if(tsConfig.compilerOptions.noLib === undefined){
    console.log("SETTING noLib:false ON tsconfig.json");
    tsConfig.compilerOptions.noLib = false;
    fs.write(tsConfigFile, tsConfig);
}

if(!package.dependencies 
    || !package.dependencies["colyseus.js"] 
    || !package.bundleDependencies
    || !~package.bundleDependencies.indexOf("colyseus.js")){
    console.log("INSTALLING COLYSEUS.JS...");
    try{
        execSync(`npm install colyseus.js -B`, { cwd, stdio: 'inherit' });
    }catch(err){
        console.log("ERROR",err);
    }
}