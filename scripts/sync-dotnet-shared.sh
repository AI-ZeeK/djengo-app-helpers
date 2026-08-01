#!/usr/bin/env bash
# Copy generated C# from djengo-proto-helpers into every .NET service.
#
# The .NET services can't install npm packages, and each one's Docker build
# context is only its own directory, so a shared .csproj in a sibling folder
# would be invisible inside the container. Vendoring the generated file into
# each service is the same approach sync-protos-to-services.sh already takes
# for .proto files, and it needs no feed, no credentials and no Dockerfile
# changes.
#
# Source of truth: backend/djengo-proto-helpers/src/permissions.ts
#
# Usage (from anywhere):
#   npm --prefix backend/djengo-proto-helpers run build      # regenerate first
#   bash backend/djengo-proto-helpers/scripts/sync-dotnet-shared.sh
#
# CI drift check — fails if any service is stale, copies nothing:
#   bash backend/djengo-proto-helpers/scripts/sync-dotnet-shared.sh --check
set -euo pipefail

CHECK_ONLY=false
if [[ "${1:-}" == "--check" ]]; then
  CHECK_ONLY=true
fi

PKG_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND="$(cd "$PKG_ROOT/.." && pwd)"
SRC="$PKG_ROOT/dotnet/Djengo.Shared"

if [[ ! -d "$SRC" ]]; then
  echo "ERROR: generated output not found at $SRC" >&2
  echo "       Run: npm --prefix $PKG_ROOT run build" >&2
  exit 1
fi

# Every .NET service. Each gets its own copy under lib/generated/.
SERVICES=(operations financials events comms facility)

stale=0
copied=0

for service in "${SERVICES[@]}"; do
  service_dir="$BACKEND/$service"
  if [[ ! -d "$service_dir" ]]; then
    echo "  SKIP (missing service): $service"
    continue
  fi

  dest="$service_dir/lib/generated"

  for file in "$SRC"/*.cs; do
    name="$(basename "$file")"
    if $CHECK_ONLY; then
      if ! diff -q "$file" "$dest/$name" >/dev/null 2>&1; then
        echo "  STALE: $service/lib/generated/$name"
        stale=$((stale + 1))
      fi
    else
      mkdir -p "$dest"
      cp "$file" "$dest/$name"
      echo "  -> $service/lib/generated/$name"
      copied=$((copied + 1))
    fi
  done
done

if $CHECK_ONLY; then
  if (( stale > 0 )); then
    echo ""
    echo "$stale file(s) out of date. Run:" >&2
    echo "  npm --prefix backend/djengo-proto-helpers run build" >&2
    echo "  bash backend/djengo-proto-helpers/scripts/sync-dotnet-shared.sh" >&2
    exit 1
  fi
  echo "All .NET services are up to date."
else
  echo ""
  echo "Synced $copied file(s). Rebuild the C# services to pick them up."
fi
