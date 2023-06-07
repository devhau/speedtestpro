import "./speedtest.scss";
import { ManagerSpeed } from "./speed/manager";
export declare class SpeedTest {
    inst: ManagerSpeed;
    servers: never[];
    loadServer(): Promise<void>;
    start(): Promise<void>;
}
