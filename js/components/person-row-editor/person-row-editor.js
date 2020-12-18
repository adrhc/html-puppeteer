class PersonRowEditor extends IdentifiableRowComponent {
    /**
     * @type {EditableListComponent}
     */
    catsTableComp;

    constructor(state, view) {
        super(state, view);
    }

    /**
     * @return {Promise<StateChange>}
     */
    init() {
        // cats array itself is edited so shouldn't be the received (original) one
        // item has not this issue because it's recreated on request (extractEntity)
        // item is cloned by super.init(item)
        return super.init()
            .then(() => {
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
                        items: [],
                        tableId,
                        readOnlyRow: roAndRwRow,
                        editableRow: roAndRwRow,
                        deletableRow
                    });

                return this.catsTableComp.init();
            });
    }

    close() {
        super.close();
        if (this.catsTableComp) {
            this.catsTableComp.close();
        }
    }
}