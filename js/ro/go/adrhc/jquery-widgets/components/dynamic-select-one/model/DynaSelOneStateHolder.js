/**
 * @typedef {DynaSelOneState} T
 * @typedef {string|number|boolean} P
 */
class DynaSelOneStateHolder extends TaggingStateHolder {
    static NOT_YET_SEARCHED = new DynaSelOneState(undefined, undefined, undefined, false);

    /**
     * @param {DynaSelOneConfig} config
     * @param {DynaSelOneState} [initialState]
     * @param {IdentityStateChangeMapper} [stateChangeMapper]
     * @param {StateChangesCollector} [changesCollector]
     */
    constructor(config, {
        initialState = DynaSelOneStateHolder.NOT_YET_SEARCHED,
        stateChangeMapper,
        changesCollector
    } = {
        initialState: DynaSelOneStateHolder.NOT_YET_SEARCHED
    }) {
        super({initialState, stateChangeMapper, changesCollector});
        this.config = config;
    }

    /**
     * @return {boolean}
     */
    isPristine() {
        return this.currentState === DynaSelOneStateHolder.NOT_YET_SEARCHED;
    }

    /**
     * Used to initialize the state when DynamicSelectOneComponent acts as a child.
     *
     * @param {DynaSelOneItem} [selectedItem]
     * @param {boolean} [dontRecordStateEvents]
     * @return {StateChange<T>|undefined}
     */
    updateUsingDynaSelOneItem(selectedItem, dontRecordStateEvents) {
        if (selectedItem) {
            return this.replaceEntirely(new DynaSelOneState(selectedItem.title,
                [selectedItem], selectedItem), {dontRecordStateEvents});
        } else {
            return this.replaceEntirely(DynaSelOneStateHolder.NOT_YET_SEARCHED, {dontRecordStateEvents});
        }
    }

    /**
     * @param {number} id is the <option> value
     * @return {StateChange<T>}
     */
    updateById(id) {
        console.log(`[${this.constructor.name}.updateById] id = ${id}`);
        const selectedItem = this._findOptionById(id);
        if (!selectedItem) {
            console.warn(`[${this.constructor.name}.updateById] missing option for id = ${id}!`);
            return this.replaceEntirely(DynaSelOneStateHolder.NOT_YET_SEARCHED);
        }
        return this.replaceEntirely(new DynaSelOneState(selectedItem.title, [selectedItem], selectedItem));
    }

    /**
     * @param {string} includingText
     * @param {string} includedText
     * @return {boolean}
     */
    static startsWith(includingText, includedText) {
        return includingText != null && includedText != null &&
            includingText.toLowerCase().startsWith(includedText.toLowerCase())
    }

    /**
     * @param id {number|string}
     * @returns {DynaSelOneItem|undefined}
     * @protected
     */
    _findOptionById(id) {
        if (!this.currentState.options) {
            return undefined;
        }
        return this.currentState.options.find(opt => EntityUtils.idsAreEqual(opt.id, id));
    }

    reset() {
        super.reset();
        this.currentState = DynaSelOneStateHolder.NOT_YET_SEARCHED;
    }
}