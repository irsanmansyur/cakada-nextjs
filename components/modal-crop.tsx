import React, { useCallback, useState } from "react";
import Cropper, { Area } from "react-easy-crop";
import getCroppedImg from "../app/(dashboard)/toko/add/cropImage";
import Image from "next/image";
import { SolarCloseSquareBroken } from "@/components/icons/SolarCloseSquareBroken";
import { MdiCheckOutline } from "@/components/icons/MdiCheckOutline";

export default function ModalCrop({
  img,
  setImg,
}: {
  img: string;
  setImg: Function;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels as any);
  };

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        img,
        croppedAreaPixels as any,
        rotation
      );
      console.log("donee");
      setCroppedImage(croppedImage as any);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, rotation, img]);

  return (
    <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        {!croppedImage ? (
          <>
            <form
              method="dialog"
              className="w-full flex justify-between items-center"
            >
              <h3 className="font-bold text-lg flex justify-between ">
                Crop Image
              </h3>
              <div className="flex items-center">
                <button className="w-auto bg-transparent">
                  <SolarCloseSquareBroken className="w-8 h-8 text-red-500" />
                </button>
              </div>
            </form>
            <div className="modal-action">
              <div className="w-full flex flex-col">
                <div className="relative h-[200px] sm:h-[400px] w-full block">
                  <Cropper
                    classes={{
                      containerClassName: "containerClassName w-full h-fulll",
                    }}
                    image={img}
                    aspect={5 / 4}
                    // cropShape="rect"
                    crop={crop}
                    onCropChange={setCrop}
                    zoom={zoom}
                    onZoomChange={setZoom}
                    zoomSpeed={1}
                    maxZoom={3}
                    showGrid={true}
                    rotation={rotation}
                    onRotationChange={setRotation}
                    onCropComplete={onCropComplete}
                  />
                </div>
                <div className="pt-5">
                  <input
                    type="range"
                    min={0}
                    step={0.2}
                    max={3}
                    defaultValue={1}
                    className="range range-xs"
                    onChange={(e) => setZoom(Number(e.target.value))}
                  />
                  <input
                    type="range"
                    min={-130}
                    defaultValue={0}
                    step={1}
                    max={130}
                    className="range range-success range-xs"
                    onChange={(e) => setRotation(Number(e.target.value))}
                  />
                  <div className="flex justify-center">
                    <button
                      onClick={showCroppedImage}
                      className="btn btn-outline btn-success"
                    >
                      Crop
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-center flex-col space-y-3">
            <div className="relative h-[400px] w-full block">
              <Image
                src={croppedImage as string}
                className="w-full h-full object-cover"
                alt="Cropped"
                width={400}
                height={400}
              />
            </div>
            <div className="flex gap-2 justify-center">
              <button
                className="btn btn-outline btn-error w-auto btn-sm"
                onClick={() => setCroppedImage(null)}
              >
                Cancel
              </button>
              <button
                className="btn btn-success w-auto btn-sm"
                onClick={() => {
                  setImg(croppedImage as string);
                  const b = document.getElementById(
                    "my_modal_5"
                  ) as HTMLDialogElement;
                  if (b) {
                    setCroppedImage(null);
                    b.close();
                  }
                }}
              >
                <MdiCheckOutline className="w-4 h-4" />
                Save
              </button>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
}
