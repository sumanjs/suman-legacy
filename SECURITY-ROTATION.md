# Tracked credential containment — 2026-08-24

The default branch contained Slack user tokens and a Coveralls repository
token. This change removes those literals and makes Slack/Coveralls consume
environment variables instead.

Before merge or deployment:

1. revoke every exposed Slack token and review Slack audit logs for misuse;
2. rotate the Coveralls repository token;
3. add only the rotated values to the SOPS profiles with `just env-edit`;
4. sync `COVERALLS_REPO_TOKEN` into the CI provider's encrypted secret store;
5. validate Slack publishing and coverage reporting with the new credentials.

Deleting the values from the current tree does not remove them from Git
history. Coordinate any history rewrite separately; provider-side revocation
is the security boundary.
