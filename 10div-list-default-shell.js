import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import CatsAndDogsEventsBinder from "./ro/go/adrhc/app/components/event-binders/CatsAndDogsEventsBinder.js";
import {commonOptionsOf} from "./ro/go/adrhc/app/util/Utils.js";
import {withDefaults} from "./ro/go/adrhc/html-puppeteer/core/component/options/ComponentOptionsBuilder.js";

$(() => {
    const commonOptions = commonOptionsOf("MAIN-debugger");
    const mainOptions = withDefaults(commonOptions)
        .addEventsBinders(component => new CatsAndDogsEventsBinder(component))
        .options();
    animate({MAIN: mainOptions});
});
