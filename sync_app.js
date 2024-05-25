const Confirm = require("prompt-confirm");

console.log(
  "Running this sync script will replace the contents of web_static/app with the contents of web_frontend/app - you should not be making changes in web_static/app anyway."
);
const prompt = new Confirm(
  "Continue, and sync the frontend files to the static folder used for Tauri?"
);

prompt.run().then((confirmed) => {
  if (confirmed) {
    console.log("Syncing...");
    //TODO: actually copy the files in a way appropriate to the development environment OS
  } else {
    console.log("Aborted");
  }
});
