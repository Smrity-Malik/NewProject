import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { Anchor, Pagination } from '@mantine/core';

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const PdfViewer = ({ file }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPagesNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages: numPagesInPdf }) => {
    setNumPages(numPagesInPdf);
  };

  return (
    <div className="w-full my-8">
      {numPages
            && (
            <div className="mt-4 flex flex-row justify-between">
              <div>
                {`Page ${pageNumber} of ${numPages}`}
              </div>
              <Anchor target="_blank" href={file}>
                Open in new tab
              </Anchor>
              <Pagination page={pageNumber} onChange={setPagesNumber} total={numPages} />
            </div>
            )}
      <div className="flex flex-col justify-between">
        <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
      </div>
    </div>
  );
};

export default PdfViewer;
