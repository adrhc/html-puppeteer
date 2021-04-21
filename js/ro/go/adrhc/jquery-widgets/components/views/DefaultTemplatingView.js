class DefaultTemplatingView extends AbstractTemplatingView {
    constructor(elemIdOrJQuery, config) {
        super();
        this._setupElem(elemIdOrJQuery);
        this._setupOwner();
        this._setupCachedHtmlTemplate(config);
    }
}