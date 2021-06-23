import { DateTime } from 'luxon';
import create, { GetState, SetState, State } from 'zustand';
import { devtools } from 'zustand/middleware';
import { clearStorage, getStorage, setStorage, StorageState } from './storage';
import { Location, Time } from './types';

/** Creates a zustand store pre-configured to use with redux dev tools. */
export function zustand<T extends State>(creator: (get: GetState<T>, set: (name: string, partial: Partial<T>) => void, setRaw: SetState<T>) => T) {
    return create<T>(devtools((setRaw, get) => {
        // @ts-ignore
        const set = (name: string, partial: Partial<T>) => setRaw(partial, false, name)
        return creator(get, set, setRaw)
    }))
}

type AppState = {
    timezone: DateTime, // Time to compare all other times to in the dashboard

    times: Time[],
    addTime(_: Time): void,
    removeTime(_: Time): void,

    locations: Location[],
    moveLocation(_: Location, up: boolean): void,
    setLocation(_: Location, lastTimezone?: Location): void,
    removeLocation(_: Location): void,

    reset: () => void,
}

const initState = getStorage()

/** zustand for state management  */
const useAppState = zustand<AppState>((get, set) => ({
    timezone: DateTime.now(),

    locations: initState.locations,
    times: initState.times,

    addTime: function (time: Time) {
        const { times } = get()
        times.push(time)
        set('Add time', viaStorage({ times }))
    },
    removeTime: function (time: Time) {
        let { times } = get()
        times = times.filter(t => t.hour !== time.hour)
        set('Del time', viaStorage({ times }))
    },

    setLocation: function (location: Location, lastLocation?: Location) {
        console.log(location, lastLocation);

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

/** Saves the state to local storage then returns the saved state. Using this function ensure the data being saved it always correct. */
function viaStorage(state: Partial<StorageState>): Partial<StorageState> {
    const localState = getStorage()
    const newState = setStorage({ ...localState, ...state })
    // @ts-ignore
    return Object.keys(state).reduce((result, key) => ({ ...result, [key]: newState[key] }), {})
}

export default useAppState