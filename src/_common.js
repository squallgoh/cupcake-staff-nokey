import React, { useState } from "react";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@squallgoh/ckeditor5-for-cupcake";
import { Form } from "semantic-ui-react";

export const removeFigureTag = (editorData) => {
  if (editorData) {
    return editorData
      .replace(/<\/figure>/g, "")
      .replace(/(<figure[^>]+>)/g, "")
      .replace(/<img\s/g, '<img style="max-width: 100%;" ');
  } else {
    return editorData;
  }
};
export const renderCKEditor = (label, data, setData, namePrefix) => {
  return (
    <Form.Field
      style={{
        marginTop: "25px",
        borderStyle: "solid",
        borderColor: "#DEDEDE",
        borderWidth: "1px",
        padding: "10px",
      }}
    >
      <label>{label}</label>
      <CKEditor
        editor={ClassicEditor}
        data={data}
        onChange={(event, editor) => {
          setData(editor.getData());
        }}
        config={{
          AmplifyUpload: {
            storage: Storage,
            namePrefix,
          },
        }}
      />
    </Form.Field>
  );
};

export const useCKInput = (initialValue) => {
  const [data, setData] = useState(initialValue);
  const handleChange = (event, editor) => {
    setData(editor.getData());
  };
  return {
    data,
    onChange: handleChange,
    setData,
  };
};
