/**
 * Owner and $elem are something like a configuration so should not be reset.
 *
 * @abstract
 */
class AbstractView {
    /**
     * @type {jQuery<HTMLElement>}
     * @protected
     */
    _$elem;

    /**
     * @type {string}
     * @protected
     */
    _owner;

    /**
     * @param elemIdOrJQuery {string|jQuery<HTMLTableRowElement>}
     * @protected
     */
    _setupElem(elemIdOrJQuery) {
        if (elemIdOrJQuery instanceof jQuery) {
            this._$elem = elemIdOrJQuery;
        } else {
            this._$elem = $(`#${elemIdOrJQuery}`);
        }
    }

    /**
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
    }

    /**
     * @param stageChanges {StateChange|StateChange[]}
     * @return {Promise<StateChange|StateChange[]>}
     */
    update(stageChanges) {
        return Promise.resolve(stageChanges);
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
     * owner and $elem are something like a configuration so should not be reset
     *
     * owner and $elem: if any would be changed then the new value would be
     * used while there's no loss if the previous value is simply overwritten
     */
    reset() {
        // do nothing
    }
}