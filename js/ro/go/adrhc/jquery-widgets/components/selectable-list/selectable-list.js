/**
 * The click on header will determine the deletion of the previous clicked row (if any)
 * which is because there'll be a switch from an item != undefined to an item = undefined.
 */
class SelectableListComponent extends SimpleListComponent {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param repository {CrudRepository}
     * @param state {SelectableListState}
     * @param view {SimpleListView}
     * @param notSelectedRow {IdentifiableRow}
     * @param selectedRow {IdentifiableRow}
     */
    constructor(mustacheTableElemAdapter,
                repository, state, view,
                notSelectedRow, selectedRow) {
        super(mustacheTableElemAdapter, repository, state, view);
        this._rowSelector = {
            false: selectedRow,
            true: notSelectedRow
        };
    }

    init() {
        return super.init().then(() => this._configureEvents());
    }

    /**
     * (existing) item selection event handler
     *
     * @param ev {Event}
     */
    onSelectionSwitch(ev) {
        const selectableList = ev.data;
        if (!$(this).is("tr,td,th")) {
            return;
        }
        ev.stopPropagation();
        const rowDataId = selectableList.view.rowDataIdOf(this);
        selectableList.state.switchTo(rowDataId);
        selectableList.state.consumeAll()
            .filter(onOffState => onOffState.requestType === "SELECT")
            .map(it => it.state)
            .forEach(onOff => {
                console.log("SelectableListComponent.onSelectionSwitch\n", onOff);
                console.log(JSON.stringify(onOff));
                selectableList._rowSelector[onOff.isOff].update(onOff.state);
            });
    }

    /**
     * linking "outside" (and/or default) triggers to component's handlers (aka capabilities)
     * @private
     */
    _configureEvents() {
        this.mustacheTableElemAdapter.$table
            .on(this.withNamespaceFor('dblclick'),
                `tr${this.ownerSelector}`, this, this.onSelectionSwitch);
    }
}