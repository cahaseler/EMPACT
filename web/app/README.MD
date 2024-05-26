# Development Process

All code that is shared between the web and local versions of the application should be written in the (frontend) folder of the app directory in this root folder, called web. API code, authentication code, middleware code, and other web-specific configuration code should be excluded from the (frontend) folder.

If a frontend function needs to perform an action that should be handled differently when running as a local application, it should call a function in the /utils/ folder. This function should have the same filename, name, parameters, and return types in the web and local implementations, but the web version will likely call an API, while the local version will call a Rust function.
