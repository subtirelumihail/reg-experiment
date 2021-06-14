import React, { useState } from "react";
import "./App.css";
import Jimp from "jimp/es";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

function App() {
  const [type, setType] = useState(undefined);
  const [image, setImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const webcamRef = React.useRef(null);

  const capture = React.useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setOriginalImage(imageSrc);

    setLoading(true);
    Jimp.read(imageSrc)
      .then((image) => {
        return image
          .greyscale() // set greyscale
          .contrast(1)
          .getBase64Async(Jimp.AUTO);
      })
      .then((i) => {
        setImage(i);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  }, [webcamRef]);

  const onUpload = (event) => {
    const imageSrc = URL.createObjectURL(event.target.files[0]);
    setOriginalImage(imageSrc);
    setLoading(true);
    Jimp.read(imageSrc)
      .then((image) => {
        return image
          .greyscale() // set greyscale
          .contrast(1)
          .getBase64Async(Jimp.AUTO);
      })
      .then((i) => {
        setImage(i);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  const retakePicture = () => {
    setImage(null);
    setOriginalImage(null);
    setType(undefined);
  };
  return (
    <div className="App">
      <h1>Reg Image Filter</h1>
      {type === "camera" && !loading && (
        <React.Fragment>
          {!image && (
            <Webcam
              audio={false}
              height={720}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              width={1280}
              videoConstraints={videoConstraints}
            />
          )}
          {!image && (
            <div>
              <button onClick={capture}>Capture photo</button>
            </div>
          )}
        </React.Fragment>
      )}
      {type === "upload" && !loading && (
        <React.Fragment>
          {!image && <input type="file" onChange={onUpload} />}
        </React.Fragment>
      )}
      {loading && <div>Loading image...</div>}
      {image && (
        <React.Fragment>
          <img style={{ height: "500px" }} src={originalImage} alt="image" />
          <img style={{ height: "500px" }} src={image} alt="image" />
        </React.Fragment>
      )}
      {image && (
        <div>
          <button onClick={retakePicture}>Take another picture</button>
        </div>
      )}
      {!type && (
        <div>
          <button onClick={() => setType("upload")}>Upload</button>
          <span style={{ margin: "0 10px" }}>or</span>
          <button onClick={() => setType("camera")}>Take camera picture</button>
        </div>
      )}
    </div>
  );
}

export default App;
