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

    updateViewOnDELETE(stateChange) {
        this.removeSecondaryRowParts();
        return super.updateViewOnDELETE(stateChange);
    }

    removeSecondaryRowParts() {
        const itemId = this.state.rowState.id;
        console.log(`removing rows where [secondary-row-part=${itemId}]`);
        this.tableAdapter.$getOwnedRowByData("secondary-row-part", itemId).remove();
    }
}