class DynamicSelectOneComponent {
    /**
     * @param dynaSelOneView {DynamicSelectOneView}
     * @param state {DynamicSelectOneState}
     */
    constructor(dynaSelOneView, state) {
        this.dynaSelOneView = dynaSelOneView;
        this.state = state;
    }

    onKeyup(ev) {
        // console.log(ev);
        if (ev.key !== "Escape" && ev.key !== "Enter" && ev.type !== "blur") {
            // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
            return false;
        }
        const _this = ev.data;
        const command = ev.type !== "blur" ? ev.key : "Blur";
        _this[`_on${command}`]($(this).val());
    }

    _onEscape() {
        this.state.reset().then(state => this.updateView(state, true));
    }

    _onEnter(text) {
        this.state.setTitle(text).then(state => this.updateView(state, true));
    }

    _onBlur(text) {
        this.state.deactivateEdit(text).then(state => this.updateView(state));
    }

    onItemSelect(ev) {
        const _this = ev.data;
        _this.state.setSelectItemId($(this).val())
            .then(state => _this.updateView(state));
    }

    init() {
        this.dynaSelOneView.init(this.state);
        this._configureEvents();
    }

    updateView(state, focusOnSearchInput) {
        this.dynaSelOneView.updateView(state, focusOnSearchInput);
        // $(`#${this.dynaSelOneView.elemId} [name='title']`).on("keyup blur mouseleave", this, this.onKeyup);
        this._configureOnBlur();
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

        // option click works only when select size > 1
        comp.on('click.dyna-sel-one', 'option', this, this.onItemSelect);
        // comp.on('change', "[name='options']", this, this.onItemSelect);
    }

    _configureOnBlur() {
        this.dynaSelOneView.$searchInputElem[0].onblur = (ev) => {
            ev.data = this;
            this.onKeyup.bind(ev.target)(ev, true);
        };
    }
}