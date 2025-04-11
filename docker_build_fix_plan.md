# Docker Build Fix Plan

## Problem Summary

The Docker build process for the `web` application is consistently failing in the GitHub Actions workflow, specifically during the `COPY package.json yarn.lock ./` step, reporting errors like `"file or directory not found"`. However, local builds using the same Dockerfile succeed when run with `./web` as the build context.

This discrepancy arises from how the Docker build context is handled differently between the local environment and the GitHub Actions runner (`docker buildx`).

-   **Local:** `docker build -f Dockerfile .` (run inside `./web`) uses `./web` as the context. `COPY package.json ...` works because the files are at the root of this context.
-   **GitHub Actions:** The workflow specifies `context: ./web`, intending the same behavior. However, `docker buildx` in the CI environment seems to misinterpret paths relative to this context, leading to "not found" errors for files that *should* be present at the context root. Attempts to use explicit paths relative to the repo root (`COPY web/package.json ...`) also failed, indicating a fundamental context resolution issue in the CI environment when the context is not the repository root.

We also identified and fixed related issues:
-   Using `node:slim` image which lacks OpenSSL needed by Prisma. (Fixed by switching to `node:bookworm`)
-   Not using `output: 'standalone'` in `next.config.mjs` due to previous Prisma issues, requiring a standard multi-stage build approach. (Dockerfile updated accordingly)
-   Missing `autoprefixer` dependency. (Added)
-   Outdated `yarn.lock` file. (Updated)

## Proposed Solution

To ensure consistent build behavior across local and CI environments, the most robust approach is to **use the repository root as the build context** for all Docker builds.

**Required Changes:**

1.  **Update GitHub Actions Workflow (`.github/workflows/on_main.yml`):**
    *   In the `docker/build-push-action` step for the `web` image, change the `context` parameter from `./web` to `.`.
    ```yaml
    - name: Build and Push Docker Image
      uses: docker/build-push-action@v5
      with:
        context: . # Changed from ./web
        file: ./web/Dockerfile # Keep this path relative to repo root
        # ... other options
    ```

2.  **Update `web/Dockerfile`:**
    *   Modify all `COPY` commands that transfer application source files to use paths relative to the **repository root** (the new build context).
    *   **Line 6 (Builder):** `COPY web/package.json web/yarn.lock ./`
    *   **Line 12 (Builder):** `COPY web/. .` (Copies contents of `./web` into `/app`)
    *   **Line 22 (Production):** `COPY web/package.json web/yarn.lock ./`
    *   **Line 29 (Production):** `COPY --from=builder /app/public ./public` (This remains correct as it copies from the builder stage's `/app` directory)
    *   **Line 32 (Production):** `COPY --from=builder /app/prisma ./prisma` (This remains correct)
    *   *(Self-correction: Line 31 `COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma` also remains correct as it copies from the builder stage)*

**Verification:**

*   After applying these changes, test the build locally by running `docker build -f web/Dockerfile .` from the **repository root**.
*   Commit and push the changes. The GitHub Action should then use the root context and the updated Dockerfile, resolving the path issues.

This approach eliminates ambiguity about the build context and ensures paths are interpreted consistently everywhere.