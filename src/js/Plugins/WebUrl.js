import open from 'open'

export default class WebUrl {
    isValid(url) {
        if (url.endsWith('.exe'))
            return false

        let expression = /^[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?$/gi
        let regex = new RegExp(expression)

        if (url.match(regex))
            return true

        return false
    }

    execute(url) {
        url = addHttpToUrl(url)

        open(url)
    }

    getSearchResult(userInput) {
        return [{
            name: `Open default web browser`,
            execArg: addHttpToUrl(userInput)
        }]
    }
}

function addHttpToUrl(url) {
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('//'))
        url = `http://${url}`

    return url
}