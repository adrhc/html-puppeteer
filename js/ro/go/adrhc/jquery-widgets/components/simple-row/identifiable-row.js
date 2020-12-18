class IdentifiableRowComponent extends SimpleRowComponent {
    /**
     * @param state {SimpleRowState}
     * @param view {SimpleRowView}
     */
    constructor(state, view) {
        super(state, view);
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
}