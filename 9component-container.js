import {addDebugger} from "./ro/go/adrhc/html-puppeteer/core/component/options/DebuggerOptionsBuilder.js";
import animate from "./ro/go/adrhc/html-puppeteer/core/Puppeteer.js";
import {generateCats} from "./ro/go/adrhc/app/Generators.js";
import {$btnOf, btnSelectorOf} from "./ro/go/adrhc/html-puppeteer/util/SelectorUtils.js";
import {activate, deactivate, getTotalHeight} from "./ro/go/adrhc/html-puppeteer/util/DomUtils.js";
import StateChangeEventsBinder from "./ro/go/adrhc/app/components/event-binders/StateChangeEventsBinder.js";

class App {
    /**
     * @type {AbstractContainerComponent}
     */
    parent;

    constructor(parent) {
        this.parent = parent;
    }

    run() {
        $(btnSelectorOf("generate-message1")).on("click", () => {
            this.parent.replacePart("message1", new Date().toISOString());
            $('textarea').height(0);
            $('textarea').height(getTotalHeight);
        });
        $(btnSelectorOf("open")).on("click", () => {
            this.parent.replacePart("cats", generateCats(1));
            deactivate($btnOf("open"));
            activate($btnOf("close"));
            $('textarea').height(getTotalHeight);
        });
        $(btnSelectorOf("close")).on("click", () => {
            this.parent.replacePart("cats");
            deactivate($btnOf("close"));
            activate($btnOf("open"));
            $('textarea').height(0);
            $('textarea').height(getTotalHeight);
        });
        $('textarea').height(getTotalHeight);
        $('textarea').on('input', function () {
            this.style.height = "";
            this.style.height = this.scrollHeight + "px";
        });
    }
}

$(() => {
    // the puppeteer
    const component = animate(addDebugger({elemIdOrJQuery: "MAIN-debugger"})
        .addEventsBinders(new StateChangeEventsBinder("MAIN-debugger")).options());

    // the application using the html-puppeteer
    new App(component).run();
});