//based on :https://github.com/bkeepers/parse-reminder/blob/master/index.js

const chrono = require('chrono-node');


export function parseReminder(expression: string) {


    // Use chrono to extract the `when` from the `what`
    const when = chrono.parse(expression)
    if (when.length < 1) {
        // What kind of reminder doesn't have a date?
        return null
    }

    let what = expression;
    // Remove any time expressions from the `what`
    what = what.replace(when[0].text, '')

    // Clean up whitespace and common connecting words
    what = what.trim()
    what = what.replace(/^(to|that) /, '').replace(/ (on$|in$)/, '')
    if (what.length < 1) {
        // What kind of reminder doesn't have a remind text?
        return null
    }

    return {what, when: when[0].start.date()}

}