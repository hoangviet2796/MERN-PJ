import React, { useEffect, useRef, useState } from "react";

import Button from "../Button/Button";
import "./ImageUpload.css";

function ImageUpload(props) {
  const [file, setFile] = useState();
  const [previewUrl, setPreviewUrl] = useState();

  const filePickerRef = useRef();

  useEffect(() => {
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewUrl(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  }, [file]);

  const pickedHandler = (event) => {
    let pickedFile;
    if (event.target.files && event.target.files.length !== 0) {
      pickedFile = event.target.files[0];
      setFile(pickedFile);
    }
    props.onInput(props.id, pickedFile, true);
  };

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };
  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: "none" }}
        type="file"
        accept=".jpg,.png,.jpeg"
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && "center"}`}>
        <div className="image-upload__preview ">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" />
          ) : (
            <p>Select an image.</p>
          )}
        </div>
        <Button type="button" onClick={pickImageHandler}>
          CHOOSE IMAGE
        </Button>
      </div>
    </div>
  );
}

export default ImageUpload;
