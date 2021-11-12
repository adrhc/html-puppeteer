import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import CatsWithKittensEventsBinder from "./ro/go/adrhc/app/components/event-binders/CatsWithKittensEventsBinder.js";
import {commonOptionsOf} from "./ro/go/adrhc/app/util/Utils.js";
import {withDefaults} from "./ro/go/adrhc/html-puppeteer/core/component/options/ComponentOptionsBuilder.js";

$(() => {
    const debuggingOptions = commonOptionsOf("MAIN-debugger")
    const mainOptions = withDefaults(debuggingOptions)
        .addEventsBinders(component => new CatsWithKittensEventsBinder(component))
        .options();
    animate({MAIN: mainOptions});
});