class CreateDeleteListComponent extends ElasticListComponent {
    /**
     * ADD
     *
     * @param ev {Event}
     */
    onAdd(ev) {
        ev.stopPropagation();
        /**
         * @type {CreateDeleteListComponent}
         */
        const cdlComp = ev.data;
        cdlComp.doWithState((state) => {
            cdlComp.castState(state).createNewItem({id: EntityUtils.generateId()});
        });
    }

    /**
     * DELETE
     *
     * @param ev {Event}
     */
    onDelete(ev) {
        ev.stopPropagation();
        /**
         * @type {CreateDeleteListComponent}
         */
        const cdlComp = ev.data;
        const rowDataId = cdlComp.tableBasedView.rowDataIdOf(this, true);
        cdlComp.doWithState((state) => {
            cdlComp.castState(state).removeById(rowDataId);
        });
    }

    /**
     * linking triggers to component's handlers (aka capabilities)
     *
     * @private
     */
    _configureEvents() {
        super._configureEvents();
        this.view.$elem
            .on(this._appendNamespaceTo("click"),
                this._btnSelector("add"), this, this.onAdd)
            .on(this._appendNamespaceTo('click'),
                this._btnSelector("delete"), this, this.onDelete);
    }

    /**
     * @param {StateHolder} state
     * @return {CrudListState}
     */
    castState(state) {
        return state;
    }
}
