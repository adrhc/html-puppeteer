import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import {debuggingOptionsOf} from "./ro/go/adrhc/app/util/Utils.js";
import {withDefaults} from "./ro/go/adrhc/html-puppeteer/core/component/options/ComponentOptionsBuilder.js";
import {eventsBinder} from "./ro/go/adrhc/html-puppeteer/helper/events-handling/EventsBinderBuilder.js";

$(() => {
    const debuggingOptions = debuggingOptionsOf("MAIN-debugger");
    const mainOptions = withDefaults(debuggingOptions)
        .addEventsBinders(eventsBinder()
            .whenEvents("click")
            .occurOn("#aliceblue")
            .useHandlerProvider((component) => {
                component.replacePart("state", "aliceblue");
            })
            .buildEventsBinderProvider())
        .options()
    animate({MAIN: mainOptions});
});
