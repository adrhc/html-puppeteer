/**
 * Owner and $elem are something like a configuration so should not be reset.
 *
 * @abstract
 */
class AbstractView {
    /**
     * @param elemIdOrJQuery {string|jQuery<HTMLTableRowElement>}
     * @protected
     */
    _setupElem(elemIdOrJQuery) {
        this._$elem = DomUtils.jQueryOf(elemIdOrJQuery);
    }

    /**
     * Depends on this._$elem!
     *
     * @protected
     */
    _setupOwner() {
        const dataOwner = this.$elem.data("owner");
        if (dataOwner) {
            this._owner = dataOwner;
        } else {
            const dataId = this.$elem.data("id");
            this._owner = dataId ? dataId : this.$elem.attr("id");
        }
        if (!this.owner) {
            this._owner = this.$elem.data("jqw-type")
        }
    }

    /**
     * @param {StateChange} stateChange
     * @return {Promise<StateChange>}
     */
    update(stateChange) {
        return Promise.resolve(stateChange);
    }

    /**
     * @param [useOwnerOnFields] {boolean}
     * @return {{}} the partially or totally the entity/entities data presented by the view
     */
    extractInputValues(useOwnerOnFields) {
        if (!this.$elem || !this.$elem.length) {
            console.warn(`${this.constructor.name} $elem is null or empty!`);
            return undefined;
        }
        return FormUtils.prototype.objectifyInputsOf(this.$elem, useOwnerOnFields ? this.owner : undefined);
    }

    /**
     * @param {string} name is the HTML data attribute name
     * @return {string}
     */
    data(name) {
        return this.$elem?.data(name);
    }

    booleanData() {
        const value = this.$elem?.data(name);
        return value === "true" ? true : (value === "false" ? false : undefined);
    }

    /**
     * owner and $elem are something like a configuration so should not be reset
     *
     * owner and $elem: if any would be changed then the new value would be
     * used while there's no loss if the previous value is simply overwritten
     */
    reset() {
        // do nothing
    }

    /**
     * @type {jQuery<HTMLElement>}
     * @protected
     */
    _$elem;

    /**
     * @return {jQuery<HTMLElement>}
     */
    get $elem() {
        return this._$elem;
    }

    /**
     * @param $elem {jQuery<HTMLElement>}
     */
    set $elem($elem) {
        this._$elem = $elem;
    }

    /**
     * @type {string}
     * @protected
     */
    _owner;

    /**
     * @return {string}
     */
    get owner() {
        return this._owner;
    }

    /**
     * @param owner {string}
     */
    set owner(owner) {
        this._owner = owner;
    }

    /**
     * @returns {string}
     * @protected
     */
    get _eventsNamespace() {
        return `.${this.constructor.name}.${this.owner}`;
    }
}