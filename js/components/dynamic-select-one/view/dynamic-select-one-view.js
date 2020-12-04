class DynamicSelectOneView {
    constructor(elemId, tmplId, {placeholder, size = 10}) {
        this.elemId = elemId;
        this.tmplId = tmplId;
        this.placeholder = placeholder;
        this.size = size;
    }

    /**
     * @param data {DynamicSelectOneState}
     * @param focusOnSearchInput
     */
    updateView(data, focusOnSearchInput) {
        this.clearOnBlurHandlers();
        this.renderView(data)
        if (focusOnSearchInput) {
            this.focusOnSearchInput();
        }
    }

    /**
     * @param data {DynamicSelectOneState}
     */
    renderView(data) {
        const html = Mustache.render(this.$tmplHtml, this.viewDataOf(data));
        this.$componentElem.html(html.trim());
    }

    clearOnBlurHandlers() {
        this.$componentElem.off("blur.dyna-sel-one");
        const $searchInputElem = this.$searchInputElem;
        if ($searchInputElem.length) {
            $searchInputElem[0].onblur = null;
        }
    }

    focusOnSearchInput() {
        const searchInput = this.$searchInputElem;
        const value = searchInput.val();
        searchInput.focus().val("").val(value);
    }

    /**
     * @param data {DynamicSelectOneState}
     */
    viewDataOf(data) {
        const viewData = {
            title: data.title, placeholder: this.placeholder,
            size: Math.min(data.options ? data.options.length : 0, this.size)
        };
        if (!data.options) {
            return viewData;
        }
        viewData.options = data.options.map(o => {
            const option = {id: o.id, description: o.description, selected: ""};
            if (data.selectedItem && o.id === data.selectedItem.id) {
                option.selected = "selected";
            }
            return option;
        });
        return viewData;
    }

    init(data) {
        this.updateView(data, true);
    }

    get $tmplHtml() {
        return $(`#${this.tmplId}`).html();
    }

    get $searchInputElem() {
        return $(`#${this.elemId} [name='title']`);
    }

    /**
     * @returns {*|jQuery|HTMLElement}
     */
    get $componentElem() {
        return $(`#${this.elemId}`);
    }
}