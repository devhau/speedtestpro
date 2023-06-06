import axios from "axios";
import { BaseSpeed } from "./base";
import { ManagerSpeed } from "./manager";

export class PingSpeed extends BaseSpeed {
  inter: any = undefined;
  startT = new Date().getTime(); //when the test was started
  prevT: any = null; // last time a pong was received
  ping = 0.0; // current ping value
  jitter = 0.0; // current jitter value
  i = 0; // counter of pongs received
  prevInstspd = 0; // last ping time, used for jitter calculation
  progress = 0;
  status: any = undefined;

  public constructor(private manager: ManagerSpeed) {
    super();
  }

  private processOne(url = "") {
    if (this.progress < 1) {
      setTimeout(() => {
        this.progress = this.i / this.manager.settings.count_ping;
        axios
          .get(url + "r=" + Math.random(), {
            headers: {
              // "Content-Encoding": "identity",
              // "X-Requested-With": "XMLHttpRequest",
              // "Cache-Control":
              //   "no-cache,no-store,must-revalidate,max-age=-1,private",
              // Expires: "-1",
            },
            // validateStatus: function () {
            //   return true;
            // },
          })
          .then(() => {
            if (this.i === 0) {
              this.prevT = new Date().getTime();
            } else {
              let instspd = new Date().getTime() - this.prevT;
              if (instspd < 1) instspd = this.prevInstspd;
              if (instspd < 1) instspd = 1;
              let instjitter = Math.abs(instspd - this.prevInstspd);
              if (this.i === 1) this.ping = instspd;
              /* first ping, can't tell jitter yet*/ else {
                if (instspd < this.ping) this.ping = instspd; // update ping, if the instant ping is lower
                if (this.i === 2) this.jitter = instjitter;
                //discard the first jitter measurement because it might be much higher than it should be
                else
                  this.jitter =
                    instjitter > this.jitter
                      ? this.jitter * 0.3 + instjitter * 0.7
                      : this.jitter * 0.8 + instjitter * 0.2; // update jitter, weighted average. spikes in ping values are given more weight.
              }
              this.prevInstspd = instspd;
            }
            let pingStatus = this.ping.toFixed(2);
            let jitterStatus = this.jitter.toFixed(2);
            this.i++;
            if (this.i < this.manager.settings.count_ping) {
              this.manager.AddInfo("ping", {
                process: this.progress,
                ping: pingStatus,
                jitter: jitterStatus,
              });
              this.processOne(url);
            } else {
              this.progress = 1;
              this.manager.AddInfo("ping", {
                process: this.progress,
                ping: pingStatus,
                jitter: jitterStatus,
              });
            }
          })
          .catch((_: any) => {
            this.i++;
            if (this.i < this.manager.settings.count_ping) {
              this.processOne(url);
              this.manager.AddInfo("ping", null);
            }
          });
      }, 0);
    }
  }
  public start() {
    this.progress = 0;
    this.ping = 0;
    this.jitter = 0;
    this.status = "";
    this.i = 0;
    let url =
      this.manager.server.server + "/" + this.manager.server.pingURL + "?";
    if (this.manager.settings.mpot) url += "cors=true&";
    setTimeout(() => {
      this.processOne(url);
    }, 200);
    setTimeout(() => {
      this.prevT = new Date().getTime();
    }, 200);
  }
  public stop() {}
}
