export function isConflictCopyArtifactPath(relativePath) {
  return relativePath
    .split(/[\\/]/)
    .some((segment) => /.+ [2-9](?:\.[^/.]+)?$/.test(segment));
}
