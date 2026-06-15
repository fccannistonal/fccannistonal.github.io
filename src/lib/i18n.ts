import { useLocation } from 'react-router-dom';
import { getLocaleFromPath } from './routing';

export function useLocale() {
  const location = useLocation();
  return getLocaleFromPath(location.pathname);
}
