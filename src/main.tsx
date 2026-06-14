import ReactDOM from 'react-dom/client';
import App from './App';
import { restoreRedirectPath } from './lib/githubPages';

restoreRedirectPath();

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
