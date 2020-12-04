class DynamicSelectOneComponent {
    /**
     * @param dynaSelOneView {DynamicSelectOneView}
     * @param state {DynamicSelectOneState}
     */
    constructor(dynaSelOneView, state) {
        this.dynaSelOneView = dynaSelOneView;
        this.state = state;
    }

    onEnterKey(ev) {
        // console.log(ev);
        if (ev.key !== "Enter" && ev.type !== "blur") {
            // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
            return false;
        }
        const _this = ev.data;
        _this.state.setTitle($(this).val())
            .then(state => _this.updateView(state, ev.type === "keyup"));
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
        // $(`#${this.dynaSelOneView.elemId} [name='title']`).on("keyup blur mouseleave", this, this.onEnterKey);
        this._configureOnBlur();
    }

    /**
     * linking "outside" (and/or default) triggers to component's handlers (aka capabilities)
     */
    _configureEvents() {
        const comp = $(`#${this.dynaSelOneView.elemId}`);

        comp.on('keyup.dyna-sel-one', "[name='title']", this, this.onEnterKey);
        // comp.on('keyup blur mouseleave', "[name='title']", this, this.onEnterKey);
        // comp.find("[name='title']").on("keyup blur mouseleave", this, this.onEnterKey);
        this._configureOnBlur();

        // option click works only when select size > 1
        comp.on('click.dyna-sel-one', 'option', this, this.onItemSelect);
        // comp.on('change', "[name='options']", this, this.onItemSelect);
    }

    _configureOnBlur() {
        this.dynaSelOneView.$searchInputElem[0].onblur = (ev) => {
            ev.data = this;
            this.onEnterKey.bind(ev.target)(ev, true);
        };
    }
}