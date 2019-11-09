import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef
} from "react";
import { Image, Dimensions } from "react-native";

interface FileCellProps {
  columns?: number;
  fileId: string;
  source: {
    uri: string;
  };
}

const FileCell: React.FC<FileCellProps> = (
  { columns, fileId, source },
  ref
) => {
  const [isFileLoaded, fileLoaded] = useState(false);
  const [isReadyToMeasure, readyToMeasure] = useState(false);
  const fileEl = useRef(null);

  useImperativeHandle(ref, () => ({
    measurer: async () => {
      if (!fileEl || !isReadyToMeasure) {
        console.warn(
          "Gallery::measureFile: Trying to measure file without ref or layout"
        );
      }
      return new Promise((resolve: Function, reject: Function) => {
        fileEl.current
          .getNode()
          .measure(
            (
              imgWidth: number,
              imgHeight: number,
              imgPageX: number,
              imgPageY: number
            ) => {
              resolve({
                width: imgWidth,
                height: imgHeight,
                x: imgPageX,
                y: imgPageY
              });
            },
            reject
          );
      });
    },
    fileSizeMeasurer: async () => {
      if (!isFileLoaded) {
        console.warn("measureFileSize: Undefined file size");
      }
      return new Promise((resolve: Function, reject: Function) => {
        Image.getSize(
          source.uri,
          (width: number, height: number) => {
            resolve({ width, height });
          },
          (error: Error) => {
            console.error(
              "Gallery:measureFileSize: Error trying to get image size",
              JSON.stringify(error.message)
            );
            reject(error);
          }
        );
      });
    }
  }));

  return (
    <Image
      ref={fileEl}
      onLayout={() => {
        readyToMeasure(true);
      }}
      onLoad={() => {
        fileLoaded(true);
      }}
      source={source}
      resizeMode="cover"
      style={{
        width: Dimensions.get("window").width / (columns || 2),
        height: Dimensions.get("window").width / (columns || 2),
        backgroundColor: "lightgrey"
      }}
    />
  );
};

export default forwardRef(FileCell);
