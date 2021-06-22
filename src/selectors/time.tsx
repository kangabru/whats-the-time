import { DateTime } from 'luxon';
import { h, JSX } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import times from '../data/times';
import { Time } from '../utils/types';
import Selector from './selector';

export type TimeOption = {
    name: string,
    time: Time,
}

export default function useTimeSelector(defaultTime: Time = { hour: 13 }): [JSX.Element, TimeOption] {
    const options = useMemo(() => times.map(toTimeOption), [])
    const [time, setTime] = useState<TimeOption>(toTimeOption(defaultTime))
    return [<Selector value={time} options={options} onChange={setTime} repr={r => r.name} />, time]
}

export function toTimeOption(time: Time) {
    const datetime = DateTime.local(2000, 1, 1, time.hour, 0, 0)
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