import { BaseSpeed } from "./base";
import { ManagerSpeed } from "./manager";
export declare class DownloadSpeed extends BaseSpeed {
    private manager;
    controller: AbortController;
    inter: any;
    totLoaded: number;
    startT: number;
    bonusT: number;
    graceTimeDone: boolean;
    failed: boolean;
    progress: number;
    status: any;
    constructor(manager: ManagerSpeed);
    private clear;
    private processOne;
    private updateStatusProccess;
    start(): void;
    stop(): void;
}
