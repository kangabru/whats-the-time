import { JSX } from "preact"

export type CssClass = { class?: string }
export type Children = JSX.ElementChildrenAttribute

export type Location = {
    notes: string,
    timezone: string,
}

export type Timezone = string

export type Time = {
    hour: number,
}
