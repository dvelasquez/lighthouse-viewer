/* eslint-disable */
const fs = require("fs-extra");
const replace = require("replace-in-file");
const { exec } = require("child_process");
const manifest = require("./replace-manifest");

// With async/await:
async function copyReports() {
  try {
    await fs.copy(
      "node_modules/lighthouse/lighthouse-core/report/html",
      "src/report-source"
    );
    console.log("success!");
  } catch (err) {
    console.error(err);
    throw err;
  }
}
const options = {
  files: "src/report-source/renderer/",
  from: /'use strict';/
};

console.info(
  "Pre-Serve script: Copying necessary files from Lighthouse sources"
);
copyReports()
  .then(() => {
    console.info(
      "Pre-Serve script: Copying necessary files from Lighthouse sources"
    );

    Object.keys(manifest).forEach(key => {
      const currentOptions = {
        ...options,
        files: options.files + key,
        to: manifest[key]
      };
      replace(currentOptions);
    });
    exec("git add src/report-source/*", (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
  })
  .catch(e => {
    console.error("Pre-serve script", e);
    process.exit(1);
  })
  .finally(() => "Pre-Serve script finished");
