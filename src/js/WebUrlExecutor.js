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
        url = this.addHttpToUrl(url);

        open(url, error => {
            if (error) throw error;
        });
    }

    addHttpToUrl(url) {
        if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('//'))
            url = `http://${url}`;

        return url;
    }

    getInfoMessage(url) {
        return `<div>
                    <p class="app-name">${this.addHttpToUrl(url)}</p>
                    <p class="app-path">Open default Webbrowser</p>
                </div>`;
    }

    getIcon() {
        return 'fa fa-globe';
    }
}