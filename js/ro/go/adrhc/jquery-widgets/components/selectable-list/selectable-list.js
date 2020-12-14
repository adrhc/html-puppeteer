class SelectableListComponent extends SimpleListComponent {
    /**
     * @param mustacheTableElemAdapter {MustacheTableElemAdapter}
     * @param repository {CrudRepository}
     * @param state {SelectableListState}
     * @param view {SimpleListView}
     */
    constructor(mustacheTableElemAdapter,
                repository, state, view) {
        super(mustacheTableElemAdapter, repository, state, view);
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
        const rowDataId = selectableList.mustacheTableElemAdapter.rowDataIdOf(this);
        selectableList.state.switchTo(rowDataId);
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