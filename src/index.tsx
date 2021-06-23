import { h, render } from 'preact';
import TimeConverter from './components/convert';
import TimeDashBoard from './components/dashboard';
import './index.css';
import { setDefaultSystemLocale } from './utils/utils';

setDefaultSystemLocale()

render(<App />, document.getElementById('root') as HTMLElement)

function App() {
    return <div class="h-full min-h-screen col items-center justify-center text-2xl">
        <TimeConverter />
        <TimeDashBoard />
    </div>
}
