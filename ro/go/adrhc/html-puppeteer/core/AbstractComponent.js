import StateHolder from "./StateHolder";

export default class AbstractComponent {
    /**
     * @type {StateHolder}
     */
    stateHolder;
    /**
     * @type {StateChangesHandlerAdapter}
     */
    stateChangesHandlerAdapter;

    /**
     * @param {StateHolder=} stateHolder
     */
    constructor({stateHolder}) {
        this.stateHolder = stateHolder ?? new StateHolder();
    }

    /**
     * @param {*} values
     * @abstract
     */
    render(values) {
        if (values != null) {
            this.doWithState(sh => {
                sh.replace(values);
            });
        }
    }

    /**
     * Offers the state for manipulation then updates the view.
     *
     * @param {function(state: StateHolder)} stateUpdaterFn
     * @return {StateChange[]}
     * @protected
     */
    doWithState(stateUpdaterFn) {
        stateUpdaterFn(this.stateHolder);
        return this.updateViewOnStateChanges();
    }

    /**
     * @abstract
     */
    close() {}
}