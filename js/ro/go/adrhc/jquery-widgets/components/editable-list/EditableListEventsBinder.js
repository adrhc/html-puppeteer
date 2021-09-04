/**
 * @typedef {EditableListComponent} C
 * @extends {SelectableListEventsBinder}
 */
class EditableListEventsBinder extends SelectableListEventsBinder {
    /**
     * @return {EditableListComponent}
     */
    get editableList() {
        return this.component;
    }

    attachEventHandlers() {
        super.attachEventHandlers();
        this.view.$elem
            .on(this._appendNamespaceTo('click'),
                `${this._btnSelector(['showDelete', 'showEdit'])}`,
                this.component, (ev) => this.onShowDU(ev))
            .on(this._appendNamespaceTo('click'),
                `${this._ownerSelector}[data-btn='showAdd']`, this.component, (ev) => this.onShowAdd(ev))
            .on(this._appendNamespaceTo('click'),
                `${this._ownerSelector}[data-btn='cancel']`, this.component, (ev) => this.onCancel(ev))
            .on(this._appendNamespaceTo('click'),
                `${this._ownerSelector}[data-btn='delete']`, this.component, (ev) => this.onDelete(ev))
            .on(this._appendNamespaceTo('click'),
                `${this._ownerSelector}[data-btn='update']`, this.component, (ev) => this.onUpdate(ev));
    }

    _shouldIgnoreOnSwitch(ev) {
        const rowDataId = this._dataIdOf(ev);
        return FailedEntity.isErrorItemId(rowDataId) || super._shouldIgnoreOnSwitch(ev);
    }

    /**
     * SHOW ADD
     *
     * @param ev
     */
    onShowAdd(ev) {
        ev.stopPropagation();
        return this.editableList.showAdd();
    }

    /**
     * CANCEL
     *
     * @param ev {Event}
     */
    onCancel(ev) {
        ev.stopPropagation();
        return this.editableList.cancel();
    }

    /**
     * SHOW DELETE OR UPDATE (aka EDIT)
     *
     * @param ev {Event}
     */
    onShowDU(ev) {
        return this._handleWithValidRowDataId(ev,
            (rowDataId, context) =>
                this.editableList.showDU(rowDataId, context), true);
    }

    /**
     * DELETE
     *
     * @param ev {Event}
     */
    onDelete(ev) {
        return this._handleWithValidRowDataId(ev,
            (rowDataId) => this.editableList.deleteRow(rowDataId));
    }

    /**
     * UPDATE
     *
     * @param {Event} ev
     */
    onUpdate(ev) {
        return this._handleWithValidRowDataId(ev,
            (rowDataId) => this.editableList.updateRow(rowDataId));
    }

    /**
     * @param {Event} ev
     * @param {function(rowDataId: (string|number), context: (string|number|boolean|undefined)): *} handler
     * @param {boolean=} contextMustExists
     * @param {string} contextAttributeName
     * @return {*}
     * @protected
     */
    _handleWithValidRowDataId(ev, handler, contextMustExists, contextAttributeName = "btn") {
        const context = this._dataOf(ev, contextAttributeName);
        const rowDataId = this._dataIdOf(ev, true);
        if (rowDataId == null || rowDataId === "" ||
            (contextMustExists && (context == null || context === ""))) {
            return;
        }
        ev.stopPropagation();
        return handler(rowDataId, contextMustExists ? context : undefined);
    }

    /**
     * @param {Event} ev
     * @param {string} attribute
     * @return {string|number|boolean|undefined}
     * @protected
     */
    _dataOf(ev, attribute) {
        return $(ev.currentTarget).data(attribute);
    }
}