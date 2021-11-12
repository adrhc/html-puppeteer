import {addDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import {generateCats} from "./ro/go/adrhc/app/Generators.js";
import {$btnOf} from "./ro/go/adrhc/html-puppeteer/util/SelectorUtils.js";
import {activate, deactivate, getTotalHeight} from "./ro/go/adrhc/html-puppeteer/util/DomUtils.js";
import StateChangeEventsBinder from "./ro/go/adrhc/app/components/event-binders/StateChangeEventsBinder.js";
import {eventsBinder} from "./ro/go/adrhc/html-puppeteer/helper/events-handling/EventsBinderBuilder.js";

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
    // the puppeteer
    animate(addDebugger({elemIdOrJQuery: "MAIN-debugger"})
        .addEventsBinders(new StateChangeEventsBinder("MAIN-debugger"), eventsBinderProvider)
        .options());

    // the application using the html-puppeteer
    resizeTextAreaOnInput();
});