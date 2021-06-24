import { Settings } from 'luxon';
import create, { GetState, SetState, State } from 'zustand';
import { devtools } from 'zustand/middleware';
import { clearStorage, getStorage, setStorage, StorageState } from './storage';
import { Location, Time } from './types';
import { getLocalTimezone } from './utils';

/** Creates a zustand store pre-configured to use with redux dev tools. */
export function zustand<T extends State>(creator: (get: GetState<T>, set: (name: string, partial: Partial<T>) => void, setRaw: SetState<T>) => T) {
    return create<T>(devtools((setRaw, get) => {
        // @ts-ignore
        const set = (name: string, partial: Partial<T>) => setRaw(partial, false, name)
        return creator(get, set, setRaw)
    }))
}

type AppState = {
    /**
     * The 'local' time used to compare all other times against in the dashboard.
     * `DateTime.now()` defaults to this value.
     */
    timezone: string,

    /**
     * Updated the 'local' timezone.
     * @param timezone - A timezone string or undefined to reset it.
     */
    setTimezone(timezone?: string): void,

    /** A list of times shown in the dashboard. */
    times: Time[],

    /**
     * Updates a specific dashboard time.
     * @param index - The index of the times list to update.
     * @param time - The time to set the value to.
     */
    updateTime(index: number, time: Time): void,

    /** A list of timezones/locations shown in the dashboard. */
    locations: Location[],

    /**
     * Moves the position of a timezone in the dashboard up or down.
     * @param location - The location to used. The internal timezone code is used to find the row.
     * @param up - `true` to move the row up, `false` to move it down.
     */
    moveLocation(location: Location, up: boolean): void,

    /**
     * Adds or updates a timezone row in the dashboard.
     * @param location - The location info to save.
     * @param lastTimezone - The record to update or omit this to add a new record. The internal timezone code is used to find the row.
     */
    setLocation(location: Location, lastTimezone?: Location): void,

    /**
     * Removes a timezone row from the dashboard.
     * @param location - The location to remove. The internal timezone code is used to find the row.
     */
    removeLocation(location: Location): void,

    /** Reset all data in the app to the default values. */
    reset: () => void,
}

// Get saved data or init default data and prepare luxon
const initState = getStorage()
Settings.defaultZoneName = initState.timezone

/** zustand for state management  */
const useAppState = zustand<AppState>((get, set) => ({
    ...initState, // Init values from local storage

    /** @see https://moment.github.io/luxon/docs/manual/zones.html#changing-the-default-zone */
    setTimezone: function (_timezone: string = 'local') {
        Settings.defaultZoneName = _timezone
        const timezone = getLocalTimezone()
        set('Set timezone', viaStorage({ timezone }))
    },

    updateTime: function (index: number, time: Time) {
        const { times } = get()
        if (index >= 0 && index < times.length) {
            times[index] = time
            set('Add time', viaStorage({ times }))
        }
    },

    setLocation: function (location: Location, lastLocation?: Location) {
        const { locations } = get()
        const key = lastLocation?.timezone ?? location.timezone
        const index = locations.findIndex(l => l.timezone === key)
        if (index === -1) {
            locations.push(location)
            set('Add location', viaStorage({ locations }))
        } else {
            locations[index] = location
            set('Edit location', viaStorage({ locations }))
        }
    },

    removeLocation: function (location: Location) {
        let { locations } = get()
        locations = locations.filter(t => t.timezone !== location.timezone)
        set('Delete location', viaStorage({ locations }))
    },

    moveLocation: function (location: Location, up: boolean) {
        const down = !up
        let { locations } = get()
        const index = locations.findIndex(l => l.notes === location.notes && l.timezone === location.timezone)
        if (index === -1) return

        if (up && index > 0) {
            locations[index] = locations[index - 1]
            locations[index - 1] = location
            set('Move up', viaStorage({ locations }))
        }
        if (down && index < locations.length - 1) {
            locations[index] = locations[index + 1]
            locations[index + 1] = location
            set('Move down', viaStorage({ locations }))
        }
    },

    reset: function () {
        clearStorage()
        set('Reset', getStorage())
    },
} as AppState))

/**
 * Saves the state to local storage then returns the saved state.
 * Using this function ensures that the data being saved it synced with the storage data.
 */
function viaStorage(state: Partial<StorageState>): Partial<StorageState> {
    const localState = getStorage()
    const newState = setStorage({ ...localState, ...state })
    // @ts-ignore
    return Object.keys(state).reduce((result, key) => ({ ...result, [key]: newState[key] }), {})
}

export default useAppState