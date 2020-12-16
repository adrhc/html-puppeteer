/**
 * todo: should I reset the onOffState when receiving an UPDATE_ALL state change?
 * When receiving UPDATE_ALL, and notSelectedRow is not automatically creating the related row,
 * than the next onSelectionSwitch will determine onOffState to render as "deselected" the previous
 * item but only if already exists (its row) otherwise nothing will be rendered for it.
 */
class SelectableElasticListComponent extends ElasticSimpleListComponent {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param repository {CrudRepository}
     * @param state {SelectableElasticListState}
     * @param view {SimpleListView}
     * @param notSelectedRow {IdentifiableRow}
     * @param selectedRow {IdentifiableRow}
     */
    constructor(mustacheTableElemAdapter,
                repository, state, view,
                notSelectedRow, selectedRow) {
        super(mustacheTableElemAdapter, repository, state, view, notSelectedRow);
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
        selectableList._switchToId(rowDataId);
    }

    /**
     * @param rowDataId {string|number}
     * @protected
     */
    _switchToId(rowDataId) {
        this.state.switchTo(rowDataId);
        this.state.consumeAll()
            .filter(onOffStateChange => onOffStateChange.requestType === "SELECT")
            .map(it => it.state)
            .filter(onOff => onOff.state)
            .forEach(onOff => {
                console.log("SelectableElasticListComponent.onSelectionSwitch\n", onOff);
                console.log(JSON.stringify(onOff));
                this._rowSelector[onOff.isOff].update(onOff.state);
            });
    }

    /**
     * linking "outside" (and/or default) triggers to component's handlers (aka capabilities)
     * @protected
     */
    _configureEvents() {
        this.mustacheTableElemAdapter.$table
            .on(this.withNamespaceFor('dblclick'),
                `tr${this.ownerSelector}`, this, this.onSelectionSwitch);
    }
}