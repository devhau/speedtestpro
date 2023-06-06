/// <reference types="node" />
import { Blob } from "node:buffer";
import { BaseSpeed } from "./base";
import { ManagerSpeed } from "./manager";
export declare class UploadSpeed extends BaseSpeed {
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
    fakeData(sizeMb?: number): Blob;
    private clear;
    private processOne;
    private updateStatusProccess;
    start(): void;
    stop(): void;
}
