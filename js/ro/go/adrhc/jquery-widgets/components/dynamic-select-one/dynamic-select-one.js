class DynamicSelectOneComponent extends AbstractComponent {
    /**
     * @param dynaSelOneView {DynamicSelectOneView}
     * @param state {DynaSelOneState}
     */
    constructor(dynaSelOneView, state) {
        // todo: adapt DynamicSelectOneView to BasicState
        super(state, dynaSelOneView);
        this.dynaSelOneView = dynaSelOneView;
        this.state = state;
    }

    onOptionClick(ev) {
        ev.stopPropagation();
        if (ev.key !== "Enter" && ev.type !== "click") {
            return true;
        }
        const _this = ev.data;
        _this.state.updateById($(this).val())
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
        _this[`_on${command}`]($(this).val());
    }

    _onEscape() {
        this.state.updateByTitle().finally(() => this.updateView(this.state, true));
    }

    _onEnter(text) {
        this.state.updateByTitle(text).then(state => this.updateView(state, true));
    }

    _onBlur(text) {
        this.state.updateByTitle(text).then(state => this.updateView(state));
    }

    init() {
        return this.dynaSelOneView
            .update(this.state, true)
            .then(() => this._configureEvents());
    }

    updateView(state, focusOnSearchInput) {
        return this.dynaSelOneView
            .update(state, focusOnSearchInput)
            .then(() => this._configureOnBlur());
    }

    /**
     * linking "outside" (and/or default) triggers to component's handlers (aka capabilities)
     */
    _configureEvents() {
        const view = this.dynaSelOneView;
        const $comp = view.$component;

        $comp.on(this._withNamespaceFor('keyup'),
            `[name='${view.titleInputName}']`, this, this.onKeyup);
        // comp.on('keyup blur mouseleave', "[name='title']", this, this.onKeyup);
        // comp.find("[name='title']").on("keyup blur mouseleave", this, this.onKeyup);
        this._configureOnBlur();

        $comp.on(this._withNamespaceFor(['click', 'keyup']),
            'option', this, this.onOptionClick);
        // comp.on('change.dyna-sel-one keyup.dyna-sel-one', "[name='options']", this, this.onOptionClick);
    }

    _configureOnBlur() {
        // from jquery docs: blur does not propagate
        this.dynaSelOneView.$titleElem[0].onblur = (ev) => {
            ev.data = this;
            this.onKeyup.bind(ev.target)(ev, true);
        };
        // console.log(`DynamicSelectOneComponent._configureOnBlur:\n${JSON.stringify(this.extractEntity())}`);
        // console.log("DynamicSelectOneComponent selectedItem:\n", this.state.selectedItem);
    }

    close() {
        this.dynaSelOneView.$component.off();
    }

    get owner() {
        return this.dynaSelOneView.owner;
    }
}