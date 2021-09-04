/**
 * @typedef {SelectableListComponent} C
 * @extends {SimpleListEventsBinder}
 */
class SelectableListEventsBinder extends SimpleListEventsBinder {
    /**
     * @return {AbstractTableBasedView}
     */
    get abstractTableBasedView() {
        return this.view;
    }

    attachEventHandlers() {
        super.attachEventHandlers();
        this.view.$elem
            .on(this._appendNamespaceTo("dblclick"),
                `tr${this._ownerSelector}`, this.component, (ev) => this.onSwitch(ev));
    }

    /**
     * @param {Event} ev
     */
    onSwitch(ev) {
        if (this._shouldIgnoreOnSwitch(ev)) {
            return;
        }
        ev.stopPropagation();
        this.component.switchTo(this._dataIdOf(ev));
    }

    /**
     * @param {Event} ev
     * @return {boolean}
     * @protected
     */
    _shouldIgnoreOnSwitch(ev) {
        return !$(ev.currentTarget).is("tr,td,th");
    }

    /**
     * @param {Event} ev
     * @param {boolean=} searchParentsForDataIdIfMissingOnElem
     * @return {string|number}
     */
    _dataIdOf(ev, searchParentsForDataIdIfMissingOnElem) {
        return this.abstractTableBasedView.rowDataIdOf(
            ev.currentTarget, searchParentsForDataIdIfMissingOnElem);
    }
}