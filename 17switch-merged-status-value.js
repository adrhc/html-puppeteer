import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import {commonOptionsOf} from "./ro/go/adrhc/app/util/Utils.js";
import {withDefaults} from "./ro/go/adrhc/html-puppeteer/core/component/options/ComponentOptionsBuilder.js";
import {eventsBinder} from "./ro/go/adrhc/html-puppeteer/helper/events-handling/EventsBinderBuilder.js";

$(() => {
    const commonOptions = commonOptionsOf("MAIN-debugger");
    const switchEventsBinder = eventsBinder()
        .whenEvents("click")
        .occurOn("[type='radio'][name='status']")
        .useHandlerProvider(component => (ev) => {
            /** @type {SwitcherComponent} */ component.switchTo(ev.target.value);
        })
        .and()
        .whenEvents("click")
        .occurOn("button[data-value]")
        .useHandlerProvider(component => (ev) => {
            const value = ev.target.name;
            component.replaceParts({[value]: `${value}-${Math.random()}`});
        })
        .and()
        .buildEventsBinderProvider();
    const mainOptions = withDefaults(commonOptions)
        .addEventsBinders(switchEventsBinder)
        .options()
    animate({MAIN: mainOptions});
});
