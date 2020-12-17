class SwappingState extends BasicState {
    /**
     * @type {string} is the requestType to use when reporting state changes
     */
    requestType;
    /**
     * @type SwappingDetails
     */
    swappingDetails;

    /**
     * @param requestType {string}
     */
    constructor(requestType = "SWAP") {
        super();
        this.requestType = requestType;
    }

    /**
     * won't reset requestType
     */
    reset() {
        super.reset();
        this.swappingDetails = undefined;
    }

    /**
     * @param data
     */
    switchTo(data) {
        if (this.swappingDetails && data === this.swappingDetails.data) {
            return;
        }
        // switching "off" the previous data
        this.switchOff();
        // switching "on" the new data
        this.swappingDetails = new SwappingDetails(data);
        this._collectStateChange(this.swappingDetails);
    }

    switchOff(dontIgnoreMissingSwappingDetails) {
        if (dontIgnoreMissingSwappingDetails && !this.swappingDetails) {
            throw "switchOff: missing swappingDetails"
        } else if (!this.swappingDetails || this.swappingDetails.isPrevious) {
            // previous doesn't exist or is already "off"
            return;
        }
        this.swappingDetails.isPrevious = true;
        this._collectStateChange(this.swappingDetails);
    }

    switchOn(dontIgnoreMissingSwappingDetails) {
        if (dontIgnoreMissingSwappingDetails && !this.swappingDetails) {
            throw "switchOn: missing swappingDetails"
        } else if (!this.swappingDetails || !this.swappingDetails.isPrevious) {
            // previous doesn't exist or is already "on"
            return;
        }
        this.swappingDetails.isPrevious = false;
        this._collectStateChange(this.swappingDetails);
    }

    /**
     * @param swappingDetails {SwappingDetails}
     * @return {StateChange}
     * @private
     */
    _collectStateChange(swappingDetails) {
        super.collectStateChange(new StateChange(this.requestType, swappingDetails));
    }
}