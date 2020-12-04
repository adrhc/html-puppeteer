class DynamicSelectOneView {
    constructor(elemId, tmplId, {placeholder, size = 10}) {
        this.elemId = elemId;
        this.tmplId = tmplId;
        this.placeholder = placeholder;
        this.size = size;
    }

    /**
     * @param data {DynamicSelectOneState}
     */
    updateView(data) {
        const tmplHtml = $(`#${this.tmplId}`).html();
        const html = Mustache.render(tmplHtml, this.viewDataOf(data));
        const comp = $(`#${this.elemId}`);
        comp.html(html.trim());
        this.searchInputFocus(comp);
    }

    searchInputFocus(comp) {
        const searchInput = comp.find("[name='title']");
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
        this.updateView(data);
    }
}