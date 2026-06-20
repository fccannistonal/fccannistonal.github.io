import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const rules = readFileSync(resolve(process.cwd(), 'firestore.rules'), 'utf8');

describe('member portal Firestore rules', () => {
  it('defines the complete member lifecycle and approved-member gate', () => {
    for (const status of [
      'pending',
      'approved',
      'rejected',
      'deactivated',
      'banned',
      'deletionRequested',
      'deleted',
    ]) {
      expect(rules).toContain(`'${status}'`);
    }
    expect(rules).toContain("access(request.auth.uid).status == 'approved'");
  });

  it('separates private profiles from redacted directory projections', () => {
    expect(rules).toContain('match /directoryProfiles/{uid}');
    expect(rules).toContain('match /directoryEntries/{uid}');
    expect(rules).toContain("profile.visibility.email == true ? profile.email : ''");
  });

  it('enforces global and group-scoped roles', () => {
    expect(rules).toContain("access(request.auth.uid).role == 'admin'");
    expect(rules).toContain("hasGroupRole(groupId, 'editor')");
    expect(rules).toContain("hasGroupRole(groupId, 'calendarManager')");
    expect(rules).toContain("hasGroupRole(groupId, 'owner')");
  });

  it('requires immutable audit references for sensitive writes', () => {
    expect(rules).toContain('validAuditReference');
    expect(rules).toContain('existsAfter');
    expect(rules).toContain('allow update, delete: if false;');
  });

  it('keeps tax documents denied and avatar metadata protected', () => {
    expect(rules).toContain('match /avatarMetadata/{uid}');
    expect(rules).toContain('match /avatarDirectory/{uid}');
    expect(rules).toContain('match /taxDocuments/{document=**}');
    expect(rules).toContain('allow read, write: if false;');
  });
});
