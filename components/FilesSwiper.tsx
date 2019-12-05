import React, { useCallback } from "react";
import { FlatList, Dimensions, View, Image } from "react-native";
import { File } from "../index";
import { getFileMeasurements } from "../functions/getFileMeasurements";

interface FilesSwiperProps {
  activeFileId: string;
  files: File[];
  onChangePhoto: any;
  imageSize: {
    width: number;
    height: number;
  };
}

const FilesSwiper: React.FC<FilesSwiperProps> = ({
  imageSize,
  files,
  activeFileId,
  onChangePhoto
}) => {
  const onViewableItemsChanged = useCallback(
    (params: { viewableItems: Array<any>; changed: Array<any> }) => {
      const item = params.viewableItems[0];
      if (item.item.id !== activeFileId) {
        onChangePhoto(item.item.id);
      }
    },
    []
  );

  const sizes = {
    containerWidth: Dimensions.get("window").width,
    containerHeight: Dimensions.get("window").height,
    imageWidth: imageSize.width,
    imageHeight: imageSize.height,
    mode: "fit"
  };
  const { width, height } = getFileMeasurements(sizes);

  return (
    <FlatList
      bounces={false}
      refreshing={true}
      style={{ flex: 1 }}
      horizontal={true}
      pagingEnabled={true}
      extraData={activeFileId}
      keyExtractor={(item: File) => `OpenedFile-${item.id}`}
      data={files}
      renderItem={(item: { item: File; index: number }) => {
        return (
          <View style={{ backgroundColor: "black", justifyContent: "center" }}>
            <Image
              source={{ uri: item && item.item.url }}
              style={{
                width: sizes.containerWidth,
                height: sizes.containerHeight,
                resizeMode: "contain"
              }}
            ></Image>
          </View>
        );
      }}
      onViewableItemsChanged={onViewableItemsChanged}
      getItemLayout={(items: any, index: number) => ({
        length: Dimensions.get("window").width,
        index: index,
        offset: index * Dimensions.get("window").width
      })}
      initialScrollIndex={files.findIndex(
        (file: File) => file.id === activeFileId
      )}
    ></FlatList>
  );
};

export default FilesSwiper;
