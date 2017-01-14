export default class ItemSelector {
    selectNextActiveItem(direction) {
        if (programs.length === 0)
            return;

        selectIndex = this.getNextIndex(direction, selectIndex, maxSelectIndex);
        $('.search-results div').attr('class', '');
        $(`#search-result-${selectIndex}`).attr('class', 'active');

        pageScroller.scrollToId(selectIndex, direction, programs.length - 1);
    }

    getNextIndex(direction, current, max) {
        if (direction === 'first')
            current = 0;

        else if (direction === 'next') {
            if (current < max)
                current++;
            else
                current = 0;
        }

        else if (direction === 'prev') {
            if (current > 0)
                current = current - 1;
            else
                current = max;
        }

        return current;
    }
}