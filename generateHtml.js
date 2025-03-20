const fs = require("fs");
const { fetchSpreadsheetData } = require("./googleSheet");
const {
  getHtmlWithContentOrError,
  responseDataToDesktopHtml,
  responseDataToMobileHtml,
} = require("./htmlPieces");

function getContentFromSpreadsheetData(responseData) {
  // Handle error message
  if (typeof responseData === "string") {
    return {
      mobile: `<p>${responseData}</p>`,
      desktop: `<p>${responseData}</p>`,
    };
  }

  const desktopContentHtml = responseDataToDesktopHtml(responseData);
  const mobileContentHtml = responseDataToMobileHtml(responseData);

  return {
    mobile: mobileContentHtml,
    desktop: desktopContentHtml,
  };
}

async function generateHtmlFile() {
  const spreadsheetData = await fetchSpreadsheetData();

  const spreadsheetDataShroot = {
    ...spreadsheetData,
    values: [
      spreadsheetData.values[0],
      ...spreadsheetData.values.slice(1).filter((row) => row[1] === "Shroot"),
    ],
  };

  const spreadsheetDataNoot = {
    ...spreadsheetData,
    values: [
      spreadsheetData.values[0],
      ...spreadsheetData.values.slice(1).filter((row) => row[1] === "Noot"),
    ],
  };

  const { mobile, desktop } = getContentFromSpreadsheetData(spreadsheetData);
  const { mobile: mobileShroot, desktop: desktopShroot } =
    getContentFromSpreadsheetData(spreadsheetDataShroot);
  const { mobile: mobileNoot, desktop: desktopNoot } =
    getContentFromSpreadsheetData(spreadsheetDataNoot);

  const html = getHtmlWithContentOrError(mobile, desktop);
  const htmlShroot = getHtmlWithContentOrError(
    mobileShroot,
    desktopShroot,
    "Shroot's Books"
  );
  const htmlNoot = getHtmlWithContentOrError(
    mobileNoot,
    desktopNoot,
    "Noot's Books"
  );

  fs.writeFile("./index.html", html, (err) => {
    if (err) {
      console.error(err);
    } else {
      // File written successfully
    }
  });

  fs.writeFile("./shroot.html", htmlShroot, (err) => {
    if (err) {
      console.error(err);
    } else {
      // File written successfully
    }
  });

  fs.writeFile("./noot.html", htmlNoot, (err) => {
    if (err) {
      console.error(err);
    } else {
      // File written successfully
    }
  });
}

generateHtmlFile();
