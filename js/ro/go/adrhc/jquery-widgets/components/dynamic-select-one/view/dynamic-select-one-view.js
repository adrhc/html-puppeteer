/**
 * todo: adapt to AbstractView usage
 */
class DynamicSelectOneView extends AbstractView {
    /**
     * @param elemIdOrJQuery {string|jQuery<HTMLTableRowElement>}
     * @param [placeholder] {string}
     * @param optionsToShow {number}
     * @param tmplUrl {string}
     */
    constructor(elemIdOrJQuery, {
        placeholder, optionsToShow = 10,
        tmplUrl = "js/ro/go/adrhc/jquery-widgets/components/dynamic-select-one/templates/dyna-sel-one.html"
    }) {
        super();
        this._setupElem(elemIdOrJQuery);
        this._setupOwner();
        this.tmpl = new CachedAjax(tmplUrl);
        this.placeholder = placeholder;
        this.optionsToShow = optionsToShow;
    }

    /**
     * @param data {DynaSelOneState}
     * @param [focusOnSearchInput] {boolean}
     * @return {Promise<jQuery>}
     */
    update(data, focusOnSearchInput) {
        const viewModel = this._viewModelOf(data);
        return this._renderView(viewModel)
            .then(() => {
                this._applyCss(viewModel);
                if (focusOnSearchInput) {
                    this._focusOnSearchInput();
                }
                return viewModel;
            });
    }

    /**
     * @param viewModel {Object}
     * @return {Promise<jQuery>}
     */
    _renderView(viewModel) {
        return this.tmpl.cache
            .then(html => Mustache.render(html, viewModel))
            .then(html => this.$elem.html(html.trim()));
    }

    /**
     * @param viewModel {Object}
     */
    _applyCss(viewModel) {
        if (viewModel.options) {
            this.$optionsElem.removeClass("removed");
        } else {
            this.$optionsElem.addClass("removed");
        }
        if (viewModel.description) {
            this.$selectionInfoElem.removeClass("removed");
            this.$titleElem.addClass("selected-title");
        } else {
            this.$selectionInfoElem.addClass("removed");
            this.$selectionInfoElem.removeClass("selected-title");
        }
        if (viewModel.nothingFound) {
            this.$nothingFound.removeClass("removed");
        } else {
            this.$nothingFound.addClass("removed");
        }
        if (viewModel.tooMany) {
            this.$tooMany.removeClass("removed");
        } else {
            this.$tooMany.addClass("removed");
        }
        if (viewModel.minCharsToSearch) {
            this.$tooLessChars.removeClass("removed");
        } else {
            this.$tooLessChars.addClass("removed");
        }
    }

    /**
     * @param state {DynaSelOneState}
     * @return {{placeholder: string, optionsToShow: number, title: string}}
     * @private
     */
    _viewModelOf(state) {
        const viewModel = {
            owner: this.owner,
            titleInputName: this.titleInputName,
            valueInputName: this.valueInputName,
            descriptionInputName: this.descriptionInputName,
            title: state.title,
            placeholder: this.placeholder,
            // 2: used to have the multiple select which know to handle click event on options
            optionsToShow: Math.min(Math.max(state.optionsLength, 2), this.optionsToShow)
        };
        if (state.selectedItem) {
            // search success: selected/found exactly 1 item
            viewModel.description = state.selectedItem.description;
            viewModel.id = state.selectedItem.id;
        } else if (state.isEnoughTextToSearch(state.title)) {
            viewModel.searchedTitle = state.title;
            if (state.optionsLength > 1) {
                // too many results
                viewModel.tooMany = state.title;
            } else {
                // no search result
                viewModel.nothingFound = state.title;
            }
        } else {
            // search with too less characters
            viewModel.minCharsToSearch = state.minCharsToSearch;
        }
        if (state.optionsLength > 1 || state.optionsLength === 1 && !state.selectedItem) {
            // rendering options
            viewModel.options = state.options.map(o => {
                const option = {id: o.id, description: o.description, selected: ""};
                if (state.selectedItem && o.id === state.selectedItem.id) {
                    option.selected = "selected";
                }
                return option;
            });
        }
        return viewModel;
    }

    _focusOnSearchInput() {
        const searchInput = this.$titleElem;
        const value = searchInput.val();
        searchInput.focus().val("").val(value);
    }

    /**
     * @returns {jQuery<HTMLElement>}
     */
    get $tooLessChars() {
        return this.$elem.find(`[data-name='too-less-chars']`);
    }

    /**
     * @returns {jQuery<HTMLElement>}
     */
    get $nothingFound() {
        return this.$elem.find(`[data-name='nothing-found']`);
    }

    /**
     * @returns {jQuery<HTMLElement>}
     */
    get $tooMany() {
        return this.$elem.find(`[data-name='too-many']`);
    }

    /**
     * @returns {jQuery<HTMLElement>}
     */
    get $selectionInfoElem() {
        return this.$elem.find(`[data-name='selection-info']`);
    }

    /**
     * @returns {jQuery<HTMLSelectElement>}
     */
    get $optionsElem() {
        return this.$elem.find(`[name='options']`);
    }

    /**
     * this is the search box
     *
     * @return {jQuery<HTMLInputElement>}
     */
    get $titleElem() {
        return this.$elem.find(`[name='${this.titleInputName}']`);
    }

    get titleInputName() {
        return this.$elem.data("name");
    }

    get valueInputName() {
        const inputName = this.$elem.data("value");
        return inputName ? inputName : `${this.titleInputName}-value`;
    }

    get descriptionInputName() {
        const inputName = this.$elem.data("description");
        return inputName ? inputName : `${this.titleInputName}-description`;
    }
}