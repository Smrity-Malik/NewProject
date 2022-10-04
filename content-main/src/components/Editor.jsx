/* eslint-disable */
import React, { useEffect } from 'react';
import { useQuill } from 'react-quilljs';
import BlotFormatter from 'quill-blot-formatter';
import 'quill/dist/quill.snow.css';
import ImageUploader from 'quill-image-uploader';

const Editor = ({ content, onContentChange, locked, onHtmlChange, showToolBar=true }) => {
  const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],

    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent

    // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  ];
  const { quill, quillRef, Quill } = useQuill({
    theme: 'snow',
    readOnly: locked,
    modules: {
      clipboard: {},
      toolbar: showToolBar ? toolbarOptions : false,
    },
  });

  if (Quill && !quill) {
    // const BlotFormatter = require('quill-blot-formatter');
    Quill.register('modules/blotFormatter', BlotFormatter);
    Quill.register("modules/imageUploader", ImageUploader);
  }

  useEffect(() => {
    if (quill) {
      quill.setContents(content);
      quill.on('text-change', (delta, oldContents) => {
        onContentChange(quill.getContents());
        if(onHtmlChange){
          onHtmlChange(quill.root.innerHTML);
        }
      });
    }
  }, [quill, Quill]);

  return (
    <div>
      <div ref={quillRef} />
    </div>
  );
};

export default Editor;
