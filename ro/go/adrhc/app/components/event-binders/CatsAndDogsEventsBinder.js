import CreateRemoveCollectionItemsEventsBinder from "./CreateRemoveCollectionItemsEventsBinder.js";

export default class CatsAndDogsEventsBinder extends CreateRemoveCollectionItemsEventsBinder {
    /**
     * @type {boolean}
     */
    haveDogs;

    /**
     * @param {AbstractComponent} container
     * @param {boolean=} haveDogs
     */
    constructor(container, haveDogs) {
        super(container, "cats");
        this.haveDogs = haveDogs;
    }

    /**
     * @protected
     */
    _onClickCreate() {
        super._onClickCreate();
        if (this.haveDogs) {
            this._generateThenAppend("dogs");
        }
    }

    /**
     * @protected
     */
    _onClickRemove() {
        super._onClickRemove();
        if (this.haveDogs) {
            this._removeOldestItem("dogs");
        }
    }
}