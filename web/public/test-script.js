console.log("This is test-script.js loaded from the public folder");
document.addEventListener("DOMContentLoaded", function() {
  // Add a message to the page when the script loads
  const scriptMessage = document.createElement("div");
  scriptMessage.style.padding = "10px";
  scriptMessage.style.backgroundColor = "#e6ffe6";
  scriptMessage.style.border = "1px solid green";
  scriptMessage.style.marginTop = "10px";
  scriptMessage.innerHTML = "JavaScript loaded successfully! (from /test-script.js)";
  
  // Look for the test page container
  const container = document.querySelector(".test-page");
  if (container) {
    container.appendChild(scriptMessage);
  } else {
    document.body.appendChild(scriptMessage);
  }
});