async function fetchSpreadsheetData() {
  const { SPREADSHEET_ID, API_KEY } = process.env;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/Responses!A:F?key=${API_KEY}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      return `Error status: ${response.status}`;
    }
    return await response.json();
  } catch (error) {
    return error.message;
  }
}

module.exports = {
  fetchSpreadsheetData,
};
