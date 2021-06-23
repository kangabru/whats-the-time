import { Location, Time } from './types';

const KEY = 'data'

// Dev note: Changes here should be accompanied by a version change and handled correctly in code
export type StorageState = {
    times: Time[],
    locations: Location[],
}

export function getState(): StorageState {
    const version = localStorage.getItem(KEY)
    return version
        ? JSON.parse(localStorage.getItem(KEY) as string) as StorageState
        : setState(defaultState)
}

export function setState(state: StorageState): StorageState {
    localStorage.setItem(KEY, JSON.stringify(state))
    return getState()
}

const defaultState: StorageState = {
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
}
