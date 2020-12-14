class OnOffState extends BasicState {
    /**
     * @type {string}
     */
    requestType;
    /**
     * @type OnOff
     */
    onOff;

    constructor(requestType) {
        super();
        this.requestType = requestType;
    }

    /**
     * won't reset requestType
     */
    reset() {
        super.reset();
        this.onOff = undefined;
    }

    /**
     * @param state
     */
    switchTo(state) {
        // switching "off" the previous state
        this.switchOff();
        // switching "on" the new state
        this.onOff = new OnOff(state);
        this._collectStateChange(this.onOff);
    }

    switchOff(dontIgnoreMissing) {
        if (dontIgnoreMissing && !this.onOff) {
            throw "switchOff: missing onOff"
        } else if (!this.onOff || !this.onOff.isOff) {
            // previous doesn't exist or is already "off"
            return;
        }
        this.onOff.isOff = true;
        this._collectStateChange(this.onOff);
    }

    switchOn(dontIgnoreMissing) {
        if (dontIgnoreMissing && !this.onOff) {
            throw "switchOn: missing onOff"
        } else if (!this.onOff || this.onOff.isOff) {
            // previous doesn't exist or is already "on"
            return;
        }
        this.onOff.isOff = false;
        this._collectStateChange(this.onOff);
    }

    /**
     * @param onOff {OnOff}
     * @return {StateChange}
     * @private
     */
    _collectStateChange(onOff) {
        super.collectStateChange(new StateChange(this.requestType, onOff));
    }
}