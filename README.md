# @djengo/app-helpers

Shared enums, constants and helper utilities for the Djengo services and
frontends. Source lives in `backend/djengo-proto-helpers`; the published copy is
the GitHub repo `AI-ZeeK/djengo-app-helpers`.

## Installing

This package is **not on npm**, despite the name. Consumers install it straight
from GitHub, which is why every service has a `helpers` script:

```sh
npm run helpers          # == npm install github:AI-ZeeK/djengo-app-helpers
```

The dependency is unpinned, so a plain `npm install` will not pick up new
commits — you have to run the script above after publishing.

TypeScript consumers: `backend/{gateway,profile,organization,admin,files}-service`,
`frontend/{client,mobile,forms-ui,admin}`.

## Permissions: one catalog, five languages of consumer

`src/permissions.ts` is the single source of truth for organization permission
slugs. Nothing else declares one. It feeds:

| Consumer | How it reads the catalog |
|---|---|
| organization-service seed | `prisma/seed/permission-catalog.ts` re-exports it in Prisma's enum types |
| gateway-service | `src/enum.ts` re-exports `PermissionName` for `@RequirePermissions` |
| profile-service | `entity-permission-map.ts` imports `PermissionName` |
| client / mobile | their `PERMISSIONS` maps are `satisfies`-checked against it |
| the five .NET services | `lib/generated/Permissions.g.cs`, generated from it |

Platform *admin* permissions are a separate `admin_`-prefixed namespace in
`src/admin-permissions.ts`. Don't mix the two.

### Changing a permission

```sh
# 1. edit src/permissions.ts
# 2. regenerate TypeScript + C#, validating the catalog on the way
npm run build

# 3. copy the generated C# into the five .NET services
npm run sync:dotnet

# 4. publish, then reinstall in each TypeScript consumer
git commit -am "..." && git push
npm run helpers          # in each consumer

# 5. apply to the database
npm run seed             # in backend/organization-service
```

Step 5 matters: the guards check slugs against what is actually in the
`Permission` table, so a rename that hasn't been seeded yet fails closed.

### Why the .NET services get a copied file

Each C# service's Docker build context and dev bind mount is only its own
directory (`context: ../operations`, `volumes: ../operations:/src`), so a shared
`.csproj` in a sibling folder is invisible inside the container. Vendoring the
generated file into each service is the same approach
`sync-protos-to-services.sh` already takes for `.proto` files, and it needs no
NuGet feed, no credentials and no Dockerfile changes.

The cost is that the copies can go stale. Guard against that in CI:

```sh
npm --prefix backend/djengo-proto-helpers run check:dotnet
```

It exits non-zero and names the stale services, without writing anything.

### What `npm run build` validates

`scripts/gen-csharp.js` refuses to emit if the catalog is inconsistent, so these
never reach the seed:

- a `PermissionName` member with no `ALL_PERMISSIONS` row (would never be seeded)
- an `ALL_PERMISSIONS` row with no enum member
- a duplicate slug
- a slug over 50 chars (`permission_name` is `VarChar(50)`)
- a slug that isn't `lower_snake_case`
- a group referencing an unknown slug
- a permission in no group at all (no role could ever be granted it)

## Other exports

- `src/enums.ts` — cross-service enums (`ROLES_ENUM`, `ADDRESS_TYPE_ENUM`, …)
- `src/facility-enums.ts`, `src/facility-helpers.ts` — facility layout types
- `src/admin-permissions.ts` — platform admin permission catalog
- `src/helpers.ts` — the `AppHelper` utility class

Note that `src/enums.ts` is still hand-duplicated into
`backend/operations/lib/constants/Constants.cs`. Those enums could move to the
same generator as permissions; they haven't yet.

## Repository

https://github.com/AI-ZeeK/djengo-app-helpers
