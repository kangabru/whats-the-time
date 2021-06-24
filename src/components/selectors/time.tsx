import { DateTime } from 'luxon';
import { h, JSX } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import times from '../../data/times';
import { Time } from '../../utils/types';
import Selector from './selector';

const DEFAULT: Time = { hour: 13 }

export type TimeOption = {
    name: string,
    time: Time,
}

export default function useTimeSelector(defaultTime: Time = DEFAULT): [JSX.Element, TimeOption] {
    const options = useMemo(() => times.map(toTimeOption), [])
    const defaultOption = useFindTimeOption(options, defaultTime)
    const [time, setTime] = useState<TimeOption>(defaultOption)
    return [
        <Selector<TimeOption>
            options={options} value={time} onChange={setTime}
            toStr={r => r.name} toKey={r => r.name}
        />,
        time
    ]
}

export function toTimeOption(time: Time) {
    const datetime = DateTime.now().set({ hour: time.hour, minute: 0 })
    const name = datetime.toLocaleString(DateTime.TIME_SIMPLE)
    return { time, name }
}

export function useNow(): Time {
    return useMemo(() => {
        const now = DateTime.now()
        const hour = now.hour + (now.minute <= 30 ? 0 : 1)
        return { hour: hour % 24 }
    }, [])
}

export function useFindTimeOption(options: TimeOption[], time: Time = DEFAULT) {
    return useMemo(() => {
        const option = options.find(o => o.time.hour === time.hour)
        return option ?? toTimeOption(time)
    }, [time])
}