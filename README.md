# PROMISE

PROMISE: Project/Program Risk and Organizational Maturity Integrated System Evaluator is an Open Source implementation of the IP2M METRR Environmental and Maturity evaluation model developed by the US Department of Energy in collaboration with Arizona State University.

This tool is derivative of the originally published research findings in the IP2M METRR study but is developed independently from the IP2M METRR tool and does not reuse any code from that tool. Development priorities and features are derived from practical lessons learned from use of the ASU-developed IP2M METRR tool.

## Development Objectives

- A single codebase that can be run as an offline app or scalable web service with hundreds of users, as simply as possible
- Secure, maintainable, type safe code written in one common web language to reduce development and maintenance expenses
- Leverage the existing research and models developer for IP2M METRR, without reimplemeting the wheel
- Full backwards compatibility with IP2M METRR databases and models, allowing for smooth and seamless migration to PROMISE
- Full replacement functionality for IP2M METRR allowing facilitated assessments in a variety of contexts
- A strong reporting platform that can be iterated on to provide extensive in-app functionality as well as export data for processing in other systems

## Software Approach

This project is written in Typescript and runs as a NextJS website with Typescript frontend and backend. In order to support a full range of use cases, it can be used with a locally stored SQLite database or by connecting to a centrally managed MSSQL database. Login and authorization can be disabled for local implementation, handled locally by the application, or leverage single sign on via OpenID connect.

The application can be installed in a server environment with a single docker container, run in a "serverless" context as a NextJS web app directly, or used in a fully offline and local context by downloading an Electron based local version of the app generated with a software called ToDesktop.

### Stack

- NextJS 14 on Node 20
- Tailwind CSS
- ShadCN/UI
- Prisma ORM
- SQLLite
- MSSQL
- ToDesktop

## Contributing

This is an open source project and intended as a collaborative effort. Especially if you or your organization is using this software to facilitate reviews or otherwise benefit, there is an informal expectation that you give back to the greater earned value community by contributing to the codebase and collaborating on this project.

# Brainstorming ideas on code reuse between local and server based installs

- Five project folders, one is the full NextJS server with middleware, one is a template for the NextJS static export build, one is the tauri project, and one is the standalone rust backend.
- On build, a script copies all frontend files from the web version into the NextJS static folder, then a static build is generated for use by Tauri.
- Getters and Setters are then copied from the standalone Rust api server to the Tauri app, which has the Javascript components which call said functions. Prisma definitions are available in Tauri / Rust server, powered by the same model schema

| -- web_frontend <------ NextJS web application including authentication
| ---- app/ <----- Write Frontend components and pages here
| ------- api/ <---- API endpoint applies authentication layer before forwarding requests to Rust backend server
| -- static_frontend <------ Contains configuration for static export for Tauri
| -- rust_backend <------ Rust API that runs in docker, calls functions that use Prisma generated from shared models to talk to SQL.
| -- tauri_app <----- Tauri app built using static rendered components, calls same functions using SQLite prisma to talk to local SQL.
