import SimpleComponent from "../../../html-puppeteer/core/SimpleComponent.js";

export default class ClockComponent extends SimpleComponent {
    handle;
    interval;
    stateGeneratorFn;

    /**
     * @param {number=} interval
     * @param {function(date: Date): *=} stateGeneratorFn
     * @param {AbstractComponentOptionsWithConfigurator} componentOptions
     */
    constructor({
                    interval,
                    stateGeneratorFn,
                    ...componentOptions
                }) {
        super(componentOptions);
        this.interval = interval ?? this.dataAttributes.interval ?? 1000;
        this.stateGeneratorFn = stateGeneratorFn ?? ((date) => date);
    }

    /**
     * @param {*=} value
     * @return {this}
     */
    render(value) {
        super.render(value);
        this.handle = setInterval(() => {
            this.doWithState((state) =>
                state.replace(this.stateGeneratorFn(new Date())));
        }, this.interval);
        return this;
    }

    /**
     * stops the clock
     */
    close() {
        clearInterval(this.handle);
    }
}