/**
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
        // do nothing
    }

    /**
     * @param [useOwnerOnFields] {boolean}
     * @return {{}}
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

    reset() {
        this._$elem = undefined;
        this._owner = undefined;
    }
}