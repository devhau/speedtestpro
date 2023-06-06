#! /usr/bin/env node
const { SpeedTest } = require("./../");
const stp = new SpeedTest();
setTimeout(async () => {
  await stp.start();
  // await stp.loadServer();
  // console.log(stp.servers);
});
