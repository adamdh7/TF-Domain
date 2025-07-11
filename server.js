// server.js
const express = require("express");
const path = require("path");
const app = express();

app.use(express.static("public"));

// Serve view.js statically or render an HTML file
app.get("/view", (req, res) => {
  res.sendFile(path.join(__dirname, "pages/view.html"));
  // oswa si view.js ap fè logic, ou ka reponn ak JSON
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
