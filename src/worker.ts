import axios from "axios";
import { Blob } from "node:buffer";
export class Worker {
  settings = {
    mpot: false, //set to true when in MPOT mode
    test_order: "IP_D_U", //order in which tests will be performed as a string. D=Download, U=Upload, P=Ping+Jitter, I=IP, _=1 second delay
    time_ul_max: 15, // max duration of upload test in seconds
    time_dl_max: 15, // max duration of download test in seconds
    time_auto: true, // if set to true, tests will take less time on faster connections
    time_ulGraceTime: 3, //time to wait in seconds before actually measuring ul speed (wait for buffers to fill)
    time_dlGraceTime: 1.5, //time to wait in seconds before actually measuring dl speed (wait for TCP window to increase)
    count_ping: 10, // number of pings to perform in ping test
    url_dl: "garbage.php", // path to a large file or garbage.php, used for download test. must be relative to this js file
    url_ul: "empty.php", // path to an empty file, used for upload test. must be relative to this js file
    url_ping: "empty.php", // path to an empty file, used for ping test. must be relative to this js file
    url_getIp: "getIP.php", // path to getIP.php relative to this js file, or a similar thing that outputs the client's ip
    getIp_ispInfo: true, //if set to true, the server will include ISP info with the IP address
    getIp_ispInfo_distance: "km", //km or mi=estimate distance from server in km/mi; set to false to disable distance estimation. getIp_ispInfo must be enabled in order for this to work
    xhr_dlMultistream: 6, // number of download streams to use (can be different if enable_quirks is active)
    xhr_ulMultistream: 3, // number of upload streams to use (can be different if enable_quirks is active)
    xhr_multistreamDelay: 300, //how much concurrent requests should be delayed
    xhr_ignoreErrors: 1, // 0=fail on errors, 1=attempt to restart a stream if it fails, 2=ignore all errors
    xhr_dlUseBlob: false, // if set to true, it reduces ram usage but uses the hard drive (useful with large garbagePhp_chunkSize and/or high xhr_dlMultistream)
    xhr_ul_blob_megabytes: 20, //size in megabytes of the upload blobs sent in the upload test (forced to 4 on chrome mobile)
    garbagePhp_chunkSize: 100, // size of chunks sent by garbage.php (can be different if enable_quirks is active)
    enable_quirks: true, // enable quirks for specific browsers. currently it overrides settings to optimize for specific browsers, unless they are already being overridden with the start command
    ping_allowPerformanceApi: true, // if enabled, the ping test will attempt to calculate the ping more precisely using the Performance API. Currently works perfectly in Chrome, badly in Edge, and not at all in Firefox. If Performance API is not supported or the result is obviously wrong, a fallback is provided.
    overheadCompensationFactor: 1.06, //can be changed to compensatie for transport overhead. (see doc.md for some other values)
    useMebibits: false, //if set to true, speed will be reported in mebibits/s instead of megabits/s
    telemetry_level: 0, // 0=disabled, 1=basic (results only), 2=full (results and timing) 3=debug (results+log)
    url_telemetry: "results/telemetry.php", // path to the script that adds telemetry data to the database
    telemetry_extra: "", //extra data that can be passed to the telemetry through the settings
    forceIE11Workaround: false, //when set to true, it will foce the IE11 upload test on all browsers. Debug only
  };
  server = {
    name: "Amsterdam, Netherlands (Clouvider)",
    server: "//ams.speedtestpro.clouvider.net/backend",
    id: 51,
    dlURL: "garbage.php",
    ulURL: "empty.php",
    pingURL: "empty.php",
    getIpURL: "getIP.php",
    sponsorName: "Clouvider",
    sponsorURL: "https://www.clouvider.co.uk/",
  };
  ipInfo = {};
  async start() {
    this.ipInfo = await this.getIp();
    console.log(this.ipInfo);
    console.log(this.fakeDataUpload().size);
  }
  stop() {}
  async getIp() {
    let url = this.server.server + "/" + this.server.getIpURL + "?";
    if (this.settings.mpot) url += "cors=true&";
    if (this.settings.getIp_ispInfo) url += "isp=true&";
    if (this.settings.getIp_ispInfo_distance)
      url += "distance=" + this.settings.getIp_ispInfo_distance + "&";
    url += "r=" + Math.random();
    return await axios(url).then((response) => {
      return response.data;
    });
  }
  fakeDataUpload(sizeMb = 20) {
    var byteNumbers = new Array(sizeMb * 1024 * 1024);
    for (var i = 0; i < byteNumbers.length; i++) {
      byteNumbers[i] = Math.floor(Math.random() * 256);
    }
    var byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: "application/octet-stream" });
  }
  
}
