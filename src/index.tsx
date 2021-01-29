import { h, render } from 'preact';
import './index.css';

render(<App />, document.getElementById('root') as HTMLElement)

function App() {
    return <div class="min-h-screen bg-gray-100 col items-center justify-center">
        <h1 class="text-2xl">Welcome</h1>
        <p>You've done it!</p>
    </div>
}