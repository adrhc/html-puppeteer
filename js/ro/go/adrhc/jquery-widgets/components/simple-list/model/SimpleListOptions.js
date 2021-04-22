class SimpleListOptions {
    /**
     * @type {string|jQuery<HTMLTableElement>}
     */
    elemIdOrJQuery;
    /**
     * @type {string}
     */
    bodyRowTmplId;
    /**
     * @type {string}
     */
    bodyRowTmplHtml;
    /**
     * @type {string}
     */
    bodyTmplHtml;
    /**
     * @type {string}
     */
    rowDataId;
    /**
     * @type {string}
     */
    rowPositionOnCreate;
    /**
     * @type {string}
     */
    childProperty;
    /**
     * @type {boolean}
     */
    dontAutoInitialize;
    /**
     * @type {ChildishBehaviour}
     */
    childishBehaviour;
    /**
     * @type {AbstractComponent}
     */
    parentComponent;
    /**
     * @type {SimpleListConfiguration}
     */
    config;
    /**
     * @type {string|IdentifiableEntity[]}
     */
    items;
    /**
     * @type {CrudRepository}
     */
    repository;
    /**
     * @type {SimpleListState}
     */
    state;
    /**
     * @type {MustacheTableElemAdapter}
     */
    mustacheTableElemAdapter;
    /**
     * @type {SimpleListView}
     */
    view;
    /**
     * @type {CompositeBehaviour}
     */
    compositeBehaviour;
    /**
     * @typedef {function(parentComp: AbstractComponent): AbstractComponent} childCompFactoryFn
     * @type {childCompFactoryFn|childCompFactoryFn[]|ChildComponentFactory|ChildComponentFactory[]}
     */
    childCompFactories;
}