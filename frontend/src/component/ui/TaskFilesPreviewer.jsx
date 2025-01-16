import React, { useEffect, useRef, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import '../styles/TaskFilesPreviewer.css';
import { Pagination } from 'antd';


const TaskFilesPreviewer = ({ currentDocIndex, setCurrentDocIndex  , documentUrls}) => {

  const viewer = useRef(null);

  useEffect(() => {
    const currentViewer = viewer.current; // Store the reference to viewer in a variable

    // Initialize WebViewer whenever the currentDocIndex changes
    WebViewer(
      {
        path: 'node_modules/@pdftron/webviewer/public', // Adjust this path if necessary
        licenseKey: 'demo:1736516217110:7e8f71c40300000000c3e790993b84a65dcf22c3cdaa7edcec716f78b2',
        initialDoc: documentUrls[currentDocIndex],
      },
      currentViewer, // Use the variable instead of the ref directly
    ).then((instance) => {
      const { documentViewer } = instance.Core;
      // You can now call WebViewer APIs here...
    }).catch((error) => {
      console.error('Error initializing WebViewer:', error);
    });

    // Cleanup function to set the ref to null on unmount
    return () => {
      if (currentViewer) {
        currentViewer.innerHTML = '<span></span>'; // Clean up the viewer contents
      }
    };
  }, [currentDocIndex, documentUrls]); // Re-run when currentDocIndex changes
 if (documentUrls == null)  return;

  return (
    <div className="MyComponent">
       {/* Ant Design Pagination for navigating through documents */}
       <div className="w-[95%] mx-auto flex align-middle justify-center">
        <h4
                            className="font-bold text-blue-700 text-lg"
                            style={{ textShadow: "1px 1px 0 #60A5FA" }}
                          >
                            {`${documentUrls.length} ${documentUrls.length > 1  ? 'Documents' : 'Document'}`}
                          </h4>
                </div>
      <div className="webviewer" ref={viewer} style={{ height: '100%' }}></div>
      <div className="w-[95%] mx-auto flex align-middle justify-center my-4 pb-2">
                  <Pagination
            simple
            current={currentDocIndex +1} // AntD Pagination is 1-based index
            total={documentUrls.length}
            hideOnSinglePage={false}
            defaultPageSize={1}
            onChange={page => setCurrentDocIndex(prev => page-1)}
          />
        </div>
    </div>
  );
};

export default React.memo(TaskFilesPreviewer);
