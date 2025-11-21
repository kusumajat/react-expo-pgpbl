import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';


// Your web app's Firebase configuration
import firebaseConfig from '../../firebaseConfig.js';


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


interface Marker {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
}

export default function MapScreen() {
    const [markers, setMarkers] = useState<Marker[]>([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const pointsRef = ref(db, 'points/');

        const unsubscribe = onValue(pointsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const parsedMarkers = Object.keys(data)
                    .map(key => {
                        const point = data[key];
                        // Ensure coordinates is a string and not empty
                        if (typeof point.coordinates !== 'string' || point.coordinates.trim() === '') {
                            return null;
                        }
                        const [latitude, longitude] = point.coordinates.split(',').map(Number);

                        // Validate that parsing was successful
                        if (isNaN(latitude) || isNaN(longitude)) {
                            console.warn(`Invalid coordinates for point ${key}:`, point.coordinates);
                            return null;
                        }


                        return {
                            id: key,
                            name: point.name,
                            latitude,
                            longitude,
                        };
                    })
                    .filter(Boolean) as Marker[]; // Filter out any null entries from invalid data


                setMarkers(parsedMarkers);
            } else {
                setMarkers([]);
            }
            setLoading(false);
        }, (error) => {
            console.error(error);
            setLoading(false);
        });


        return () => unsubscribe();
    }, []);


    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
                <Text>Loading map data...</Text>
            </View>
        );
    }


    // Render the map on native platforms
    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: -7.7956, // Initial center (e.g., Yogyakarta)
                    longitude: 110.3695,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.01,
                }}
                zoomControlEnabled={true}
            >
                {markers.map(marker => (
                    <Marker
                        key={marker.id}
                        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                        title={marker.name}
                        description={`Coords: ${marker.latitude}, ${marker.longitude}`}
                    />
                ))}
            </MapView>
            <TouchableOpacity style={styles.fab} onPress={() => router.push('/forminputlocation')}>
                <FontAwesome name="plus" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    map: {
        // ...StyleSheet.absoluteFillObject,
        width: '100%',
        height: '100%',
    },
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        left: 20,
        bottom: 20,
        backgroundColor: '#0275d8',
        borderRadius: 30,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});