class CreateDeleteListComponent extends ElasticListComponent {
    /**
     * @param ev {Event}
     */
    onAdd(ev) {
        ev.stopPropagation();
        /**
         * @type {CreateDeleteListComponent}
         */
        const cdlComp = ev.data;
        return cdlComp.doWithState(() => {
            cdlComp.crudListState.createNewItem(new IdentifiableEntity(EntityUtils.generateId()));
        });
    }

    /**
     * @param ev {Event}
     */
    onDelete(ev) {
        ev.stopPropagation();
        /**
         * @type {CreateDeleteListComponent}
         */
        const cdlComp = ev.data;
        const rowDataId = cdlComp.tableBasedView.rowDataIdOf(this, true);
        return cdlComp.doWithState(() => {
            cdlComp.crudListState.removeById(rowDataId);
        });
    }

    /**
     * @protected
     */
    _configureEvents() {
        super._configureEvents();
        this.view.$elem
            .on(this._appendNamespaceTo("click"),
                this._btnSelector("add"), this, this.onAdd)
            .on(this._appendNamespaceTo('click'),
                this._btnSelector("delete"), this, this.onDelete);
    }
}
