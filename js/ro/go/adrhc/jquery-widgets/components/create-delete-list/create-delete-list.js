class CreateDeleteListComponent extends ElasticListComponent {
    /**
     * @return {Promise<StateChange[]|undefined>}
     */
    init() {
        return super.init()
            .then((stateChanges) => {
                this._configureEvents();
                return stateChanges;
            });
    }

    /**
     * RELOAD
     *
     * @param ev {Event}
     */
    onReload(ev) {
        ev.stopPropagation();
        /**
         * @type {CreateDeleteListComponent}
         */
        const createDeleteListComponent = ev.data;
        createDeleteListComponent.reload();
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
        if (EntityUtils.isIdGenerated(rowDataId)) {
            createDeleteListComponent._removeById(rowDataId);
        } else {
            createDeleteListComponent._handleRepoErrors(createDeleteListComponent.repository.delete(rowDataId))
                .then(() => createDeleteListComponent._removeById(rowDataId));
        }
    }

    /**
     * @param rowDataId {string|number}
     * @return {Promise<StateChange[]>}
     * @protected
     */
    _removeById(rowDataId) {
        return this.doWithState((crudListState) => {
            crudListState.removeById(rowDataId);
        });
    }

    reload() {
        this.compositeBehaviour.close();
        return this._reloadState().then(() => super.init());
    }

    /**
     * linking triggers to component's handlers (aka capabilities)
     *
     * @private
     */
    _configureEvents() {
        this.view.$elem
            .on(this._appendNamespaceTo('click'),
                `${this._ownerSelector}[data-btn='add']`, this, this.onAdd)
            .on(this._appendNamespaceTo('click'),
                `${this._ownerSelector}[data-btn='reload']`, this, this.onReload)
            .on(this._appendNamespaceTo('click'),
                `${this._ownerSelector}[data-btn='delete']`, this, this.onDelete);
    }
}