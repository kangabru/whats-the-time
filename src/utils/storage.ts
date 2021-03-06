import { Location, Time } from './types';
import { getLocalTimezone } from './utils';

const KEY_DASHBOARD = 'dashboard'

// Dev note: Changes here should be accompanied by a version change and handled correctly in code
export type StorageState = {
    timezone: string,
    times: Time[],
    locations: Location[],
}

/**
 * Returns the {@link StorageState} object from local storage.
 * If no storage is found then the {@link defaultState} object is saved and returned.
 */
export function getStorage(): StorageState {
    const version = localStorage.getItem(KEY_DASHBOARD)
    return version
        ? JSON.parse(localStorage.getItem(KEY_DASHBOARD) as string) as StorageState
        : setStorage(defaultState)
}

/** Save a {@link StorageState} object to local storage. */
export function setStorage(state: StorageState): StorageState {
    localStorage.setItem(KEY_DASHBOARD, JSON.stringify(state))
    return getStorage()
}

/** Clears all local storage. Use to reset the app. */
export function clearStorage() {
    localStorage.clear()
}

const defaultState: StorageState = {
    timezone: getLocalTimezone(),
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
