import axios from "axios";
import { BaseSpeed } from "./base";
import { ManagerSpeed } from "./manager";

export class DownloadSpeed extends BaseSpeed {
  controller = new AbortController();
  inter: any = undefined;
  totLoaded = 0.0; // total number of transmitted bytes
  startT = new Date().getTime(); // timestamp when test was started
  bonusT = 0; //how many milliseconds the test has been shortened by (higher on faster connections)
  graceTimeDone = false; //set to true after the grace time is past
  failed = false; // set to true if a stream fails
  progress = 0;
  status: any = undefined;
  public constructor(private manager: ManagerSpeed) {
    super();
  }
  private clear() {
    if (this.inter) {
      clearInterval(this.inter);
      setTimeout(() => (this.inter = undefined), 1000);
      this.controller.abort();
      console.log("DownloadSpeed");
    }
  }
  private processOne(url = "", data: any = undefined) {
    if (this.progress < 1) {
      setTimeout(() => {
        var prevLoaded = 0;
        axios
          .get(url + "r=" + Math.random(), {
            headers: {
              responseType: this.manager.settings.xhr_dlUseBlob
                ? "blob"
                : "arraybuffer",
              "Content-Encoding": "identity",
              "X-Requested-With": "XMLHttpRequest",
              "Cache-Control":
                "no-cache,no-store,must-revalidate,max-age=-1,private",
              Expires: "-1",
            },
            signal: this.controller.signal,
            onDownloadProgress: (event: any) => {
              let loadDiff = event.loaded <= 0 ? 0 : event.loaded - prevLoaded;
              if (isNaN(loadDiff) || !isFinite(loadDiff) || loadDiff < 0)
                return; // just in case
              this.totLoaded += loadDiff;
              prevLoaded = event.loaded;
            },
            validateStatus: function () {
              return true;
            },
          })
          .then(() => {
            this.processOne(url, data);
          })
          .catch((_: any) => {});
      }, 0);
    }
  }
  private updateStatusProccess() {
    this.inter = setInterval(() => {
      let t = new Date().getTime() - this.startT;
      if (this.graceTimeDone) {
        this.progress =
          (t + this.bonusT) / (this.manager.settings.time_ul_max * 1000);
      }
      if (t < 200) return;
      if (!this.graceTimeDone) {
        if (t > 1000 * this.manager.settings.time_ulGraceTime) {
          if (this.totLoaded > 0) {
            // if the connection is so slow that we didn't get a single chunk yet, do not reset
            this.startT = new Date().getTime();
            this.bonusT = 0;
            this.totLoaded = 0.0;
          }
          this.graceTimeDone = true;
        }
        var speed = this.totLoaded / (t / 1000.0);
        this.manager.AddInfo("download", {
          progress: this.progress,
          status: this.status,
          speed: speed,
        });
      } else {
        var speed = this.totLoaded / (t / 1000.0);
        if (this.manager.settings.time_auto) {
          //decide how much to shorten the test. Every 200ms, the test is shortened by the bonusT calculated here
          var bonus = (5.0 * speed) / 100000;
          this.bonusT += bonus > 400 ? 400 : bonus;
        }
        //update status
        this.status = (
          (speed * 8 * this.manager.settings.overheadCompensationFactor) /
          (this.manager.settings.useMebibits ? 1048576 : 1000000)
        ).toFixed(2); // speed is multiplied by 8 to go from bytes to bits, overhead compensation is applied, then everything is divided by 1048576 or 1000000 to go to megabits/mebibits
        if (
          (t + this.bonusT) / 1000.0 > this.manager.settings.time_ul_max ||
          this.failed
        ) {
          // test is over, stop streams and timer
          if (this.failed || isNaN(this.status)) this.status = "Fail";
          this.clear();
          this.progress = 1;
        }
        this.manager.AddInfo("download", {
          progress: this.progress,
          status: this.status,
          speed: speed,
        });
      }
    }, 200);
  }
  public start() {
    this.progress = 0;
    this.status = "";
    this.failed = false;
    this.updateStatusProccess();
    let url =
      this.manager.server.server + "/" + this.manager.server.dlURL + "?";
    if (this.manager.settings.mpot) url += "cors=true&";
    if (this.manager.settings.garbagePhp_chunkSize) {
      url += "ckSize=" + this.manager.settings.garbagePhp_chunkSize + "&";
    }
    setTimeout(() => {
      for (let i = 0; i < this.manager.settings.xhr_dlMultistream; i++) {
        this.processOne(url);
      }
    }, 200);
    setTimeout(() => {
      this.startT = new Date().getTime();
    }, 200);
  }
  public stop() {}
}
