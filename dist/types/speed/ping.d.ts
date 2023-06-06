import { BaseSpeed } from "./base";
import { ManagerSpeed } from "./manager";
export declare class PingSpeed extends BaseSpeed {
    private manager;
    inter: any;
    startT: number;
    prevT: any;
    ping: number;
    jitter: number;
    i: number;
    prevInstspd: number;
    progress: number;
    status: any;
    constructor(manager: ManagerSpeed);
    private processOne;
    start(): void;
    stop(): void;
}
