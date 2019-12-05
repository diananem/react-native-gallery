import React, { useState, useRef } from "react";
import {
  StyleSheet,
  FlatList,
  Modal,
  Platform,
  Text,
  TouchableHighlight,
  SafeAreaView,
  StatusBar,
  Image
} from "react-native";

import FileCell from "./components/FileCell";
import FilesSwiper from "./components/FilesSwiper";

export type File = {
  id: string;
  url: string;
  thumbnail: string;
};

interface GalleryProps {
  files: File[];
  columns?: number;
}
const Gallery: React.FC<GalleryProps> = ({ files, columns = 2 }) => {
  const fileRefs = useRef<{ [key: string]: any }>({});
  const [activeFileId, setActiveFileId] = useState<undefined | string>(
    undefined
  );
  const [viewerVisible, setViewerVisible] = useState(false);
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>(
    { width: 0, height: 0 }
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" hidden={viewerVisible} />
      <FlatList
        style={{ flex: 1 }}
        bounces={false}
        data={files}
        numColumns={columns}
        horizontal={false}
        keyExtractor={(item: File) => item.id}
        renderItem={(item: { item: File; index: number }) => {
          return (
            <FileCell
              columns={columns}
              key={`file-cell-id-${item.item.id}`}
              ref={ref => {
                fileRefs.current[item.item.id] = ref;
                return true;
              }}
              fileId={item.item.id}
              source={{ uri: item.item.thumbnail }}
              onPressImage={fileId => {
                setActiveFileId(fileId);
                setViewerVisible(true);
                Image.getSize(
                  item.item.url,
                  (width, height) => setImageSize({ width, height }),
                  () => {}
                );
              }}
            />
          );
        }}
      />
      {activeFileId && viewerVisible && (
        <Modal
          visible={viewerVisible}
          transparent={true}
          animationType={Platform.OS === "ios" ? "none" : "fade"}
          onRequestClose={() => {
            setActiveFileId(undefined);
            setViewerVisible(false);
          }}
        >
          <FilesSwiper
            imageSize={imageSize}
            files={files}
            activeFileId={activeFileId}
            onChangePhoto={setActiveFileId}
          />
          <TouchableHighlight
            style={{ position: "absolute", top: 70, right: 10 }}
            onPress={() => {
              setViewerVisible(false);
            }}
          >
            <Text style={{ color: "white", textAlign: "right" }}>Close</Text>
          </TouchableHighlight>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Gallery;
