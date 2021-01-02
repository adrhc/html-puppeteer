class IdentifiableRowComponent extends SimpleRowComponent {
    /**
     * @type {SimpleRowView}
     */
    simpleRowView;

    /**
     * @param state {SimpleRowState}
     * @param view {SimpleRowView}
     */
    constructor(state, view) {
        super(state, view);
        this.simpleRowView = view;
    }

    /**
     * by default this component won't use the owner to detect its fields
     *
     * @param useOwnerOnFields {boolean}
     * @return {*}
     */
    extractEntity(useOwnerOnFields = false) {
        const inputValues = this.extractInputValues(useOwnerOnFields);
        return EntityUtils.prototype.removeTransientId(inputValues);
    }

    extractInputValues(useOwnerOnFields = false) {
        const identifiableEntity = this.state.rowState;
        return this.view.extractInputValuesByDataId(identifiableEntity.id, useOwnerOnFields);
    }

    close() {
        this._removeSwappingOffRows();
    }

    /**
     * @protected
     */
    _removeSwappingOffRows() {
        const itemId = this.state.rowState.id;
        console.log(`removing rows where [remove-on-row-close=${itemId}]`);
        this.tableAdapter.$getOwnedRowByData("remove-on-row-close", itemId).remove();
    }
}