/**
 * @typedef {SelectableListComponent} C
 * @extends {EventsBinderConfigurer<SelectableListComponent>}
 */
class SimpleListEventsBinder extends EventsBinderConfigurer {
    attachEventHandlers() {
        console.log(`${this.constructor.name}._configureEvents`);
        this.view.$elem.on(this._appendNamespaceTo("click"),
            this._btnSelector("reload"), this.component, (ev) => this.onReload(ev));
    }

    /**
     * @param {Event} ev
     */
    onReload(ev) {
        ev.stopPropagation();
        this.component.reload();
    }
}