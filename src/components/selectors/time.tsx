import { DateTime } from 'luxon';
import { h } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import times from '../../data/times';
import { Time } from '../../utils/types';
import Selector, { SelectorProps } from './selector';

const DEFAULT: Time = { hour: 13 }

export type TimeOption = {
    name: string,
    time: Time,
}

type TimeSelectorProps = Omit<SelectorProps<TimeOption>, 'toStr' | 'toKey'>

/** A listbox that shows all time options. */
export default function TimeSelector(props: TimeSelectorProps) {
    return <Selector<TimeOption> {...props} toStr={r => r.name} toKey={r => r.name} />
}

type TimeOptionArgs = Pick<SelectorProps<TimeOption>, 'options' | 'value' | 'onChange'>

/**
 * Prepares some {@link TimeSelector} arguments.
 * @param defaultTime - The initial time value to set the listbox value as.
 */
export function useTimeOptionArgs(defaultTime: Time = DEFAULT): TimeOptionArgs {
    const options = useTimeOptions()
    const defaultOption = useFindTimeOption(options, defaultTime)
    const [value, onChange] = useState<TimeOption>(defaultOption)
    return { value, onChange, options }
}

/** Prepares and caches the time options with human readable names. */
export function useTimeOptions() {
    return useMemo(() => times.map(toTimeOption), [])
}

function toTimeOption(time: Time) {
    const datetime = DateTime.now().set({ hour: time.hour, minute: 0 })
    const name = datetime.toLocaleString(DateTime.TIME_SIMPLE)
    return { time, name }
}

export function useTimeNow(): Time {
    const now = DateTime.now()
    const hour = now.hour + (now.minute <= 30 ? 0 : 1)
    return { hour: hour % 24 }
}

/** The listbox matches options by reference so this hook helps to find that value and cache the reference. */
export function useFindTimeOption(options: TimeOption[], time: Time = DEFAULT) {
    return useMemo(() => {
        const option = options.find(o => o.time.hour === time.hour)
        return option ?? toTimeOption(time)
    }, [time])
}