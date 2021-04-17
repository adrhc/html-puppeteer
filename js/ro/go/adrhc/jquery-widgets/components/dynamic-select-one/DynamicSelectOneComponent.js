/**
 * @requires {DynamicSelectOneView} view
 * @requires {DynaSelOneState} state
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
                    repository,
                    state = new DynaSelOneState(repository, config),
                    compositeBehaviour,
                    childCompFactories,
                    childishBehaviour,
                    parentComponent,
                }) {
        super({view, state, compositeBehaviour, childCompFactories, childishBehaviour, parentComponent, config});
    }

    _setupChildishBehaviour({
                                childishBehaviour,
                                parentComponent,
                                childProperty = this.config.childProperty,
                                toEntityConverter = this.config.toEntityConverter
                            }) {
        if (!childishBehaviour && !parentComponent) {
            console.log(`${this.constructor.name} no childish behaviour`);
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
        _this.dynaSelOneState.updateById($(this).val())
            .then(state => _this.updateView(state));
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
        return _this[`_on${command}`]($(this).val());
    }

    _onEscape() {
        this.dynaSelOneState.reset();
        return this.updateView(this.state, true);
    }

    _onEnter(text) {
        return this.dynaSelOneState.updateByTitle(text).then(state => this.updateView(state, true));
    }

    _onBlur(text) {
        return this.dynaSelOneState.updateByTitle(text, true).then(state => this.updateView(state));
    }

    /**
     * @return {Promise<void>}
     */
    init() {
        this._clearOnBlurHandlers();
        let promise;
        if (this.dynaSelOneState.reloadOptionsOnInit) {
            promise = this.dynaSelOneState.updateByTitle(this.dynaSelOneState.title)
                .then(state => this.dynaSelOneView.update(state, this.focusOnInit));
        } else {
            promise = this.dynaSelOneView.update(this.dynaSelOneState, this.focusOnInit);
        }
        return promise.then(() => this._configureEvents());
    }

    updateView(state, focusOnSearchInput) {
        this._clearOnBlurHandlers();
        return this.dynaSelOneView
            .update(state, focusOnSearchInput)
            .then(() => this._configureOnBlur());
    }

    /**
     * linking "outside" (and/or default) triggers to component's handlers (aka capabilities)
     */
    _configureEvents() {
        const view = this.dynaSelOneView;
        const $comp = view.$elem;

        $comp.on(this._appendNamespaceTo('keyup'),
            `[name='${view.titleInputName}']`, this, this.onKeyup);
        // comp.on('keyup blur mouseleave', "[name='title']", this, this.onKeyup);
        // comp.find("[name='title']").on("keyup blur mouseleave", this, this.onKeyup);
        this._configureOnBlur();

        $comp.on(this._appendNamespaceTo(['click', 'keyup']),
            'option', this, this.onOptionClick);
        // comp.on('change.dyna-sel-one keyup.dyna-sel-one', "[name='options']", this, this.onOptionClick);
    }

    _configureOnBlur() {
        if (!this.dynaSelOneState.searchOnBlur) {
            return;
        }
        // from jquery docs: blur does not propagate
        this.dynaSelOneView.$titleElem[0].onblur = (ev) => {
            ev.data = this;
            this.onKeyup.bind(ev.target)(ev, true);
        };
        // console.log(`DynamicSelectOneComponent._configureOnBlur:\n${JSON.stringify(this.extractEntity())}`);
        // console.log("DynamicSelectOneComponent selectedItem:\n", this.dynaSelOneState.selectedItem);
    }

    _clearOnBlurHandlers() {
        this.view.$elem.off(this._appendNamespaceTo("blur"));
        const $searchInputElem = this.dynaSelOneView.$titleElem;
        if ($searchInputElem.length) {
            $searchInputElem[0].onblur = null;
        }
    }

    reset() {
        this._clearOnBlurHandlers();
        super.reset();
    }

    get focusOnInit() {
        return this.view.$elem.data("focus") === true;
    }

    /**
     * @return {DynaSelOneState}
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