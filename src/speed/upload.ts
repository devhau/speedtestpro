import { Blob } from "node:buffer";
import { BaseSpeed } from "./base";
import { ManagerSpeed } from "./manager";
import axios from "axios";

export class UploadSpeed extends BaseSpeed {
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

  fakeData(sizeMb = 100) {
    var byteNumbers = new Array(sizeMb * 1024 * 1024);
    for (var i = 0; i < byteNumbers.length; i++) {
      byteNumbers[i] = Math.floor(Math.random() * 256);
    }
    var byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: "application/octet-stream" });
  }
  private clear() {
    if (this.inter) {
      clearInterval(this.inter);
      setTimeout(() => (this.inter = undefined), 1000);
      this.controller.abort();
      console.log("UploadSpeed");
    }
  }
  private processOne(url = "", data: any = undefined) {
    if (data && this.progress < 1) {
      setTimeout(() => {
        var prevLoaded = 0;
        axios
          .put(url + "r=" + Math.random(), data, {
            headers: {
              "Content-Encoding": "identity",
              "X-Requested-With": "XMLHttpRequest",
              "Cache-Control":
                "no-cache,no-store,must-revalidate,max-age=-1,private",
              Expires: "-1",
              "Content-Type": "application/octet-stream",
            },
            signal: this.controller.signal,
            onUploadProgress: (event: any) => {
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
        this.manager.AddInfo("upload", {
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
        this.manager.AddInfo("upload", {
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
      this.manager.server.server + "/" + this.manager.server.ulURL + "?";
    if (this.manager.settings.mpot) url += "cors=true&";
    const data = this.fakeData();
    setTimeout(() => {
      for (let i = 0; i < this.manager.settings.xhr_ulMultistream; i++) {
        this.processOne(url, data);
      }
    }, 200);
    setTimeout(() => {
      this.startT = new Date().getTime();
    }, 200);
  }
  public stop() {}
}
