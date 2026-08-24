# Encrypted environments

Runtime and CI secret values live in `env/enc/*.env.enc`, encrypted with SOPS
and age. Variable names remain visible for review; values are ciphertext. The
committed dev and prod profiles contain placeholders until the exposed Slack
and Coveralls credentials have been revoked and replaced by a key holder.

- `env/enc/dev.env.enc`: development ciphertext, committed.
- `env/enc/prod.env.enc`: production ciphertext, committed.
- `env/dec/*.env`: disposable plaintext, mode 0600 and gitignored.
- `.env.example`: names only; never add values.

Use `nix develop` for pinned tooling, `just env-edit dev` to add rotated values,
`just env-run dev <command>` to avoid plaintext on disk, and `just env-check`
before every commit. Coveralls should receive `COVERALLS_REPO_TOKEN` through the
CI provider's encrypted secret store; the SOPS profile can remain its rotation
source of truth.

The age recipients in `.sops.yaml` are public keys. Private age identities do
not belong in this repository, CI logs, issues, or pull requests.
