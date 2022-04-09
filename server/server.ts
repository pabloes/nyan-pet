console.log("initializing");
require('dotenv').config();
handleProcessExit();
import { getUserNyanCats } from "./rooms/voxters-service";
getUserNyanCats({hasConnectedWeb3:true, publicKey:"0x598f8af1565003ae7456dac280a18ee826df7a2c"});
import {VoxtersLobby} from "./rooms/Lobby";
import express from 'express';
import cors from 'cors';

import { createServer } from 'http';
import { Server, } from 'colyseus';
import { monitor } from '@colyseus/monitor';

import basicAuth = require("express-basic-auth");

require('dotenv').config();

const port = Number(process.env.PORT || 2567);
const app = express();

app.use(cors({origin:`https://play.decentraland.org`}));
app.use(express.json());

const gameServer = new Server({
    server: createServer(app),
    express: app,
    pingInterval: process.env.PROD ? 1500 : 0,
});

gameServer.define('nyan-lobby', VoxtersLobby)
.filterBy(['realm', 'land'])
.enableRealtimeListing();

const basicAuthMiddleware = basicAuth({
    // list of users and passwords
    users: {
        "nyan-pet": "nyan1234",
    },    
    challenge: true
});
app.get('*/hello',(req,res)=>{
  res.send("hello");
});
app.use('*/monitor', basicAuthMiddleware, monitor());
console.log("listening port ",port);
gameServer.listen(port);

function handleProcessExit(){
  process.on('SIGTERM', async (signal) => {        
      await callDiscordHook(`Process ${process.pid} received a SIGTERM signal`);
      process.exit(0);
    })
    
    process.on('SIGINT', async (signal) => {
      await callDiscordHook(`Process ${process.pid} has been interrupted`);
      process.exit(0);
    })
  process.on('uncaughtException', async (err) => {
      await callDiscordHook(`Uncaught Exception: ${err.message}`);
      process.exit(1);
  });
  process.on('unhandledRejection', async (reason, promise) => {
      await callDiscordHook('Unhandled rejection at '+ promise + ` reason: ${reason}`);
      process.exit(1)
  });

  function callDiscordHook(message){
    console.log(message)
  }
}
