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
        if (ev.key !== "Enter") {
            // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
            return false;
        }
        const _this = ev.data;
        _this.state.setTitle($(this).val())
            .then(state => _this.updateView(state, true));
    }

    onBlur(ev) {
        const _this = ev.data;
        _this.state.setTitle($(this).val())
            .then(state => _this.updateView(state));
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

    updateView(state, keepFocus) {
        this.dynaSelOneView.updateView(state, keepFocus);
        // $(`#${this.dynaSelOneView.elemId} [name='title']`).on("keyup blur mouseleave", this, this.onEnterKey);
        this._configureBlurEvent();
    }

    _configureBlurEvent() {
        $(`#${this.dynaSelOneView.elemId} [name='title']`)[0].onblur = (ev) => {
            ev.data = this;
            this.onBlur.bind(ev.target)(ev, true);
        };
    }

    /**
     * linking "outside" (and/or default) triggers to component's handlers (aka capabilities)
     */
    _configureEvents() {
        const comp = $(`#${this.dynaSelOneView.elemId}`);

        comp.on('keyup', "[name='title']", this, this.onEnterKey);
        // comp.on('keyup blur mouseleave', "[name='title']", this, this.onEnterKey);
        // comp.find("[name='title']").on("keyup blur mouseleave", this, this.onEnterKey);
        this._configureBlurEvent();

        // option click works only when select size > 1
        comp.on('click', 'option', this, this.onItemSelect);
        // comp.on('change', "[name='options']", this, this.onItemSelect);
    }
}