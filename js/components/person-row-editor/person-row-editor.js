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
     * @return {Promise<StateChange>}
     * @protected
     */
    _initCatsTable(stateChange) {
        // cats array itself is edited so shouldn't be the received (original) one
        // item has not this issue because it's recreated on request (extractEntity)
        // item is cloned by super.init(item)
        const tableId = "catsTable";

        const roAndRwRow = SimpleRowFactory.prototype.createIdentifiableRow(
            tableId, {
                rowTmpl: "editableCatsRowTmpl", tableRelativePositionOnCreate: "append"
            });
        const deletableRow = SimpleRowFactory.prototype.createIdentifiableRow(
            tableId, {
                rowTmpl: "readOnlyCatsRowTmpl"
            });

        this.catsTableComp = EditableListFactory.prototype.create({
            items: stateChange.data.cats,
            state: new PersistentEditableListState(new EntityHelper()),
            tableId,
            bodyRowTmplId: "editableCatsRowTmpl",
            readOnlyRow: roAndRwRow,
            editableRow: roAndRwRow,
            deletableRow
        });

        return this.catsTableComp.init();
    }

    /**
     * @param item {Person}
     * @param requestType {string|undefined}
     * @return {Promise<StateChange>}
     */
    update(item, requestType) {
        return super.update(item, requestType)
            .then(stateChange => this._initCatsTable(stateChange).then(() => stateChange));
    }

    close() {
        super.close();
        if (this.catsTableComp) {
            this.catsTableComp.close();
        }
    }
}