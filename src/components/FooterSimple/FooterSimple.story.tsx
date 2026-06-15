import { MemoryRouter } from 'react-router-dom';
import { FooterSimple } from './FooterSimple';

export default { title: 'Church/Footer' };

export function Usage() {
  return (
    <MemoryRouter>
      <FooterSimple />
    </MemoryRouter>
  );
}
