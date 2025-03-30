import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Dimensions,
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';
import SearchBar from '../components/SearchBar';
import { Charger } from '../types';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const mapRef = useRef<MapView>(null);
  const rootViewRef = useRef<View>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  useEffect(() => {
    const fetchChargers = async () => {
      try {
        const res = await fetch('https://api.jsonbin.io/v3/b/67e83fc98561e97a50f543ce/latest', {
          headers: {
            'X-Master-Key': '$2a$10$9J2XcmelKJOjWdF7r22/iekmbA3pwwN.XQCjd3kQ8r1j/vQwxonNu',
          },
        });
        const json = await res.json();
        setChargers(json.record.chargers);
      } catch (err) {
        console.error('Failed to fetch chargers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChargers();
  }, []);

  const handleLocate = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        500
      );
    }
  };

  const handleCapture = async () => {
    try {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission needed', 'Please allow media access to save screenshots.');
        return;
      }

      const uri = await captureRef(rootViewRef, {
        format: 'jpg',
        quality: 0.8,
      });

      const asset = await MediaLibrary.createAssetAsync(uri);
      Alert.alert('Upload Success ✅', `Screenshot saved to: ${asset.uri}`, [
        {
          text: 'OK',
          onPress: () => simulateUpload(),
        },
      ]);
    } catch (err) {
      console.error('Error capturing screenshot:', err);
    }
  };

  const simulateUpload = () => {
    setUploading(true);
    setUploadProgress(0);
    setUploadComplete(false);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        clearInterval(interval);
        setUploadProgress(100);
        setUploadComplete(true);
      } else {
        setUploadProgress(progress);
      }
    }, 200);
  };

  if (!location || loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#E91E63" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }} ref={rootViewRef} collapsable={false}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={false}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{ latitude: location.latitude, longitude: location.longitude }}
          anchor={{ x: 0.5, y: 0.5 }}
          flat
        >
          <View style={styles.pinkMarker} />
        </Marker>

        {chargers.map((charger, index) => (
          <Marker
            key={charger.id}
            coordinate={{
              latitude: parseFloat(charger.latitude),
              longitude: parseFloat(charger.longitude),
            }}
            title={charger.name}
            description={charger.address}
          >
            <View style={styles.chargerMarker}>
              <Text style={styles.chargerMarkerText}>{index + 1}</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      <SearchBar onMenuPress={() => {}} menuColor="#000" />

      <TouchableOpacity style={styles.captureButton} onPress={handleCapture}>
        <Text style={styles.captureText}>📸</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.locateButton} onPress={handleLocate}>
        <Text style={styles.locateIcon}>📍</Text>
      </TouchableOpacity>

      <View style={styles.carouselContainer}>
        <FlatList
          data={chargers}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          snapToInterval={300}
          decelerationRate="fast"
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.title}>{item.name}</Text>
                <Text style={styles.distance}>{(Number(item.distance) / 1000).toFixed(2)} Km</Text>
              </View>
              <Text style={styles.subtitle}>{item.address}</Text>
              <Text style={styles.sectionLabel}>SUPPORTED CONNECTORS</Text>
              {item.connector_types.map((type, idx) => {
                const [label, count] = type.split('-');
                const connectorLabel = idx === 0 ? 'level1' : idx === 1 ? 'level2' : 'ac';
                const name = connectorLabel === 'level1' ? 'Level 1 DC' : connectorLabel === 'level2' ? 'Level 2 DC' : 'Normal AC';
                const color = connectorLabel === 'level1' ? '#00FFD1' : connectorLabel === 'level2' ? '#ccc' : '#5ff';
                const icon = require('../assets/icons/charging-station.png');
                const speedText = connectorLabel === 'level1' ? '15kW Fast Charging' : connectorLabel === 'level2' ? '50kW Fast Charging' : '3kW Charging';

                return (
                  <View key={type} style={styles.connectorRow}>
                    <Image source={icon} style={styles.icon} />
                    <View style={styles.connectorInfo}>
                      <Text style={[styles.connectorName, { color }]}>{name}</Text>
                      <Text style={styles.connectorSpeed}>{speedText}</Text>
                    </View>
                    <Text style={styles.connectorCount}>×{count}</Text>
                  </View>
                );
              })}
              <Text style={styles.downArrow}>⌄</Text>
            </View>
          )}
        />
      </View>

      <Modal visible={uploading} transparent animationType="fade">
        <View style={styles.uploadModal}>
          <View style={styles.uploadBox}>
            <Text style={styles.uploadText}>Uploading to Drive...</Text>
            <Text style={styles.uploadText}>{uploadProgress}%</Text>
            {uploadComplete && (
              <TouchableOpacity onPress={() => setUploading(false)}>
                <Text style={styles.okButton}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinkMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'hotpink',
    borderWidth: 3,
    borderColor: 'white',
  },
  chargerMarker: {
    backgroundColor: '#00C49A',
    borderRadius: 20,
    padding: 6,
  },
  chargerMarkerText: {
    color: 'white',
    fontWeight: 'bold',
  },
  captureButton: {
    position: 'absolute',
    bottom: 290,
    right: 20,
    backgroundColor: '#E91E63',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    elevation: 5,
  },
  captureText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  locateButton: {
    position: 'absolute',
    bottom: 290,
    left: 20,
    backgroundColor: '#111',
    padding: 12,
    borderRadius: 50,
    elevation: 5,
  },
  locateIcon: {
    color: 'white',
    fontSize: 18,
  },
  carouselContainer: {
    position: 'absolute',
    bottom: 0,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#111',
    marginHorizontal: 10,
    padding: 16,
    borderRadius: 16,
    width: 280,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#ccc',
    fontSize: 14,
    marginTop: 2,
  },
  distance: {
    color: '#E91E63',
    fontWeight: 'bold',
  },
  sectionLabel: {
    color: '#00C49A',
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 6,
    fontSize: 13,
  },
  connectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
  connectorInfo: {
    flex: 1,
  },
  connectorName: {
    fontSize: 14,
    fontWeight: '500',
  },
  connectorSpeed: {
    fontSize: 12,
    color: '#999',
  },
  connectorCount: {
    color: '#ccc',
    fontSize: 14,
  },
  downArrow: {
    textAlign: 'center',
    marginTop: 8,
    color: '#888',
    fontSize: 16,
  },
  uploadModal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadBox: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    width: 250,
  },
  uploadText: {
    fontSize: 16,
    marginBottom: 12,
    color: '#111',
  },
  okButton: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E91E63',
  },
});