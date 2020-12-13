class IdentifiableRow extends SimpleRow {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param state {SimpleRowState}
     * @param view {SimpleRowView}
     */
    constructor(mustacheTableElemAdapter, state, view) {
        super(mustacheTableElemAdapter, state, view);
    }

    /**
     * by default this component won't use the owner to detect its fields
     *
     * @param useOwnerOnFields {boolean}
     * @return {*}
     */
    extractEntity(useOwnerOnFields = false) {
        const identifiableEntity = this.state.rowState;
        const $row = this.mustacheTableElemAdapter.$getRowByDataId(identifiableEntity.id);
        return EntityFormUtils.prototype.extractEntityFrom($row, useOwnerOnFields ? this.owner : undefined);
    }
}