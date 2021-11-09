/**
 * @typedef {{[key:string]:*}} Bag
 */

/**
 * @typedef {{[key: string]: (string|number|boolean|null|undefined)}} DataAttributes
 * @property {string|null|undefined} initialState
 */

/**
 * @typedef {string|jQuery<HTMLElement>} ElemIdOrJQuery
 */

/**
 * @typedef {function(previousPartName?: OptionalPartName, newPart?: *, newPartName?: OptionalPartName, dontRecordChanges?: boolean)} ReplacePartFn
 */

/**
 * @typedef {function(parts?: {[name: PartName]: *})} ReplacePartsFn
 */

/**
 * @typedef {function(options: AbstractComponentOptions): StateHolder} StateHolderProviderFn
 */

/**
 * @typedef {function(options: AbstractComponent): StateChangesHandler} StateChangesHandlerProviderFn
 */

/**
 * @typedef {function(options: ComponentOptions)} ComponentOptionsConsumer
 */

/**
 * @typedef {function(initialState: *): StateInitializer} StateInitializerProviderFn
 */

/**
 * @typedef {function(component: AbstractComponent): EventsBinder} EventsBinderProviderFn
 */

/**
 * @typedef {function(component: AbstractComponent)} ComponentConfiguratorFn
 */

/**
 * @typedef {ComponentConfigField | DynamicContainerComponentOptions & DebuggerOptions} ComponentOptions
 */

/**
 * @typedef {function(state: StateHolder)} StateUpdaterFn
 */

/**
 * @typedef {SpecificComponentOptions & ComponentOptions} AnimationOptions
 * @property {ElemIdOrJQuery=} componentsHolder is the place inside which to search for components
 * @property {boolean=} alwaysReturnArray
 * @property {ChildrenComponentsOptions=} childrenCreationCommonOptions
 */

/**
 * @param {EventsBinder} eventsBinder
 * @return {EventsBinderProviderFn}
 */
export function eventsBinderProviderFnOf(eventsBinder) {
    return component => {
        if (component) {
            eventsBinder.component = component;
        }
        return eventsBinder;
    }
}