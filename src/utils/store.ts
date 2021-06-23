import { DateTime } from 'luxon';
import create, { GetState, SetState, State } from 'zustand';
import { devtools } from 'zustand/middleware';
import { getState, setState, StorageState } from './storage';
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
    addLocation(_: Location): void,
    removeLocation(_: Location): void,
}

const initState = getState()

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

    addLocation: function (location: Location) {
        const { locations } = get()
        locations.push(location)
        set('Add location', viaStorage({ locations }))
    },
    removeLocation: function (location: Location) {
        let { locations } = get()
        locations = locations.filter(t => t.timezone !== location.timezone)
        set('Del location', viaStorage({ locations }))
    },
} as AppState))

/** Saves the state to local storage then returns the saved state. Using this function ensure the data being saved it always correct. */
function viaStorage(state: Partial<StorageState>): Partial<StorageState> {
    const localState = getState()
    const newState = setState({ ...localState, ...state })
    // @ts-ignore
    return Object.keys(state).reduce((result, key) => ({ ...result, [key]: newState[key] }), {})
}

export default useAppState