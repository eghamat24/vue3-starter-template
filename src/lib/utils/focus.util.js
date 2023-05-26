function focusOnList(event, list) {
    event.preventDefault();
    list.querySelectorAll('[role=option]')[0].focus();
}

function focusOnItem(item) {
    item.focus();
}

export { focusOnList, focusOnItem };
