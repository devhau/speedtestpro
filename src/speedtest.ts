import axios from "axios";
import "./speedtest.scss";
import { Worker } from "./worker";

export class SpeedTest {
  inst = new Worker();
  servers = [];
  async loadServer() {
    this.servers = await axios("https://speedtest.hau.xyz/servers.json");
  }
  async start() {
    await this.inst.start();
  }
}
