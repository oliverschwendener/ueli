export const elementIsVisible = (childElement: HTMLElement, parentElement: HTMLElement): boolean => {
    const { container, element } = {
        container: {
            min: parentElement.scrollTop,
            max: parentElement.scrollTop + parentElement.clientHeight,
        },
        element: {
            offsetTop: childElement.offsetTop - parentElement.offsetTop,
            offsetBottom: childElement.offsetTop - parentElement.offsetTop + childElement.clientHeight,
        },
    };

    return element.offsetTop >= container.min && element.offsetBottom <= container.max;
};
