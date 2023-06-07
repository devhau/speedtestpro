import axios from "axios";
import "./speedtest.scss";
import { ManagerSpeed } from "./speed/manager";

export class SpeedTest {
  inst = new ManagerSpeed();
  servers = [];
  async loadServer() {
    this.servers = await axios("https://speedtest.hau.xyz/servers.json");
  }
  async start() {
    await this.inst.Start();
  }
}
