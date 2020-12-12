import { useRef, useState } from "react";
import image from "./image.svg";
import axios from "axios";

function App() {
  const dropZoneRef = useRef(null);
  const browseFileRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  const uploadFile = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await axios.post("/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!res.data.success) {
        setUploading(false);
        return;
      }
      const url = res.data.url;
      setUploaded(true);
      setImageUrl(
        process.env.NODE_ENV === "production"
          ? url
          : `http://localhost:5000${url}`
      );
      setCopied(false);
      setUploading(false);
      setFile(null);
      browseFileRef.current.value = "";
    } catch (error) {
      setUploading(false);
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setFile(e.target.files[0]);
    uploadFile(e.target.files[0]);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFile(e.dataTransfer.files[0]);
    setIsDragOver(false);
    uploadFile(e.dataTransfer.files[0]);
  };

  const preventDefault = (e, isDragOver = null) => {
    e.preventDefault();
    e.stopPropagation();

    if (isDragOver === null) return;

    setIsDragOver(isDragOver);
  };

  const copyImageUrlToClipboard = async () => {
    await navigator.clipboard.writeText(imageUrl);
    setCopied(true);
  };

  const reset = () => {
    setCopied(false);
    setFile(null);
    setImageUrl(null);
    setIsDragOver(false);
    setUploaded(false);
    setUploading(false);
  };

  return (
    <div className="container">
      <div className="upload-card">
        {!uploading && !uploaded && (
          <>
            <p className="upload-card-title">Upload your image</p>
            <p className="upload-card-subtitle">File should be Jpeg, Png,...</p>
            <div
              ref={dropZoneRef}
              className={isDragOver ? "drop-zone is-drag-over" : "drop-zone"}
              onDrag={preventDefault}
              onDragStart={(e) => preventDefault(e, true)}
              onDragEnter={(e) => preventDefault(e, true)}
              onDragOver={(e) => preventDefault(e, true)}
              onDragEnd={(e) => preventDefault(e, false)}
              onDragLeave={(e) => preventDefault(e, false)}
              onDragExit={(e) => preventDefault(e, false)}
              onDrop={handleDrop}
            >
              <img src={image} className="drop-zone-image" />
              <p className="drop-zone-placeholder">Drop your image here</p>
            </div>
            <div
              style={{
                fontSize: "1rem",
                color: "#bdbddb",
                textAlign: "center",
                marginTop: 20,
                marginBottom: 30,
              }}
            >
              Or
            </div>
            <button
              className="btn-browse"
              onClick={() => browseFileRef.current.click()}
            >
              Choose a file
            </button>
            <input
              ref={browseFileRef}
              style={{ display: "none" }}
              type="file"
              accept="image/*"
              onChange={handleChange}
            />
          </>
        )}
        {uploading && !uploaded && (
          <>
            <p className="upload-card-title" style={{ textAlign: "left" }}>
              Uploading...
            </p>
            <div className="progress-bar">
              <span />
            </div>
          </>
        )}
        {!uploading && uploaded && (
          <>
            <span className="material-icons upload-card-icon">
              check_circle
            </span>
            <p className="upload-card-title">Uploaded Successfully!</p>
            <div className="image-container">
              <img src={imageUrl} />
            </div>
            <div className="image-url-container">
              <p>{imageUrl}</p>
              <button onClick={copyImageUrlToClipboard}>
                {copied ? "Copied!" : "Copy link"}
              </button>
            </div>
            <button className="btn-reset" onClick={reset}>
              Upload again
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
