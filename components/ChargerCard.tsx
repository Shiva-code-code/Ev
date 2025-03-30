import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { Charger } from '../types';
import { getConnectorIcon } from '../utils/connectorIcons';

interface Props {
  chargers: Charger[];
}

export default function ChargerCarousel({ chargers }: Props) {
  return (
    <View style={styles.drawer}>
      <FlatList
        data={chargers}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.subtitle}>{item.address}</Text>
                <Text style={styles.distance}>{(Number(item.distance) / 1000).toFixed(2)} Km</Text>
              </View>
              {/* <Image source={require('../assets/icons/arrow.png')} style={styles.arrowIcon} /> */}
            </View>

            <Text style={styles.sectionLabel}>SUPPORTED CONNECTORS</Text>
            {item.connector_types.map((type) => {
              const [label, count] = type.split('-');
              const rawIconData = getConnectorIcon(label);
              const iconData =
                typeof rawIconData === 'object' && rawIconData !== null
                  ? rawIconData
                  : { icon: null, name: 'Level1 DC', color: '#999' };

              const { icon, name, color } = iconData;

              return (
                <View style={styles.connectorRow} key={type}>
                  {icon && <Image source={icon} style={styles.icon} />}
                  <View style={styles.connectorInfo}>
                    <Text style={[styles.connectorName, { color }]}>{name}</Text>
                  </View>
                  <Text style={styles.connectorCount}>×{count}</Text>
                </View>
              );
            })}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor: '#FF4081',
    marginTop: 2,
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
    color: '#FF4081',
    fontWeight: 'bold',
    marginTop: 2,
  },
  sectionLabel: {
    color: '#0f0',
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
  connectorCount: {
    color: '#ccc',
    fontSize: 14,
  },
});
