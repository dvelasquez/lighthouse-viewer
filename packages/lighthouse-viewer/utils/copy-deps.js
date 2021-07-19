/* eslint-disable */
const fs = require("fs-extra");
const replace = require("replace-in-file");
const { exec } = require("child_process");
const manifest = require("./modules/esm");

const filteredFiles = (file) => {
  return !file.includes('html-report-assets.js')
}

// With async/await:
async function copyReports() {
  try {
    const file = await fs.copy(
      "node_modules/lighthouse/report",
      "src/imported",
        {
          filter: filteredFiles
        }
    );
    console.log("success!", file);
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/* OLD IMPLEMENTATION
const options = {
  files: "src/renderer/",
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
    exec("git add src/*", (error, stdout, stderr) => {
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
*/

console.info(
    "Pre-Serve script: Copying necessary files from Lighthouse sources"
);
copyReports()
    .then(() => {
        console.info(
            "Pre-Serve script: Copying necessary files from Lighthouse sources"
        );

        Object.keys(manifest).forEach(key => {
            const importOptions = {
                files: "src/imported/renderer/" + key,
                from: manifest[key].import.from,
                to: manifest[key].import.to,
            };
            const exportOptions = {
                files: "src/imported/renderer/" + key,
                from: manifest[key].export.from,
                to: manifest[key].export.to,
            };
            const removeExportsOptions = {
                files: "src/imported/renderer/" + key,
                from: /\bif \(typeof module !== 'undefined' && module.exports\b.*\n?\r*.*\n?\r*.*\n?\r*.*\n?\r*}/g,
                to: '',
            };
            replace.sync(importOptions);
            replace.sync(exportOptions);
            replace.sync(removeExportsOptions);
        });
        exec("git add src/*", (error, stdout, stderr) => {
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
