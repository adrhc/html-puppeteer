class SwappingDetails {
    /**
     * @param data (e.g. EntityRowSwap)
     * @param isPrevious {boolean}
     */
    constructor(data, isPrevious = false) {
        this.data = data;
        this.isPrevious = isPrevious;
    }
}