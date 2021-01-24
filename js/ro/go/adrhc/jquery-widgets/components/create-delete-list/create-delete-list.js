/**
 * A component acting as a container for its kids. Its view is irrelevant because is composed by the kids views!
 */
class CreateDeleteListComponent extends ElasticListComponent {
    /**
     * remove the previous kids before reloading the table
     */
    _reload() {
        this.doWithState((crudListState) => {
            this.compositeBehaviour.childComponents.forEach(kid => {
                crudListState.removeById(kid.state.currentState.id);
            });
        }).then(() => super._reload());
    }

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
     * The rows are created as child components (see ElasticListCompositeBehaviour._createChildComponents).
     *
     * @param stateChange
     * @return {Promise<StateChange>}
     */
    updateViewOnUPDATE_ALL(stateChange) {
        return Promise.resolve(stateChange);
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