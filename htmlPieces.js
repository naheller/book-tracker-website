function getHtmlWithContentOrError(
  mobileContentOrError,
  desktopContentOrError,
  customTitle = "Book Tracker"
) {
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>${customTitle}</title>
        <link rel="stylesheet" href="styles.css" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <h1>${customTitle}</h1>
        <div class="nav-button-group">
          <button onclick="window.location.pathname='/';">All books</button>
          <button onclick="window.location.pathname='/shroot.html';">Shroot</button>
          <button onclick="window.location.pathname='/noot.html';">Noot</button>
        </div>
        <div id="desktop-content">${desktopContentOrError}</div>
        <div id="mobile-content">${mobileContentOrError}</div>
      </body>
    </html>
  `;
}

function responseDataToDesktopHtml(responseData) {
  const [timestamp, goober, title, author, genre, rating] =
    responseData.values[0];

  const rowValues = responseData.values.slice(1);
  const sortedRowValues = rowValues.sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const allRowsHtml = sortedRowValues.map((row) => rowDataToHtml(row)).join("");

  return `
    <table>
      <tr>
        <th>Date</th>
        <th>${title}</th>
        <th>${author}</th>
        <th>${genre}</th>
        <th>${rating}</th>
      </tr>
      ${allRowsHtml}
    </table>
  `;
}

function rowDataToHtml(rowData) {
  const [timestamp, goober, title, author = "", genre = "", rating = ""] =
    rowData;

  const date = new Date(timestamp);
  const formattedDate = date.toLocaleDateString("en-us", {
    month: "long",
    year: "numeric",
  });

  return `
    <tr>
      <td>${date.toLocaleDateString()}</td>
      <td>${title}</td>
      <td>${author}</td>
      <td>${genre}</td>
      <td>${rating ? ratingNumToStars(Number(rating)) : ""}</td>
    </tr>
  `;
}

function getFormattedResponseData(rawResponseData) {
  const headers = rawResponseData.values[0];
  const formattedResponseData = rawResponseData.values.splice(1).map((row) => ({
    ...headers.reduce(
      (acc, curr, index) => ({
        ...acc,
        [curr]: row[index] || "",
      }),
      {}
    ),
  }));
  return formattedResponseData;
}

function ratingNumToStars(ratingNum) {
  const filledStar = "★";
  const emptyStar = "☆";
  const maxRating = 5;

  const stars = Array(ratingNum)
    .fill(filledStar)
    .concat(Array(maxRating - ratingNum).fill(emptyStar))
    .join("");

  return stars;
}

function rowDataToBookCardHtml(rowData) {
  const { Timestamp, Goober, Title, Author, Genre, Rating } = rowData;
  // const formattedDate = new Date(Timestamp).toLocaleString("default", {
  //   month: "long",
  // });
  return `
    <div class="book-card">
      <p class="title">${Title}</p>
      <p class="author">by ${Author || "Unknown"}</p>
      <p class="genre">${Genre}</p>
      <p class="rating">${Rating ? ratingNumToStars(Number(Rating)) : ""}</p>
    </div>
  `;
}

function responseDataToMobileHtml(responseData) {
  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const formattedData = getFormattedResponseData(responseData);
  const formattedDataByYearMonth = formattedData.reduce((acc, curr) => {
    const date = new Date(curr.Timestamp);
    const year = date.getFullYear();
    const monthNum = date.getMonth();

    if (acc[year]?.[monthNum]) {
      acc[year][monthNum].push(curr);
    } else {
      acc[year] = {
        ...acc[year],
        [monthNum]: [curr],
      };
    }
    return acc;
  }, {});

  return `
    <div>
      ${Object.keys(formattedDataByYearMonth)
        .sort((yearA, yearB) => Number(yearB) - Number(yearA))
        .map(
          (year) =>
            `
          <div>
            <h2>${year}</h2>
            <div>
              ${Object.keys(formattedDataByYearMonth[year])
                .sort((monthA, monthB) => Number(monthB) - Number(monthA))
                .map(
                  (monthNum) => `
                    <div>
                      <h4 class="month-header">${MONTHS[monthNum]}</h4>
                      ${formattedDataByYearMonth[year][monthNum]
                        .map((book) => rowDataToBookCardHtml(book))
                        .join("")}
                    </div>
                  `
                )
                .join("")}
            </div>
          </div>
        `
        )
        .join("")}
    </div>
  `;
}

module.exports = {
  getHtmlWithContentOrError,
  responseDataToDesktopHtml,
  responseDataToMobileHtml,
};
