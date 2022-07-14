'use strict';

import fs from 'fs';

const readline = require('readline');

const COMMA_DELIMITER: string = ',';
const FILENAME: string = 'input.csv';
const ATTR_PREFIX: string = 'attr_';
const ATTR_TRUE: string = 'TRUE';
const ATTRS: string = 'attrs';

async function processLineByLine(): Promise<Object[]> {
  const fileStream = fs.createReadStream(FILENAME);

  const rows = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  let rowIndex: number = 0;
  let headers: string[] = [];
  const allDocuments: Object[] = [];
  for await (const rowString of rows) {
    const row: string[] = rowString.split(COMMA_DELIMITER);
    const document: any = {};
    if (rowIndex === 0) {
      headers = row;
    } else {
      for (let i = 0; i < headers.length; i++) {
        const columnHeader = headers[i];
        const field = row[i];
        if (columnHeader.indexOf(ATTR_PREFIX) !== -1 && field === ATTR_TRUE) {
          if(!document[ATTRS]) {
            document[ATTRS] = [];
          }
          document[ATTRS].push(columnHeader.split(ATTR_PREFIX)[1]);
        } else if (columnHeader.indexOf(ATTR_PREFIX) === -1) {
          document[columnHeader] = field;
        }
      }
      allDocuments.push(document);
    }
    rowIndex++;
  }

  return allDocuments;
}

processLineByLine().then(
  allDocuments => {
    console.log(allDocuments);
  },
);
