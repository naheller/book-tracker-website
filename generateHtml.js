const fs = require("fs");
const { fetchSpreadsheetData } = require("./googleSheet");
const {
  getHtmlWithContentOrError,
  responseDataToTableHtmlString,
} = require("./htmlPieces");

function getContentFromSpreadsheetData(responseData) {
  // Handle error message
  if (typeof responseData === "string") {
    return `
      <p>${responseData}</p>
    `;
  }

  const contentHtml = responseDataToTableHtmlString(responseData);
  return contentHtml;
}

async function generateHtmlFile() {
  const spreadsheetData = await fetchSpreadsheetData();
  const contentHtml = getContentFromSpreadsheetData(spreadsheetData);
  const htmlString = getHtmlWithContentOrError(contentHtml);

  fs.writeFile("./index.html", htmlString, (err) => {
    if (err) {
      console.error(err);
    } else {
      // File written successfully
    }
  });
}

generateHtmlFile();
