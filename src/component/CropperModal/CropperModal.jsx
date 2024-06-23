import "./CropperModal.scss";
import { useRef, useState } from "react";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button, Modal, ButtonToolbar } from "rsuite";

const ASPECT = 2 / 3;

function mimeToExtension(mime) {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/gif":
      return "gif";
    case "image/svg+xml":
      return "svg";
    // Add more MIME types and their corresponding extensions if needed
    default:
      return "";
  }
}

const CropperModal = ({
  open = false,
  onClose = () => {},
  imageToCrop = null,
  croppedImage = () => {},
}) => {
  const imageRef = useRef();
  const [crop, setCrop] = useState({});

  const cropImageNow = () => {
    const image = imageRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    console.log(image.naturalWidth, image.width, crop.width);
    console.log(image.naturalHeight, image.height, crop.height);

    const pixelRatio = window.devicePixelRatio;
    canvas.width = crop.width * pixelRatio;
    canvas.height = crop.height * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    ctx.imageSmoothingQuality = "high";

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    const base64Image = canvas.toDataURL("image/jpeg");

    function base64ToFile(base64String, defaultFilename = "image") {
      const arr = base64String.split(",");
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);

      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }

      const extension = mimeToExtension(mime);
      const filename = defaultFilename + (extension ? `.${extension}` : "");

      return new File([u8arr], filename, { type: mime });
    }

    const newFile = base64ToFile(base64Image);
    croppedImage(newFile);
    onClose();
  };

  function onImageLoad(e) {
    const { naturalWidth: width, naturalHeight: height } = e.currentTarget;

    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: "%",
          width: 100,
        },
        ASPECT,
        width,
        height
      ),
      width,
      height
    );

    setCrop(crop);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      className={`cropper-modal`}
      size={"full"}
    >
      <div className="cropper-container">
        <div>
          <ReactCrop crop={crop} onChange={(c) => setCrop(c)} aspect={ASPECT}>
            <img src={imageToCrop} alt="" ref={imageRef} onLoad={onImageLoad} />
          </ReactCrop>
        </div>
        <br />
        <ButtonToolbar>
          <Button onClick={onClose}>Hủy</Button>
          <Button appearance="primary" color="green" onClick={cropImageNow}>
            Cắt
          </Button>
        </ButtonToolbar>
      </div>
    </Modal>
  );
};

export default CropperModal;
