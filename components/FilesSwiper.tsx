import React, { useCallback } from "react";
import { FlatList, Dimensions, View, Image } from "react-native";
import { File } from "../index";

interface FilesSwiperProps {
  activeFileId: string;
  files: File[];
  onChangePhoto: any;
}

const FilesSwiper: React.FC<FilesSwiperProps> = ({
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
  return (
    <FlatList
      refreshing={true}
      style={{ flex: 1 }}
      horizontal={true}
      pagingEnabled={true}
      extraData={activeFileId}
      keyExtractor={(item: File) => `OpenedFile-${item.id}`}
      data={files}
      renderItem={(item: { item: File; index: number }) => (
        <View style={{ backgroundColor: "black", justifyContent: "center" }}>
          <Image
            source={{ uri: item && item.item.url }}
            style={{
              width: Dimensions.get("window").width,
              height: Dimensions.get("window").width,
              justifyContent: "center"
            }}
          ></Image>
        </View>
      )}
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
