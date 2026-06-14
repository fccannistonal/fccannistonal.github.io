import { render, screen } from '@/test-utils';
import { staffMembers } from '../content/churchContent';
import { StaffPage } from './Staff.page';

describe('StaffPage', () => {
  it('renders staff entries from the content model', () => {
    render(<StaffPage />);

    expect(screen.getByRole('heading', { name: staffMembers[0].name })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: staffMembers.at(-1)!.name })).toBeInTheDocument();
    expect(screen.getByText(staffMembers[0].bio[0])).toBeInTheDocument();
    expect(screen.getByText(staffMembers[0].focusAreas[0])).toBeInTheDocument();
  });
});
