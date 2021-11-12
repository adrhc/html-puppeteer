import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import {generateCats} from "./ro/go/adrhc/app/Generators.js";
import {$btnOf} from "./ro/go/adrhc/html-puppeteer/util/SelectorUtils.js";
import {activate, deactivate, getTotalHeight} from "./ro/go/adrhc/html-puppeteer/util/DomUtils.js";
import {eventsBinder} from "./ro/go/adrhc/html-puppeteer/helper/events-handling/EventsBinderBuilder.js";
import {commonOptionsOf} from "./ro/go/adrhc/app/util/Utils.js";
import {withDefaults} from "./ro/go/adrhc/html-puppeteer/core/component/options/ComponentOptionsBuilder.js";

const eventsBinderProvider = component => eventsBinder()
    .whenEvents("click").occurOnBtn("generate-message1").useHandler(() => {
        component.replacePart("message1", new Date().toISOString());
        $('textarea').height(0);
        $('textarea').height(getTotalHeight);
    })
    .and()
    .whenEvents("click").occurOnBtn("open").useHandler(() => {
        component.replacePart("cats", generateCats(1));
        deactivate($btnOf("open"));
        activate($btnOf("close"));
        $('textarea').height(getTotalHeight);
    })
    .and()
    .whenEvents("click").occurOnBtn("close").useHandler(() => {
        component.replacePart("cats");
        deactivate($btnOf("close"));
        activate($btnOf("open"));
        $('textarea').height(0);
        $('textarea').height(getTotalHeight);
    })
    .and()
    .buildEventsBinder();

function resizeTextAreaOnInput() {
    $('textarea').height(getTotalHeight);
    $('textarea').on('input', function () {
        this.style.height = "";
        this.style.height = this.scrollHeight + "px";
    });
}

$(() => {
    const commonOptions = commonOptionsOf("MAIN-debugger");
    const mainOptions = withDefaults(commonOptions).addEventsBinders(eventsBinderProvider).options();
    animate({MAIN: mainOptions});

    // the application using the html-puppeteer
    resizeTextAreaOnInput();
});
