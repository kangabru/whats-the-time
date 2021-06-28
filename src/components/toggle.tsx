import { Switch } from '@headlessui/react';
import MoonIcon from '@heroicons/react/solid/MoonIcon';
import SunIcon from '@heroicons/react/solid/SunIcon';
import { h } from "preact";
import { useEffect, useState } from 'preact/hooks';
import { join } from '../utils/utils';

// Classes to use for light/dark modes and are set on the document body.
// Note that 'dark' is a Tailwind CSS class used to control the 'dark:' variants.
// https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually
const bodyClassCommon = ["transition"]
const bodyClassNorm = ["bg-gray-100", "text-black"]
const bodyClassDark = ["dark", "bg-gray-900", "text-white"]

/** Renders the dark mode toggle and updates local storage appropriately on toggle. */
export default function DarkModeToggle() {
    const [darkMode, setDarkMode] = useDarkModeStorage()
    useEffect(() => void setDarkModeClasses(darkMode), [darkMode])

    return <div class="row space-x-2">
        <SunIcon class="w-7 h-7" />
        <Toggle active={darkMode} onChange={setDarkMode} />
        <MoonIcon class="w-7 h-7" />
    </div>
}

/**
 * The core toggle element.
 * @see https://headlessui.dev/react/switch
 */
function Toggle({ active, onChange }: { active: boolean, onChange: (isDark: boolean) => void }) {
    return <Switch
        checked={active}
        onChange={onChange}
        className={join(active ? 'bg-white' : 'bg-gray-700',
            'relative inline-flex flex-shrink-0 h-6 w-10 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus-ring')}
    >
        <span class="sr-only">Dark Mode</span>
        <span
            aria-hidden="true"
            class={join(active ? 'translate-x-4 bg-gray-700' : 'translate-x-0 bg-white',
                'pointer-events-none inline-block h-5 w-5 rounded-full shadow-lg transform ring-0 transition ease-in-out duration-200')}
        />
    </Switch>
}

const darkModekey = 'dark-mode'

function isDarkMode() {
    return !!localStorage.getItem(darkModekey)
}

/** Mimics the 'useState' hook and stores the results in local storage. */
function useDarkModeStorage(): [boolean, (isDark: boolean) => void] {
    const [darkMode, setDarkMode] = useState(isDarkMode())
    const setDarkModeWithStorage = (isDark: boolean) => {
        if (isDark) localStorage.setItem(darkModekey, '1')
        else localStorage.removeItem(darkModekey)
        setDarkMode(isDarkMode())
    }
    return [darkMode, setDarkModeWithStorage]
}

/** Set the correct dark mode classes on the body. */
function setDarkModeClasses(isDark: boolean) {
    const body = document.body
    if (isDark) {
        body.classList.remove(...bodyClassNorm)
        body.classList.add(...bodyClassDark)
    } else {
        body.classList.remove(...bodyClassDark)
        body.classList.add(...bodyClassNorm)
    }
}

/**
 * Sets the dark mode classes on the body such that the UI is rendered in the correct mode without transitions.
 * This should be run once before the preact app initialises.
 */
export function initDarkModeClasses() {
    setDarkModeClasses(isDarkMode())
    setTimeout(() => {
        document.body.classList.add(...bodyClassCommon) // add transitions etc. once everything is complete
    }, 100)
}