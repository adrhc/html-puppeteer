import SimpleComponent from "../../../html-puppeteer/core/SimpleComponent.js";

export default class ClockComponent extends SimpleComponent {
    handle;
    interval;

    constructor({interval = 1000, ...otherConfig}) {
        super(otherConfig);
        this.interval = interval;
    }

    render() {
        super.render();
        this.handle = setInterval(() => {
            this.doWithState((state) =>
                state.replace({time: new Date()}));
        }, this.interval)
        return this;
    }

    close() {
        clearInterval(this.handle);
    }
}