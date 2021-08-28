/**
 * @requires {DynamicSelectOneView} view
 * @requires {DynaSelOneStateHolder} state
 * @requires {DynaSelOneConfig} config
 * @requires {DynaSelOneChildishBehaviour} childishBehaviour
 */
class DynamicSelectOneComponent extends AbstractComponent {
    /**
     * @type {DynaSelOneRepository}
     */
    repository;

    /**
     * @param {string} elemIdOrJQuery
     * @param {function(): IdentifiableEntity} toEntityConverter
     * @param {boolean} dontAutoInitialize
     * @param {boolean} loadOptionsOnInit
     * @param {DynaSelOneConfig} config
     * @param {DynamicSelectOneView} view
     * @param {DynaSelOneState} initialState
     * @param {DynaSelOneRepository} repository
     * @param {DynaSelOneStateHolder} state
     * @param {CompositeBehaviour} compositeBehaviour
     * @param {childCompFactoryFn|childCompFactoryFn[]|ChildComponentFactory|ChildComponentFactory[]} childCompFactories
     * @param {ChildishBehaviour} childishBehaviour
     * @param {AbstractComponent} parentComponent
     */
    constructor({
                    elemIdOrJQuery,
                    toEntityConverter,
                    dontAutoInitialize,
                    loadOptionsOnInit,
                    childishBehaviour,
                    parentComponent,
                    config = new DynaSelOneConfig({
                        elemIdOrJQuery,
                        toEntityConverter,
                        loadOptionsOnInit,
                        dontAutoInitialize: dontAutoInitialize ?? AbstractComponent
                            .canConstructChildishBehaviour(childishBehaviour, parentComponent)
                    }),
                    view = new DynamicSelectOneView(elemIdOrJQuery, config),
                    initialState,
                    state = new DynaSelOneStateHolder(config, {initialState}),
                    compositeBehaviour,
                    childCompFactories,
                    repository,
                }) {
        super({
            view,
            state,
            compositeBehaviour,
            childCompFactories,
            childishBehaviour,
            parentComponent,
            config,
            forceDontAutoInitialize: true
        });
        this.repository = repository;
        view.component = this;
        this.handleWithAny(true);
        this._handleAutoInitialization();
    }

    onOptionClick(ev) {
        ev.stopPropagation();
        if (ev.key !== "Enter" && ev.type !== "click") {
            return true;
        }
        const _this = ev.data;
        const selectedId = $(this).val();

        console.log(`[${this.constructor.name}.onOptionClick] selectedId = ${selectedId}`);
        return _this.doWithState(() => _this.dynaSelOneState.updateById(selectedId));
    }

    onKeyup(ev) {
        ev.stopPropagation();
        // console.log(ev);
        if (ev.key !== "Escape" && ev.key !== "Enter" && ev.type !== "blur") {
            // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
            return true;
        }
        const _this = ev.data;
        const command = ev.type !== "blur" ? ev.key : "Blur";
        const text = $(this).val();
        return _this[`_on${command}`](text);
    }

    _onEscape() {
        console.log(`[${this.constructor.name}._onEscape]`);
        $(this).val("");
        return this._updateByTitle().then(() => this.dynaSelOneView.focusMe());
    }

    _onEnter(text) {
        console.log(`[${this.constructor.name}._onEnter] text = ${text}`);
        return this._updateByTitle(text).then(() => this.dynaSelOneView.focusMe());
    }

    _onBlur(text) {
        console.log(`[${this.constructor.name}._onBlur] text = ${text}`);
        return this._updateByTitle(text, true);
    }

    _searchWhenLostFocus(ev) {
        const _this = ev.data;
        const text = $(this).val();
        console.log(`[${this.constructor.name}._searchWhenLostFocus] text = ${text}`);
        return _this._updateByTitle(text, true);
    }

    /**
     * @param {string} [title]
     * @param {boolean} [isOnBlur] for true reject update with same title
     * @returns {Promise<StateChange[]>|Promise}
     */
    _updateByTitle(title = "", isOnBlur) {
        const currentState = this.dynaSelOneState.currentState;
        if ((this.dynaSelOneConfig.cacheSearchResults || isOnBlur) &&
            currentState.repositoryWasSearched && currentState.title === title) {
            // updating with same title
            console.warn(`[${this.constructor.name}._updateByTitle] rejecting update with same title: ${title ?? "nothing"}`);
            return Promise.resolve();
        }
        if (!this.dynaSelOneConfig.isEnoughTextToSearch(title)) {
            // new title is too short
            console.log(`[${this.constructor.name}._updateByTitle] too short title = ${title}`);
            return this.doWithState(() => this.dynaSelOneState.replaceEntirely(
                new DynaSelOneState(title, undefined, undefined, false)));
        }
        if (this.dynaSelOneConfig.cacheSearchResults &&
            this.currentOptionsAreResultOfSearch &&
            DynaSelOneStateHolder.startsWith(title, currentState.title)) {
            // new title contains the current title: searching existing options
            return this._updateUsingPreviouslyFoundOptions(title);
        } else {
            // new title doesn't contain the current title: searching the DB
            return this._updateBySearchingTheRepository(title);
        }
    }

