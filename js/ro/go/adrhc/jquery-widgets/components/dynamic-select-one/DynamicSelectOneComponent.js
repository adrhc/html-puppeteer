/**
 * @requires {DynamicSelectOneView} view
 * @requires {DynaSelOneStateHolder} state
 * @requires {DynaSelOneConfig} config
 * @requires {DynaSelOneChildishBehaviour} childishBehaviour
 */
class DynamicSelectOneComponent extends AbstractComponent {
    /**
     * @param {string} elemIdOrJQuery
     * @param {function(): IdentifiableEntity} toEntityConverter
     * @param {DynaSelOneConfig} config
     * @param view
     * @param repository
     * @param state
     * @param compositeBehaviour
     * @param childCompFactories
     * @param childishBehaviour
     * @param parentComponent
     */
    constructor({
                    elemIdOrJQuery,
                    toEntityConverter,
                    config = DynaSelOneConfig.configOf(elemIdOrJQuery, {toEntityConverter}),
                    view = new DynamicSelectOneView(elemIdOrJQuery, config),
                    state = new DynaSelOneStateHolder(config),
                    compositeBehaviour,
                    childCompFactories,
                    childishBehaviour,
                    parentComponent,
                    repository,
                }) {
        super({
            view,
            state,
            compositeBehaviour,
            childCompFactories,
            childishBehaviour,
            parentComponent,
            config: config.dontAutoInitializeOf()
        });
        this.repository = repository;
        this.handleWithAny(true);
        return this._handleAutoInitialization(config);
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
        return this._updateByTitle().then(() => {
            this.dynaSelOneView.focusMe()
        });
    }

    _onEnter(text) {
        console.log(`[${this.constructor.name}._onEnter] text = ${text}`);
        return this._updateByTitle(text).then(() => {
            if (!this.dynaSelOneState.currentState.selectedItem) {
                this.dynaSelOneView.focusMe()
            }
        });
    }

    _onBlur(text) {
        console.log(`[${this.constructor.name}._onBlur] text = ${text}`);
        return this._updateByTitle(text, true);
    }

    onSearchInputBlur(ev) {
        const _this = ev.data;
        const text = $(this).val();
        console.log(`[${this.constructor.name}.onSearchInputBlur] text = ${text}`);
        return _this._updateByTitle(text, true);
    }

    /**
     * @param {string} [title]
     * @param {boolean} [isOnBlur] for true reject update with same title
     * @returns {Promise<StateChange[]>|Promise}
     */
    _updateByTitle(title = "", isOnBlur) {
        if ((this.dynaSelOneConfig.cacheSearchResults || isOnBlur) && this.dynaSelOneState.currentState.title === title) {
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
            DynaSelOneStateHolder.startsWith(title, this.dynaSelOneState.currentState.title)) {
            // new title contains the current title: searching existing options
            return this._updateUsingPreviouslyFoundOptions(title);
        } else {
            // new title doesn't contain the current title: searching the DB
            return this._updateBySearchingTheRepository(title);
        }
    }

    _reloadState() {
        const title = this.dynaSelOneState.currentState.title;
        if (!this.dynaSelOneConfig.loadOptionsOnInit || !this.dynaSelOneConfig.isEnoughTextToSearch(title)) {
            return super._reloadState();
        }
        return this.repository.findByTitle(title).then(options => {
            const selectedItem = this._findOptionByExactTitle(title, options);
            if (selectedItem) {
                return this.dynaSelOneState.updateUsingDynaSelOneItem(selectedItem);
            }
            return this.dynaSelOneState.replaceEntirely(new DynaSelOneState(title, options));
        });
    }

    /**
     * @param {string} title
     * @return {Promise<StateChange[]>}
     * @protected
     */
    _updateBySearchingTheRepository(title) {
        console.log(`[${this.constructor.name}._updateBySearchingTheRepository] title = ${title}`);
        return this.repository.findByTitle(title).then(options => {
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
        const $comp = this.view.$elem;

        $comp.on(this._appendNamespaceTo('keyup'),
            `[name='${this.dynaSelOneView.titleInputName}']`, this, this.onKeyup);

        $comp.on(this._appendNamespaceTo(['click', 'keyup']),
            'option', this, this.onOptionClick);

        // comp.on('keyup blur mouseleave', "[name='title']", this, this.onKeyup);
        // comp.find("[name='title']").on("keyup blur mouseleave", this, this.onKeyup);
        // this._configureOnBlur();

        if (this.dynaSelOneConfig.searchOnBlur) {
            $comp.on(this._appendNamespaceTo('blur'),
                `[name='${this.dynaSelOneConfig.name}']`, this, this.onSearchInputBlur);
        }
        // comp.on('change.dyna-sel-one keyup.dyna-sel-one', "[name='options']", this, this.onOptionClick);
    }

    _configureOnBlur() {
        if (this.dynaSelOneConfig.searchOnBlur) {
            this.view.$elem.on(this._appendNamespaceTo('blur'),
                `[name='${this.dynaSelOneConfig.name}']`, this, this.onSearchInputBlur);
        }
    }

    _removeOnBlurHandler() {
        this.view.$elem.off("blur", `[name='${this.dynaSelOneConfig.name}']`);
    }

    updateViewOnAny(stateChange) {
        this._removeOnBlurHandler();
        return super.updateViewOnAny(stateChange).then(() => this._configureOnBlur());
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