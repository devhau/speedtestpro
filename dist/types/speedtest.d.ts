import "./speedtest.scss";
import { Worker } from "./worker";
export declare class SpeedTest {
    inst: Worker;
    servers: never[];
    loadServer(): Promise<void>;
    start(): Promise<void>;
}
