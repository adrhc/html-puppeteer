/**
 * SwappingState collects state changes as follows:
 *      StateChange.requestType defaults to "SWAP"
 *      StateChange.data = SwappingDetails
 */
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
     * @param data (e.g. SelectableSwappingData)
     * @return {boolean} whether the switch actually happened or not
     */
    switchTo(data) {
        if (this.swappingDetails && data === this.swappingDetails.data) {
            return false;
        }
        // switching "off" the previous data
        this.switchOff();
        // switching "on" the new data
        this.swappingDetails = new SwappingDetails(data);
        this._collectStateChange(this.swappingDetails);
        return true;
    }

    /**
     * @param dontIgnoreMissingSwappingDetails
     * @return {boolean} whether the switch actually happened or not
     */
    switchOff(dontIgnoreMissingSwappingDetails) {
        if (dontIgnoreMissingSwappingDetails && !this.swappingDetails) {
            console.error("switchOff: missing swappingDetails");
            throw "switchOff: missing swappingDetails";
        } else if (!this.swappingDetails || this.swappingDetails.isPrevious) {
            // previous doesn't exist or is already "off"
            return false;
        }
        this.swappingDetails.isPrevious = true;
        this._collectStateChange(this.swappingDetails);
        this.swappingDetails = undefined;
        return true;
    }

    /**
     * @param swappingDetails {SwappingDetails}
     * @return {StateChange}
     * @private
     */
    _collectStateChange(swappingDetails) {
        super.collectStateChange(new StateChange(this.requestType, swappingDetails), {});
    }

    get currentState() {
        return this.swappingDetails;
    }
}