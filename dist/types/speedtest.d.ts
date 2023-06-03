import "./speedtest.scss";
import { Worker } from "./worker";
export declare class SpeedTest {
    inst: Worker;
    start(): Promise<void>;
}
