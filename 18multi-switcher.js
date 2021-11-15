import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import {commonOptionsOf} from "./ro/go/adrhc/app/util/Utils.js";
import {withDefaults} from "./ro/go/adrhc/html-puppeteer/core/component/options/ComponentOptionsBuilder.js";
import {eventsBinder} from "./ro/go/adrhc/html-puppeteer/helper/events-handling/EventsBinderBuilder.js";

$(() => {
    const commonOptions = commonOptionsOf("MAIN-debugger");
    const switchEventsBinder = eventsBinder()
        .whenEvents("change")
        .occurOn("[type='checkbox']")
        .useHandlerProvider(component => () => {
            const status = $(":checked").toArray().map(el => $(el).val());
            component.replaceParts({status});
        })
        .and()
        .buildEventsBinderProvider();
    const mainOptions = withDefaults(commonOptions)
        .addEventsBinders(switchEventsBinder)
        .options();
    animate({MAIN: mainOptions});
});
