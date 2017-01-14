import AnimationManager from './AnimationManager';

export default class PageScroller {
    constructor() {
        this.animationSpeed = new AnimationManager().getScrollAnimationSpeed();
    }

    scrollToId(id, direction, max) {
        let idToScroll;

        if (id === max)
            idToScroll = id;
        else if (id === 0)
            idToScroll = id;
        else {
            if (direction === 'next' && id % 5 === 0 && id >= 5)
                idToScroll = id;
            else if ((direction === 'prev') && ((id + 1) % 5 === 0) && (id >= 4))
                idToScroll = id - 4;
            else if (direction === 'next' && id === 0)
                idToScroll = id;
        }

        if (idToScroll !== undefined) {
            let selectorId = `search-result-${idToScroll}`;
            let offset = document.getElementById(selectorId).offsetTop;

            $('.search-results').animate({
                scrollTop: offset
            }, this.animationSpeed);
        }
    }
}