import { h, render } from 'preact';
import TimeConverter from './components/convert';
import TimeDashBoard from './components/dashboard';
import './index.css';
import { setDefaultSystemLocale } from './utils/utils';

setDefaultSystemLocale()

render(<App />, document.getElementById('root') as HTMLElement)

function App() {
    return <div class="h-full min-h-screen flex flex-col items-center sm:flex-row sm:justify-evenly sm:flex-wrap text-2xl">
        <TimeConverter />
        <TimeDashBoard />
    </div>
}
