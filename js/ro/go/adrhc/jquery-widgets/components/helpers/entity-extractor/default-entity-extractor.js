class DefaultEntityExtractor extends EntityExtractor {
    /**
     * @type {AbstractComponent}
     */
    component;

    /**
     * @param component {AbstractComponent}
     */
    constructor(component) {
        super();
        this.component = component;
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
            return this._clearInvalidId(inputValues);
        }
    }

    extractAllEntities(useOwnerOnFields) {
        const inputValues = this._extractInputValues(useOwnerOnFields);
        if (inputValues == null) {
            return inputValues;
        }
        if ($.isArray(inputValues)) {
            return inputValues.map(it => this._clearInvalidId(it));
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
        const item = this.component.view.extractInputValues(useOwnerOnFields);
        this.component.compositeBehaviour.copyKidsState(item);
        return item;
    }

    _clearInvalidId(inputValues) {
        return EntityUtils.removeGeneratedOrInvalidId(inputValues);
    }
}