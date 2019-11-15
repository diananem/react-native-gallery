import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Modal,
  Platform,
  Text,
  TouchableHighlight
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

  console.log(activeFileId);
  return (
    <View style={styles.container}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Gallery;
