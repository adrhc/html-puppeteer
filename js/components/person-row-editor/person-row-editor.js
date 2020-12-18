class PersonRowEditor extends IdentifiableRowComponent {
    /**
     * @type {EditableListComponent}
     */
    catsTableComp;

    constructor(state, view) {
        super(state, view);
    }

    /**
     * @param stateChange {StateChange}
     * @protected
     */
    _initCatsTable(stateChange) {
        // cats array itself is edited so shouldn't be the received (original) one
        // item has not this issue because it's recreated on request (extractEntity)
        // item is cloned by super.init(item)
        const tableId = "catsTable";

        const roAndRwRow = SimpleRowFactory.prototype.createIdentifiableRow(
            tableId, {
                rowTmpl: "catsTableEditableRowTmpl", tableRelativePositionOnCreate: "append"
            });
        const deletableRow = SimpleRowFactory.prototype.createIdentifiableRow(
            tableId, {
                rowTmpl: "catsTableDeletableRowTmpl"
            });

        this.catsTableComp = EditableListFactory.prototype
            .create({
                items: stateChange.data.cats,
                tableId,
                readOnlyRow: roAndRwRow,
                editableRow: roAndRwRow,
                deletableRow
            });
    }

    /**
     * @param item {Person}
     * @param requestType {string|undefined}
     * @return {Promise<StateChange>}
     */
    update(item, requestType) {
        return super.update(item, requestType)
            .then(stateChange => {
                this._initCatsTable(stateChange);
                return stateChange;
            });
    }

    close() {
        super.close();
        if (this.catsTableComp) {
            this.catsTableComp.close();
        }
    }
}