    _reloadState() {
        const title = this.dynaSelOneState.currentState.title;
        if (!this.dynaSelOneConfig.loadOptionsOnInit) {
            if (this.dynaSelOneState.isPristine()) {
                return this.doWithState(() => this.dynaSelOneState.replaceEntirely(
                    this.dynaSelOneState.currentState, {forceUpdate: true}));
            } else {
                return super._reloadState();
            }
        }
        return this._repositoryFindByTitle(title);
    }

    /**
     * @param {string} title
     * @return {Promise<StateChange[]>}
     * @protected
     */
    _updateBySearchingTheRepository(title) {
        console.log(`[${this.constructor.name}._updateBySearchingTheRepository] title = ${title}`);
        return this._repositoryFindByTitle(title);
    }

    /**
     * @param {string} title
     * @return {Promise<DynaSelOneItem[]>}
     * @protected
     */
    _repositoryFindByTitle(title) {
        return this.repository.findByTitle(title)
            .then(options => {
                const selectedItem = this._findOptionByExactTitle(title, options);
                if (selectedItem) {
                    return this.doWithState(() => this.dynaSelOneState.updateUsingDynaSelOneItem(selectedItem));
                }
                return this.doWithState(() => this.dynaSelOneState.replaceEntirely(new DynaSelOneState(title, options)));
            });
    }

    /**
     * @param {string} title
     * @return {Promise<StateChange[]>|Promise}
     * @protected
     */
    _updateUsingPreviouslyFoundOptions(title) {
        console.log(`[${this.constructor.name}._updateByUsingPreviouslyFoundOptions] title = ${title}`);
        const options = this._findOptionsByTitlePrefix(title);
        if (!options || !options.length) {
            return Promise.resolve();
        }
        if (options.length === 1) {
            return this.doWithState(() => this.updateUsingDynaSelOneItem(options[0]));
        } else {
            return this.doWithState(() => this.dynaSelOneState.replaceEntirely(new DynaSelOneState(title, options)));
        }
    }

    /**
     * @param text {string}
     * @returns {DynaSelOneItem[]|undefined}
     */
    _findOptionsByTitlePrefix(text) {
        if (!this.currentState.options) {
            return undefined;
        }
        return this.currentState.options.filter(opt => DynaSelOneStateHolder.startsWith(opt.title, text));
    }

    /**
     * @param {string} title
     * @param {DynaSelOneItem[]} options
     * @returns {DynaSelOneItem|undefined}
     * @protected
     */
    _findOptionByExactTitle(title = "", options) {
        if (!options) {
            return undefined;
        }
        return options.find(opt => opt.title.toLowerCase() === title.toLowerCase());
    }

    /**
     * linking "outside" (and/or default) triggers to component's handlers (aka capabilities)
     */
    _configureEvents() {
        this.dynaSelOneView.attachSearchKeyupHandler(this.onKeyup);
        this.dynaSelOneView.attachOptionClickHandler(this.onOptionClick);
        this._configureOnBlur();
    }

    _setupChildishBehaviour({
                                childishBehaviour,
                                parentComponent,
                                childProperty = this.config.childProperty,
                                toEntityConverter = this.dynaSelOneConfig.toEntityConverter
                            }) {
        if (!childishBehaviour && !parentComponent) {
            console.log(`[${this.constructor.name}._setupChildishBehaviour] no childish behaviour`);
            return;
        }
        childishBehaviour = childishBehaviour ?? new DynaSelOneChildishBehaviour(
            parentComponent, {childProperty, toEntityConverter});
        childishBehaviour.childComp = this;
        this.childishBehaviour = childishBehaviour;
    }

    init() {
        return super.init().then(() => {
            if (this.dynaSelOneConfig.focus) {
                this.dynaSelOneView.focusMe();
            }
        })
    }

    updateViewOnAny(stateChange) {
        this.dynaSelOneView.removeOnBlurHandlers();
        return super.updateViewOnAny(stateChange).then(() => this._configureOnBlur());
    }

    _configureOnBlur() {
        if (this.dynaSelOneConfig.searchOnBlur) {
            this.dynaSelOneView.attachOnBlurHandler(this._searchWhenLostFocus);
        }
    }

    /**
     * @returns {boolean}
     */
    get currentOptionsAreResultOfSearch() {
        return this.dynaSelOneConfig.isEnoughTextToSearch(this.dynaSelOneState.currentState.title);
    }

    /**
     * @return {DynaSelOneConfig}
     */
    get dynaSelOneConfig() {
        return this.config;
    }

    /**
     * @return {DynaSelOneStateHolder}
     */
    get dynaSelOneState() {
        return this.state;
    }

    /**
     * @return {DynamicSelectOneView}
     */
    get dynaSelOneView() {
        return this.view;
    }
}