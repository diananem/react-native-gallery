import React, { useRef } from "react";
import { StyleSheet, View, FlatList } from "react-native";

import FileCell from "./components/FileCell";

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

  return (
    <View style={styles.container}>
      <FlatList
        style={{ flex: 1 }}
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
            />
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default Gallery;
