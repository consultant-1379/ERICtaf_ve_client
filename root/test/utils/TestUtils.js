define(function () {
    return {
        haveClass: function (element, name) {
            return (element.className.search(new RegExp(name)) > -1);
        }
    }
});