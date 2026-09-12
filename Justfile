# Secret-management tasks. Run `just` to list recipes.
set shell := ["bash", "-euo", "pipefail", "-c"]
set dotenv-load := false

default:
    @just --list

# Verify ciphertext integrity and fail if plaintext env files are tracked.
env-check:
    #!/usr/bin/env bash
    set -euo pipefail
    cd "{{ justfile_directory() }}"
    command -v sops >/dev/null
    tracked="$(git ls-files -- '.env' '*.env' '**/*.env')"
    [[ -z $tracked ]] || { printf 'tracked plaintext env files:\n%s\n' "$tracked" >&2; exit 1; }
    for profile in env/enc/dev.env.enc env/enc/prod.env.enc; do
      [[ -f $profile ]] || { echo "missing $profile" >&2; exit 1; }
      sops filestatus --input-type dotenv "$profile" | grep -Eq '"encrypted"[[:space:]]*:[[:space:]]*true'
    done
    ! git grep -IlE 'AGE-SECRET-KEY-|BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY' -- ':!env/enc/**' | grep -q .
    echo 'env-check PASSED'

# Edit a ciphertext profile in place; plaintext stays in the editor buffer.
env-edit name="dev":
    sops --input-type dotenv --output-type dotenv "env/enc/{{ name }}.env.enc"

# Run a command with a decrypted profile without writing plaintext to disk.
env-run name *command:
    sops exec-env --input-type dotenv "env/enc/{{ name }}.env.enc" '{{ command }}'

# Decrypt a profile for a legacy tool; output is mode 0600 and gitignored.
env-decrypt name="dev":
    #!/usr/bin/env bash
    set -euo pipefail
    cd "{{ justfile_directory() }}"
    mkdir -p env/dec
    umask 077
    sops decrypt --input-type dotenv --output-type dotenv \
      --output "env/dec/{{ name }}.env" "env/enc/{{ name }}.env.enc"
    chmod 0600 "env/dec/{{ name }}.env"
