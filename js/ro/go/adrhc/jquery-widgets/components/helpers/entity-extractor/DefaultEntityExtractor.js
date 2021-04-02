class DefaultEntityExtractor extends EntityExtractor {
    /**
     * @type {AbstractComponent}
     */
    component;
    /**
     * @type {boolean}
     */
    dontRemoveGeneratedId;
    /**
     * @type {function({}): IdentifiableEntity}
     */
    entityConverterFn;

    /**
     * @param component {AbstractComponent}
     * @param [dontRemoveGeneratedId] {boolean}
     * @param [entityConverterFn] {function({}): IdentifiableEntity}
     */
    constructor(component, {
        dontRemoveGeneratedId,
        entityConverterFn = IdentifiableEntity.entityConverter
    } = {
        entityConverterFn: IdentifiableEntity.entityConverter
    }) {
        super();
        this.component = component;
        this.dontRemoveGeneratedId = dontRemoveGeneratedId;
        this.entityConverterFn = entityConverterFn;
    }

    extractEntity(useOwnerOnFields) {
        const inputValues = this._extractInputValues(useOwnerOnFields);
        if (inputValues == null) {
            return inputValues;
        }
        if ($.isArray(inputValues)) {
            console.error("extractEntity is managing 1 entity only!");
            throw EntityExtractor.EXTRACT_ENTITY_UNSUPPORTED;
        } else {
            const itemData = this._clearInvalidId(inputValues);
            return this.entityConverterFn(itemData);
        }
    }

    extractAllEntities(useOwnerOnFields) {
        const inputValues = this._extractInputValues(useOwnerOnFields);
        if (inputValues == null) {
            return inputValues;
        }
        if ($.isArray(inputValues)) {
            return inputValues.map(it => {
                const itemData = this._clearInvalidId(it);
                return this.entityConverterFn(itemData);
            });
        } else {
            console.error("extractEntity is managing more than 1 entity!");
            throw EntityExtractor.EXTRACT_ENTITIES_UNSUPPORTED;
        }
    }

    /**
     * When having kids and useOwnerOnFields is null than the owner must be is
     * used for the parent fields otherwise useOwnerOnFields value considered.
     *
     * @param [useOwnerOnFields] {boolean}
     * @return {{}} the partially or totally the entity/entities data managed by the component
     * @protected
     */
    _extractInputValues(useOwnerOnFields) {
        if (useOwnerOnFields == null) {
            useOwnerOnFields = this.component.compositeBehaviour.hasKids();
        }
        const inputValues = this.component.view.extractInputValues(useOwnerOnFields);
        this.component.compositeBehaviour.updateFromKidsView(inputValues);
        return inputValues;
    }

    _clearInvalidId(inputValues) {
        if (this.dontRemoveGeneratedId) {
            return EntityUtils.removeInvalidId(inputValues);
        } else {
            return EntityUtils.removeGeneratedOrInvalidId(inputValues);
        }
    }
}