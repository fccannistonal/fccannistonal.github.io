import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const rules = readFileSync(resolve(process.cwd(), 'firestore.rules'), 'utf8');

describe('member portal Firestore rules', () => {
  it('keeps tax document storage explicitly denied', () => {
    expect(rules).toContain('match /taxDocuments/{document=**}');
    expect(rules).toContain('allow read, write: if false;');
  });

  it('requires approved member access before directory reads', () => {
    expect(rules).toContain("memberAccess(request.auth.uid).status == 'approved'");
    expect(rules).toContain('resource.data.optIn == true');
    expect(rules).toContain('resource.data.approved == true');
  });

  it('forces member profile edits back through approval and allows admin moderation', () => {
    expect(rules).toContain('request.resource.data.approved == false');
    expect(rules).toContain('validAdminProfileModeration()');
    expect(rules).toContain('validAccessAdminUpdate()');
  });

  it('limits audit writes to self-service and admin approval actions', () => {
    expect(rules).toContain(
      "request.resource.data.action in ['access-requested', 'profile-updated']"
    );
    expect(rules).toContain(
      "request.resource.data.action in ['access-approved', 'access-revoked']"
    );
  });
});
