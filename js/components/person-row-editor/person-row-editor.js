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
        const tableId = "catsTable";

        const roAndRwRow = SimpleRowFactory.prototype.createIdentifiableRow(
            tableId, {
                rowTmpl: "editableCatsRowTmpl", tableRelativePositionOnCreate: "append"
            });
        const deletableRow = SimpleRowFactory.prototype.createIdentifiableRow(
            tableId, {
                rowTmpl: "readOnlyCatsRowTmpl"
            });

        const repository = new InMemoryCrudRepository(new EntityHelper(),
            $.extend(true, [], stateChange.data.cats));

        this.catsTableComp = EditableListFactory.prototype.create({
            repository,
            state: new CatsListState(repository),
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
     * @param afterItemId {number|string}
     * @return {Promise<StateChange>}
     */
    update(item, requestType, afterItemId) {
        return super.update(item, requestType, afterItemId)
            .then(stateChange => this._initCatsTable(stateChange).then(() => stateChange));
    }

    extractInputValues(useOwnerOnFields = false) {
        const item = super.extractInputValues(true);
        item.cats = this.catsTableComp.extractAllEntities(true);
        return item;
    }

    close() {
        super.close();
        if (this.catsTableComp) {
            this.catsTableComp.close();
        }
    }
}