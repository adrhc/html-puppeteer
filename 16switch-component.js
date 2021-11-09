import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import {debuggingOptionsOf} from "./ro/go/adrhc/app/util/Utils.js";
import {withDefaults} from "./ro/go/adrhc/html-puppeteer/core/component/options/ComponentOptionsBuilder.js";
import {eventsBinder} from "./ro/go/adrhc/html-puppeteer/helper/events-handling/EventsBinderBuilder.js";

$(() => {
    const debuggingOptions = debuggingOptionsOf("MAIN-debugger");
    const mainOptions = withDefaults(debuggingOptions)
        .addEventsBinders(eventsBinder()
            .whenEvents("click")
            .occurOn("[type='radio']")
            .useHandlerProvider(component => (ev) => {
                const status = ev.target.value;
                component.replaceParts({status, [status]: `${status}-${Math.random()}`});
            })
            .and()
            .buildEventsBinderProvider())
        .options()
    animate({MAIN: mainOptions});
});
