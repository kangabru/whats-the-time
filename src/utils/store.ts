import { DateTime } from 'luxon';
import create, { GetState, SetState, State } from 'zustand';
import { devtools } from 'zustand/middleware';
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
    timezone: DateTime,
    locations: Location[],
    times: Time[],
}

/** zustand state for filter management  */
const useAppState = zustand<AppState>(() => ({
    timezone: DateTime.now(),
    locations: [
        { timezone: 'America/Los_Angeles', notes: 'LA' },
        { timezone: 'America/New_York', notes: 'NYC' },
        { timezone: 'Europe/London', notes: 'London' },
        { timezone: 'Asia/Singapore', notes: 'Singapore' },
        { timezone: 'Australia/Sydney', notes: 'Sydney' },
    ],
    times: [
        { hour: 9 },
        { hour: 13 },
        { hour: 17 },
        { hour: 22 },
    ]
} as AppState))

export default useAppState