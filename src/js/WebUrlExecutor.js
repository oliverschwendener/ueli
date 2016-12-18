import open from 'open';

export default class WebUrlExecutor {
    isValid(url) {
        if (url.endsWith('.exe')) return false;

        let expression = /^[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?$/gi;
        let regex = new RegExp(expression);

        if (url.match(regex))
            return true;

        return false;
    }

    execute(url) {
        if (!url.startsWith('http://') && !url.startsWith('https://'))
            url = `http://${url}`;

        open(url, error => {
            if (error) throw error;
        });
    }

    getInfoMessage(url) {
        return `Open Webbrowser: ${url}`;
    }
}