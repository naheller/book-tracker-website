function getHtmlWithContentOrError(contentOrError) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>Book Tracker</title>
        <link rel="stylesheet" href="styles.css" />
      </head>
      <body>
        <h1>Book Tracker</h1>
        <div id="content">${contentOrError}</div>
      </body>
    </html>
  `;
}

function responseDataToTableHtmlString(responseData) {
  const rowHeaders = responseData.values[0];
  const rowValues = responseData.values.slice(1);

  const allRowsHtmlString = rowValues
    .map((row) => rowDataToHtmlString(row))
    .join("");

  return `
    <table>
      <tr>
        <th>${rowHeaders[0]}</th>
        <th>${rowHeaders[1]}</th>
        <th>${rowHeaders[2]}</th>
        <th>${rowHeaders[3]}</th>
        <th>${rowHeaders[4]}</th>
        <th>${rowHeaders[5]}</th>
      </tr>
      ${allRowsHtmlString}
    </table>
  `;
}

function rowDataToHtmlString(rowData) {
  const [timestamp, goober, title, author = "", genre = "", rating = ""] =
    rowData;

  return `
    <tr>
      <td>${timestamp}</td>
      <td>${goober}</td>
      <td>${title}</td>
      <td>${author}</td>
      <td>${genre}</td>
      <td>${rating}</td>
    </tr>
  `;
}

module.exports = {
  getHtmlWithContentOrError,
  responseDataToTableHtmlString,
};
