import StateChangesHandler from "../../../html-puppeteer/core/StateChangesHandler.js";

/**
 * @typedef {{stopped: boolean, interval: number}} ClockState
 */
/**
 * @typedef {function(component: AbstractComponent, date: Date): *} StateGeneratorFn
 */
/**
 * @template SCT, SCP
 */
export default class StateGeneratorClockStateChangesHandler extends StateChangesHandler {
    /**
     * @type {AbstractComponent}
     */
    component;
    /**
     * @type {number|undefined}
     */
    handle;
    /**
     * @type {StateGeneratorFn}
     */
    stateGeneratorFn;

    /**
     * @param {AbstractComponent} component
     * @param {StateGeneratorFn} stateGeneratorFn
     */
    constructor(component, stateGeneratorFn) {
        super();
        this.component = component;
        this.stateGeneratorFn = stateGeneratorFn;
    }

    /**
     * @param {StateChange<SCT, SCP>} stateChange
     */
    changeOccurred(stateChange) {
        const newClockState = /** @type {ClockState} */ stateChange.newStateOrPart;
        if (newClockState.stopped) {
            this._stop();
        } else {
            this._start(newClockState.interval);
        }
    }

    /**
     * starts the component
     *
     * @protected
     */
    _start(interval) {
        this._stop();
        const component = this.component;
        const stateGeneratorFn = this.stateGeneratorFn;
        this.handle = setInterval(() => {
            component.doWithState((state) =>
                state.replace(stateGeneratorFn(component, new Date())));
        }, interval);
        console.log("component started");
    }

    /**
     * @protected
     */
    _stop() {
        if (this.handle == null) {
            return;
        }
        clearInterval(this.handle);
        this.handle = undefined;
        console.log("component stopped");
    }
}