import { DateTime, Settings } from "luxon"

type ClassProp = string | boolean | undefined | null
export function join(...classes: ClassProp[]): string {
    return classes.filter(x => !!x).join(" ")
}

export function toTime(there: DateTime, local?: DateTime): string {
    local = local ?? DateTime.now()
    const dayDiff = there.day - local.day
    const dayText = dayDiff === 1 ? "(T)" : dayDiff === -1 ? "(Y)" : ""
    return `${there.toLocaleString(DateTime.TIME_SIMPLE)} ${dayText}`
}

/** Force the time/date locale to the system default so that all luxor times/dates are formatted in that locale.
 * @see https://moment.github.io/luxon/docs/manual/intl.html#default-locale
 * @see https://stackoverflow.com/a/42070353/3801481
 */
export function setDefaultSystemLocale() {
    Settings.defaultLocale = window.navigator.languages ? window.navigator.languages[0] : window.navigator.language
}