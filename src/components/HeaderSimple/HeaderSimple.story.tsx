import { MemoryRouter } from 'react-router-dom';
import { HeaderSimple } from './HeaderSimple';

export default { title: 'Church/Header' };

export function Usage() {
  return (
    <MemoryRouter>
      <HeaderSimple />
    </MemoryRouter>
  );
}
