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
        const createDeleteListComponent = ev.data;
        createDeleteListComponent.doWithState((crudListState) => {
            crudListState.createNewItem().id = EntityUtils.generateId();
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
        const createDeleteListComponent = ev.data;
        const rowDataId = createDeleteListComponent.tableBasedView.rowDataIdOf(this, true);
        createDeleteListComponent.doWithState((crudListState) => {
            crudListState.removeById(rowDataId);
        });
    }

    /**
     * linking triggers to component's handlers (aka capabilities)
     *
     * @private
     */
    configureEvents() {
        super.configureEvents();
        this.view.$elem
            .on(this._appendNamespaceTo("click"),
                this._btnSelector("add"), this, this.onAdd)
            .on(this._appendNamespaceTo('click'),
                this._btnSelector("delete"), this, this.onDelete);
    }
}