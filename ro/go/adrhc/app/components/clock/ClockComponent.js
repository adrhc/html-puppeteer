import SimpleComponent from "../../../html-puppeteer/core/SimpleComponent.js";

export default class ClockComponent extends SimpleComponent {
    handle;
    interval;

    constructor({interval = 1000, ...otherConfig}) {
        super(otherConfig);
        this.interval = interval;
    }

    /**
     * @return {this}
     */
    render() {
        super.render();
        this.handle = setInterval(() => {
            this.doWithState((state) =>
                state.replace(new Date()));
        }, this.interval)
        return this;
    }

    /**
     * stops the clock
     */
    close() {
        clearInterval(this.handle);
    }
}