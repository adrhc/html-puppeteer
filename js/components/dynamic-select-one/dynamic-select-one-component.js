class DynamicSelectOneComponent {
    /**
     * @param dynaSelOneView {DynamicSelectOneView}
     */
    constructor(dynaSelOneView) {
        this.dynaSelOneView = dynaSelOneView;
        this.state = new DynamicSelectOneState();
    }

    onEnterKey(ev) {
        if (ev.key !== "Enter") {
            // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
            return false;
        }
        const _this = ev.data;
        _this.state.setTitle($(this).val());
        console.log(_this.state);
    }

    onItemSelect(ev) {
        const _this = ev.data;
        _this.state.setSelectItemId($(this).value());
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
        comp.find("[name='title']").on('keyup', this, this.onEnterKey);
        comp.on('click', 'option', this, this.onItemSelect);
    }
}