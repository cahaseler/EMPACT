# EMPACT: Environment and Maturity Program Assessment and Control Tool

[![License: CC BY 4.0](https://licensebuttons.net/l/by/4.0/80x15.png)](https://creativecommons.org/licenses/by/4.0/)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=cahaseler_EMPACT&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=cahaseler_EMPACT)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=cahaseler_EMPACT&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=cahaseler_EMPACT)

EMPACT is an open-source implementation of the IP2M METRR Environmental and Maturity evaluation model, developed under sponsorship by the Department of Energy's Office of Project Management in collaboration with the Earned Value community. This project aims to provide a robust tool for assessing and controlling project management maturity and environmental factors. This project is based on the groundbreaking DOE-funded IP2M METRR research by Arizona State University, but is not affiliated or sponsored by ASU and is not based on ASU's proprietary IP2M METRR software.

## Key Features

- Web-based and installable offline desktop applications from a single codebase (no Docker needed for local install)
- Comprehensive Environment and Maturity Assessments based on the IP2M METRR Model
- Multiple assessments in a collection, allowing for assessment of different groups at a single site
- Multi-dimensional data analysis to generate IP2M METRR model results broken down by groups, or rolled up by organization and over time
- AI-powered summarization and natural language analysis to gather insights from written survey results, across data dimensions
- Mobile support for assessment users, allowing completion of surveys on mobile or tablet devices
- Flexible Single Sign On with support for organizational Identity Providers via OIDC or local account management

## Getting Started

For detailed information on installation, usage, and contribution, please refer to our [Wiki](https://github.com/cahaseler/EMPACT/wiki). *(Note: The Wiki may require updates following the recent monorepo refactor described below).*

- [Project Status](https://github.com/cahaseler/EMPACT/wiki/Project-Status)
- [Quick Start Guide](https://github.com/cahaseler/EMPACT/wiki/Quick-Start-Guide)
- [Installation Instructions](https://github.com/cahaseler/EMPACT/wiki/Installation-Instructions)
- [User Guide](https://github.com/cahaseler/EMPACT/wiki/User-Guide)
- [Developer Documentation](https://github.com/cahaseler/EMPACT/wiki/Developer-Documentation)
- [FAQs](https://github.com/cahaseler/EMPACT/wiki/FAQs)

## Development Setup (Yarn Workspaces)

This project uses Yarn Workspaces to manage the monorepo structure, containing the following main packages:

- `web`: The Next.js frontend application.
- `src-tauri`: The Tauri desktop application wrapper.

**Installation:**

1.  Ensure you have Node.js and Yarn installed.
2.  Clone the repository.
3.  Run the following command from the project root directory to install all dependencies for all workspaces:
    ```bash
    yarn install
    ```

**Common Commands:**

All commands should be run from the project root directory.

-   **Run the web development server:**
    ```bash
    yarn dev-web
    ```
    (This runs `yarn workspace empact_web dev`)
-   **Build the web application:**
    ```bash
    yarn build-web
    ```
    (This runs `yarn workspace empact_web build`)
-   **Run the Tauri app in development mode:** (Uses the web dev server)
    ```bash
    yarn dev-app
    ```
    (This runs `yarn workspace src-tauri tauri dev`)
-   **Build the Tauri application:** (Currently deferred)
    ```bash
    yarn build-app
    ```
-   **Run commands within a specific workspace:**
    Use the `yarn workspace <workspace_name> <command>` syntax. For example, to lint the web workspace (assuming a `lint` script exists in `web/package.json`):
    ```bash
    yarn workspace empact_web lint
    ```

## Project Status

EMPACT is currently beginning active development, and is not yet in a usable state. For the latest updates and roadmap, visit our [Project Status](Project-Status) page.

## Contributing

We welcome contributions from the earned value community and beyond. Please see our [Contributing Guidelines](https://github.com/empact/EMPACT/wiki/Contributing-Guidelines) for more information on how to get involved.

## License

This project is licensed under the [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). For full license details, see the [LICENSE](https://github.com/empact/EMPACT/blob/main/LICENSE) file.

Please note that while the software is open-source, the EMPACT name and logo are trademarked. For details on usage, refer to our [Trademark Policy](https://github.com/empact/EMPACT/wiki/Trademark-Policy).

## Acknowledgments

This project is sponsored by the US Department of Energy's Office of Project Management. While based on research funded by the DOE, EMPACT is developed independently from ASU's proprietary IP2M METRR tool.

![DOE Office of Project Management Logo](https://github.com/user-attachments/assets/8a1cbc2f-f857-45ea-b101-df8eef5274af)

For more information about the project's background and affiliations, please visit our [About page](https://github.com/empact/EMPACT/wiki/About).

## System Architecture

For a detailed overview of EMPACT's system architecture, including how we've designed the application to work both as a web service and a desktop application, please see our [System Architecture](https://github.com/empact/EMPACT/wiki/System-Architecture) page.

## Support

If you encounter any issues or have questions, please check our [FAQ](https://github.com/empact/EMPACT/wiki/FAQ) or [start a discussion](https://github.com/cahaseler/EMPACT/discussions). If you'd like to report a problem or issue with the software, please [open an issue](https://github.com/empact/EMPACT/issues).
