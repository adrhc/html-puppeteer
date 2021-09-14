import SimpleComponent from "../../../html-puppeteer/core/SimpleComponent.js";

export default class ClockComponent extends SimpleComponent {
    handle;

    render() {
        this.handle = setInterval(() => {
            this.doWithState((state) =>
                state.replace({time: new Date()}), 1000);
        })
    }

    close() {
        clearInterval(this.handle);
    }
}