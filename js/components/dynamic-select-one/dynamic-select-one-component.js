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
            .then(state => _this.dynaSelOneView.updateView(state));
    }

    onItemSelect(ev) {
        const _this = ev.data;
        _this.state.setSelectItemId($(this).value())
            .then(state => _this.dynaSelOneView.updateView(state));
    }

    init() {
        this.dynaSelOneView.init(this.state);
        this._configureEvents();
    }

    /**
     * linking "outside" (and/or default) triggers to component's handlers (aka capabilities)
     */
    _configureEvents() {
        const comp = $(`#${this.dynaSelOneView.elemId}`);
        comp.on('keyup', "[name='title']", this, this.onEnterKey);
        comp.on('click', 'option', this, this.onItemSelect);
    }
}