import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const rules = readFileSync(resolve(process.cwd(), 'firestore.rules'), 'utf8');

describe('member portal Firestore rules', () => {
  it('defines the complete member lifecycle and approved-member gate', () => {
    for (const status of [
      'onboarding',
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
    expect(rules).toContain("resource.data.status == 'onboarding'");
    expect(rules).toContain("request.resource.data.status == 'pending'");
  });

  it('separates private profiles from redacted directory projections', () => {
    expect(rules).toContain('match /directoryProfiles/{uid}');
    expect(rules).toContain('match /directoryEntries/{uid}');
    expect(rules).toContain('profile.alternateEmail.size() > 0');
    expect(rules).toContain('profile.visibility.churchRoles == true');
  });

  it('separates official church metadata from admin-only notes', () => {
    expect(rules).toContain('match /memberChurchMetadata/{uid}');
    expect(rules).toContain('match /memberAdminNotes/{uid}');
    expect(rules).toContain('allow get: if isSelf(uid) || isPortalAdmin()');
    expect(rules).toContain('allow read: if isPortalAdmin()');
    expect(rules).toContain("hasOnly(['staff', 'leadershipTeam', 'elder'])");
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

  it('protects household and relationship records and supports church-wide content', () => {
    expect(rules).toContain('match /households/{householdId}');
    expect(rules).toContain('match /memberRelationships/{relationshipId}');
    expect(rules).toContain('match /relationshipDirectoryEntries/{relationshipId}');
    expect(rules).toContain("groupId == '' ? isPortalAdmin()");
    expect(rules).toContain("groupData(data.groupId).status == 'active'");
    expect(rules).toContain(
      "request.resource.data.status in ['draft', 'active', 'hidden', 'archived', 'deleted']"
    );
  });
});
