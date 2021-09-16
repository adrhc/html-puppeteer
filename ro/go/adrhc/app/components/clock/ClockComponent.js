import SimpleComponent from "../../../html-puppeteer/core/SimpleComponent.js";

export default class ClockComponent extends SimpleComponent {
    handle;
    interval;
    /**
     * @type {function(date: Date, dataAttributes: DataAttributes): *}
     */
    stateGeneratorFn;

    /**
     * @param {AbstractComponentOptionsWithConfigurator} options
     */
    constructor(options) {
        super(options);
        // have to use this.options instead of simply options because some
        // configurators might change this.options (e.g. change this.options.interval)
        this.interval = this.options.interval ?? this.dataAttributes.interval ?? 1000;
        this.stateGeneratorFn = this.options.stateGeneratorFn ?? ((date) => date);
    }

    /**
     * @param {*=} value
     * @return {this}
     */
    render(value) {
        super.render(value);
        const dataAttributes = this.dataAttributes;
        this.handle = setInterval(() => {
            this.doWithState((state) =>
                state.replace(this.stateGeneratorFn(new Date(), dataAttributes)));
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