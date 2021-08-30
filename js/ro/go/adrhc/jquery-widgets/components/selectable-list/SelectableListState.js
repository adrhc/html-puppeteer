/**
 * CrudListState extends SimpleListState extends TaggingStateHolder extends StateHolder
 *
 * @template E
 * @extends {CrudListState<E>}
 */
class SelectableListState extends CrudListState {
    static DONT_RECORD_EVENTS = {dontRecordStateEvents: true};

    /**
     * @type {RowSwappingStateHolder}
     */
    swappingState;

    /**
     * see Documenting a destructuring parameter at https://jsdoc.app/tags-param.html#parameters-with-properties
     *
     * @param {Object} options
     * @param {undefined|RowSwappingStateHolder} options.swappingState
     * @param {{newEntityFactoryFn: (undefined|function(): IdentifiableEntity<E>), newItemsGoLast: undefined|boolean, initialState: undefined|TItem[], stateChangeMapper: undefined|TaggingStateChangeMapper<TItem,TItem>, changesCollector: undefined|StateChangesCollector<TItem>=}} superOptions
     */
    constructor({swappingState, ...superOptions}) {
        super(superOptions);
        this.swappingState = swappingState ?? new RowSwappingStateHolder();
    }

    /**
     * @param {numeric|string} id
     * @param {*} context is some context data
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
        const newEntityRowSwap = this._newEntityRowSwap(context, item.entity, this.findIndexById(item.entity.id));
        const switched = !!this.swappingState.switchTo(newEntityRowSwap, SelectableListState.DONT_RECORD_EVENTS);
        if (switched) {
            AssertionUtils.isNotNull(newEntityRowSwap);
            if (previousEntityRowSwap != null) {
                this._processSwitchedOff(previousEntityRowSwap);
            }
            this._processSwitchedOn(newEntityRowSwap);
        }
        return switched;
    }

    /**
     * @param {*} context
     * @param {IdentifiableEntity} item
     * @param {number} index
     * @return {EntityRowSwap}
     * @protected
     */
    _newEntityRowSwap(context, item, index) {
        return new EntityRowSwap(item, {context, index});
    }

    /**
     * @return {boolean} whether the switch off actually happened or not
     */
    switchToOff() {
        const previousEntityRowSwap = this.swappingState.currentState;
        const switched = !!this.swappingState.switchOff(SelectableListState.DONT_RECORD_EVENTS);
        if (switched) {
            AssertionUtils.isNotNull(previousEntityRowSwap);
            this._processSwitchedOff(previousEntityRowSwap);
        }
        return switched;
    }

    /**
     * @param {EntityRowSwap} newEntityRowSwap
     * @protected
     */
    _processSwitchedOn(newEntityRowSwap) {
        this._collectSwitch(newEntityRowSwap, SwitchType.ON);
    }

    /**
     * @param {EntityRowSwap} previousEntityRowSwap
     * @protected
     */
    _processSwitchedOff(previousEntityRowSwap) {
        this._collectSwitch(previousEntityRowSwap, SwitchType.OFF);
        if (this._isTransient(previousEntityRowSwap)) {
            this.removeTransient();
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
     * @param {EntityRowSwap} entityRowSwap
     * @param {"ON"|"OFF"} switchType
     * @return {TaggedStateChange<EntityRowSwap>}
     * @private
     */
    _collectSwitch(entityRowSwap, switchType) {
        const rowEntity = this.findById(entityRowSwap.entityId);
        if (rowEntity == null) {
            // removed entity meanwhile
            return undefined;
        }
        // entity might change after an editable or transient one is saved
        entityRowSwap.entity = rowEntity.entity;
        // index might change after removing a transient
        entityRowSwap.index = this.findIndexById(entityRowSwap.entity.id);
        return this.stateChanges.collect(new TaggedStateChange(switchType,
            undefined, entityRowSwap, undefined, entityRowSwap.index));
    }

    reset() {
        super.reset();
        this.swappingState.reset();
    }

    /**
     * @return {EntityRowSwap}
     */
    get currentEntityRowSwap() {
        return this.swappingState.currentState;
    }
}

class SwitchType {
    static ON = "ON";
    static OFF = "OFF";
}