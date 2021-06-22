import { DateTime } from "luxon"

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
