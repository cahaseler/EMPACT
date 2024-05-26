# EMPACT

EMPACT: The Environment and Maturity Program Assessment and Control Tool is an Open Source implementation of the IP2M METRR Environmental and Maturity evaluation model developed by the US Department of Energy in collaboration with Arizona State University.

This tool is derivative of the originally published research findings in the IP2M METRR study but is developed independently from ASU's proprietary IP2M METRR tool and does not reuse any code from that tool. Development priorities and features are derived from practical lessons learned from use of ASU's IP2M METRR tool.

## Development Objectives

- A single codebase that can be run as an offline app or scalable web service with hundreds of users, as simply as possible, avoiding the need for installation of software like Docker on end user systems and ideally without any other dependencies for the end user
- Secure, maintainable, type safe code written in type safe modern programming languages that follow best practices. In this case, Typescript and NextJS for the website and UI portions, with operating system interactions and local installation handled in Rust.
- Leverage the existing public research and models developed with public funding for IP2M METRR - don't reinvent the wheel
- Don't infringe on any intellectual property owned by ASU - this is a new project not building on any existing code
- Full backwards compatibility with IP2M METRR databases and models, allowing for smooth and seamless data migration to EMPACT
- Full replacement functionality for IP2M METRR allowing facilitated assessments in a variety of contexts, implementing lessons learned from use of the ASU tool
- A strong reporting platform that can be iterated on to provide extensive in-app functionality as well as export data for processing in other systems

## Software Approach

Creating a tool with a reusable codebase that can be run as a modern web server with appropriate security considerations and also run as a fully offline local application installable with a standard Windows MSI installer is a genuine software challenge that pushes the capabilities of the most modern software frameworks and tools.

After researching available options, and thanks to new advances in tools over the last few years as larger companies begin to publish parallel web and desktop versions of their applications (like Teams, Slack, and others), this is now possible. Unlike those applications, this tool needs to be able to run fully offline rather can connect to an external server, so an additional layer of complexity is needed.

Here is the approach that will be followed:

- When running as a scalable website, the server will run in a Docker container with a Typescript NextJS web app with frontend user interfaces build in TailWindCSS with ShadCN/UI and the backend implemented with NextJS API routes. The API routes will connect to a SQL server using the Prisma ORM. An authentication and authorization layer will be implmented in NextJS Middleware.
- When running as a local application, the server will instead run as a "Tauri" application, which is written in Rust. The application will use the same NextJS frontend UI, this time compiled as a static website with no authentication and authorization layer. Instead of API routes, any database functionality will leverage Tauri's ability to call local Rust functions which will interact with a local SQLite database, also using the Prisma ORM.
- Keeping the user interface code and database model as shared code between the local and web versions of the application will reduce development time and ensure the two systems maintain the same core functionality.

### Why these technologies?

- TypeScript is the strongest language for web-development, with the ability to use the extensive modern JavaScript web development system with an added layer of type safety for ease of development and improved security.
- NextJS offers the ability to create a single web application in one language with both frontend and server functionality, while also having the ability to pre-compile as a static site for use in an offline environment. This allows security on the web while maintaining native-like performance in the local application.
- TailwindCSS and ShadCN/UI. These style and UI frameworks allow for rapid development of a good looking, responsive web application.
- Rust and Tauri. Rust is a modern low level language with strong security elements, and has recently been endorsed by the White House as a language of choice for web development. Tauri allows us to use a Typescript website for the best interface experience while leveraging Rust functions for locally running code that needs higher performance and security. Tauri also gives us the ability to compile the web and local code into a single installable for multiple platforms.

## Contributing

This is an open source project and intended as a collaborative effort. Especially if you or your organization is using this software to facilitate reviews or otherwise benefit, there is an informal expectation that you give back to the greater earned value community by contributing to the codebase and collaborating on this project.

## Code Structure

The codebase is organized as follows, with files relating to the whole project at the parent level and subfolders for specific components:

- /src-tauri: The code used for the Tauri local application, including the Rust functions for interacting with the database and configuration for the Tauri app
- /web: The NextJS application to be run on the server, containing the UI, API routes, and security layers. The UI is written in a way that works for both platforms (platform specific code checks which platform it is running on)
- /web_static: A seperate NextJS website containing configuration for the static export required for the Tauri app. UI code in this folder is copied in from the web folder and should not be edited. In general this folder shouldn't need to be edited.
