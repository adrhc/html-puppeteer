/**
 * SelectableListState extends CrudListState extends SimpleListState extends TaggingStateHolder
 */
class SelectableListState extends CrudListState {
    /**
     * @type {RowSwappingStateHolder}
     */
    swappingState;

    /**
     * @param {IdentifiableEntity[]} [initialState]
     * @param {function(): IdentifiableEntity} [newEntityFactoryFn]
     * @param {boolean} [newItemsGoToTheEndOfTheList]
     * @param {RowSwappingStateHolder} [swappingState]
     */
    constructor({
                    initialState,
                    newEntityFactoryFn,
                    newItemsGoToTheEndOfTheList,
                    swappingState = new RowSwappingStateHolder()
                }) {
        super({initialState, newEntityFactoryFn, newItemsGoToTheEndOfTheList});
        this.swappingState = swappingState;
    }

    /**
     * @param {numeric|string} id
     * @param {string} context is some context data
     * @return {boolean} whether the switch actually happened or not
     */
    switchTo(id, context) {
        if (id == null) {
            console.log(`${this.constructor.name}, context = ${context}, id is null! switching off`)
            return this.switchToOff();
        }
        const item = this.findById(id);
        if (!item) {
            console.log(`${this.constructor.name}, context = ${context}, no item found for id = ${id}! switching off`)
            return this.switchToOff();
        }
        const previousEntityRowSwap = this.swappingState.currentState;
        const newEntityRowSwap = new EntityRowSwap(context, item, this.indexOf(item));
        const switched = !!this.swappingState.switchTo(newEntityRowSwap);
        if (switched) {
            this._removeIfTransient(previousEntityRowSwap);
        }
        return switched;
    }

    /**
     * @return {boolean} whether the switch off actually happened or not
     */
    switchToOff() {
        const previousEntityRowSwap = this.swappingState.currentState;
        const switched = !!this.swappingState.switchOff();
        if (switched) {
            this._removeIfTransient(previousEntityRowSwap);
        }
        return switched;
    }

    /**
     * @param {EntityRowSwap} entityRowSwap
     * @return {TaggedStateChange<EntityRow>}
     * @protected
     */
    _removeIfTransient(entityRowSwap) {
        if (this.isTransient(entityRowSwap)) {
            return this.removeTransient();
        }
    }

    /**
     * @param {EntityRowSwap} entityRowSwap
     * @return {boolean}
     * @protected
     */
    _isTransient(entityRowSwap) {
        return entityRowSwap != null && EntityUtils.isTransientId(entityRowSwap.entityId);
    }

    /**
     * @param {string|number} id
     * @return {IdentifiableEntity}
     */
    findById(id) {
        return EntityUtils.findById(id, this.items);
    }

    indexOf(item) {
        return this.items.indexOf(item);
    }

    reset() {
        super.reset();
        this.swappingState.reset();
    }
}