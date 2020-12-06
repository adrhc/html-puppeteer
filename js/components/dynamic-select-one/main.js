class DynamicSelectOneComponent {
    /**
     * @param dynaSelOneView {DynamicSelectOneView}
     * @param state {DynamicSelectOneState}
     */
    constructor(dynaSelOneView, state) {
        this.dynaSelOneView = dynaSelOneView;
        this.state = state;
    }

    onOptionClick(ev) {
        if (ev.key !== "Enter" && ev.type !== "click") {
            return true;
        }
        const _this = ev.data;
        _this.state.updateById($(this).val())
            .then(state => _this.updateView(state));
    }

    onKeyup(ev) {
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
        this.dynaSelOneView.init(this.state)
            .then(() => this._configureEvents());
    }

    updateView(state, focusOnSearchInput) {
        return this.dynaSelOneView
            .updateView(state, focusOnSearchInput)
            .then(() => this._configureOnBlur());
    }

    /**
     * linking "outside" (and/or default) triggers to component's handlers (aka capabilities)
     */
    _configureEvents() {
        const comp = $(`#${this.dynaSelOneView.elemId}`);

        comp.on('keyup.dyna-sel-one', "[name='title']", this, this.onKeyup);
        // comp.on('keyup blur mouseleave', "[name='title']", this, this.onKeyup);
        // comp.find("[name='title']").on("keyup blur mouseleave", this, this.onKeyup);
        this._configureOnBlur();

        comp.on('click.dyna-sel-one keyup.dyna-sel-one', 'option', this, this.onOptionClick);
        // comp.on('change.dyna-sel-one keyup.dyna-sel-one', "[name='options']", this, this.onOptionClick);
    }

    _configureOnBlur() {
        this.dynaSelOneView.$searchInputElem[0].onblur = (ev) => {
            ev.data = this;
            this.onKeyup.bind(ev.target)(ev, true);
        };
    }
}