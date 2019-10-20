import { format } from 'date-fns';

export function parseJwt(token: string) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(
    atob(base64)
      .split('')
      .map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join('')
  );

  return JSON.parse(jsonPayload);
}

function download_csv(csv: any, filename: string) {
  var csvFile;
  var downloadLink;

  // CSV FILE
  csvFile = new Blob([csv], { type: 'text/csv' });

  // Download link
  downloadLink = document.createElement('a');

  // File name
  downloadLink.download = filename;

  // We have to create a link to the file
  downloadLink.href = window.URL.createObjectURL(csvFile);

  // Make sure that the link is not displayed
  downloadLink.style.display = 'none';

  // Add the link to your DOM
  document.body.appendChild(downloadLink);

  // Lanzamos
  downloadLink.click();
}

const formatDate = (date: Date | number) => format(date, 'd MMM yyy');

export function exportCsv(columns: any, data: any) {
  let csv: string[] = [];
  const fields = columns.map((obj: any) => obj.field);
  data.map((obj: any) => {
    csv.push(fields.map((field: string) => obj[field]).join(','));
  });
  download_csv(csv.join('\n'), `${formatDate(Date.now())}.csv`);
}
