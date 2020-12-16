class IdentifiableRow extends SimpleRow {
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
        const identifiableEntity = this.state.rowState;
        const $row = this.tableAdapter.$getRowByDataId(identifiableEntity.id);
        return EntityFormUtils.prototype.extractEntityFrom($row, useOwnerOnFields ? this.owner : undefined);
    }
}