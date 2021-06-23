import { DateTime, Settings } from "luxon"
import { useEffect, useState } from "preact/hooks"

type ClassProp = string | boolean | undefined | null
export function join(...classes: ClassProp[]): string {
    return classes.filter(x => !!x).join(" ")
}

export function prettyTime(there: DateTime, local?: DateTime): string {
    local = local ?? DateTime.now()
    const dayDiff = there.day - local.day
    const dayText = dayDiff === 1 ? "⁽⁺¹⁾" : dayDiff === -1 ? "⁽⁻¹⁾" : ""
    return `${there.toLocaleString(DateTime.TIME_SIMPLE)} ${dayText}`
}

export function prettyTimezone(timezone: string): string {
    const parts = timezone.replace("_", " ").split('/')
    return parts.length == 1 ? parts[0] : `${parts[1]} (${parts[0]})`
}

/** Force the time/date locale to the system default so that all luxor times/dates are formatted in that locale.
 * @see https://moment.github.io/luxon/docs/manual/intl.html#default-locale
 * @see https://stackoverflow.com/a/42070353/3801481
 */
export function setDefaultSystemLocale() {
    Settings.defaultLocale = window.navigator.languages ? window.navigator.languages[0] : window.navigator.language
}

/** Triggers a react update every few seconds in order. It's used to update times on the dashboard in real time. */
export function useTimeUpdater() {
    const [_, update] = useState(false)
    useEffect(() => {
        const int = setInterval(() => update(s => !s), 15e3) // 15 seconds
        return () => clearInterval(int)
    }, [])
}