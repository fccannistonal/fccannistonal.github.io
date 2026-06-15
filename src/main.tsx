import ReactDOM from 'react-dom/client';
import App from './App';
import { restoreRedirectPath } from './lib/githubPages';
import { initializeGoogleAnalytics } from './lib/googleAnalytics';
import { getPageTitle } from './lib/pageMetadata';

restoreRedirectPath();
document.title = getPageTitle(window.location.pathname);
initializeGoogleAnalytics();

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
