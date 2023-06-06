export declare class ManagerSpeed {
    server: {
        name: string;
        server: string;
        id: number;
        dlURL: string;
        ulURL: string;
        pingURL: string;
        getIpURL: string;
        sponsorName: string;
        sponsorURL: string;
    };
    settings: {
        mpot: boolean;
        test_order: string;
        time_ul_max: number;
        time_dl_max: number;
        time_auto: boolean;
        time_ulGraceTime: number;
        time_dlGraceTime: number;
        count_ping: number;
        url_dl: string;
        url_ul: string;
        url_ping: string;
        url_getIp: string;
        getIp_ispInfo: boolean;
        getIp_ispInfo_distance: string;
        xhr_dlMultistream: number;
        xhr_ulMultistream: number;
        xhr_multistreamDelay: number;
        xhr_ignoreErrors: number;
        xhr_dlUseBlob: boolean;
        xhr_ul_blob_megabytes: number;
        garbagePhp_chunkSize: number;
        enable_quirks: boolean;
        ping_allowPerformanceApi: boolean;
        overheadCompensationFactor: number;
        useMebibits: boolean;
        telemetry_level: number;
        url_telemetry: string;
        telemetry_extra: string;
        forceIE11Workaround: boolean;
    };
    Start(): Promise<void>;
    AddInfo(type: string, data: any): void;
}
