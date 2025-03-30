import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';

interface Props {
  onMenuPress: () => void;
  menuColor?: string; // added optional color prop
}

export default function SearchBar({ onMenuPress, menuColor = '#fff' }: Props) {
  return (
    <View style={styles.wrapper}>
      {/* Hamburger icon OUTSIDE the search bar */}
      <TouchableOpacity onPress={onMenuPress} style={styles.menuIconWrapper}>
        <Text style={[styles.icon, { color: menuColor }]}>☰</Text>
      </TouchableOpacity>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.indicatorDot} />
        <TextInput
          placeholder="Search nearest charging station"
          placeholderTextColor="#aaa"
          style={styles.input}
        />
        <TouchableOpacity>
          <Text style={styles.sortIcon}>¡!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 100,
  },
  menuIconWrapper: {
    marginRight: 8,
  },
  icon: {
    fontSize: 22,
  },
  searchContainer: {
    flex: 1,
    backgroundColor: '#111',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00C49A',
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
  },
  sortIcon: {
    fontSize: 18,
    marginLeft: 8,
    color: '#fff',
  },
});
