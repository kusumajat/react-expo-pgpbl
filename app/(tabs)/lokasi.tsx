import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref } from 'firebase/database';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Linking, RefreshControl, SectionList, StyleSheet, TouchableOpacity, View } from 'react-native';

import firebaseConfig from '../../firebaseConfig.js';

export default function LokasiScreen() {
    const [sections, setSections] = useState<{ title: string; data: any[] }[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);


    const handlePress = (coordinates: string) => {
        if (!coordinates) return;
        const [latitude, longitude] = coordinates.split(',').map(coord => coord.trim());
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
        Linking.openURL(url);
    };


    useEffect(() => {
        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const db = getDatabase(app);
        const pointsRef = ref(db, 'points/');

        // Listen for data changes
        const unsubscribe = onValue(pointsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Transform the Firebase object into an array
                const pointsArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));


                // Format for SectionList
                const formattedData = [{
                    title: 'Lokasi Tersimpan',
                    data: pointsArray
                }];
                setSections(formattedData);
            } else {
                setSections([]);
            }
            setLoading(false);
        }, (error) => {
            console.error(error);
            setLoading(false);
        });


        // Cleanup listener on component unmount
        return () => unsubscribe();
    }, []);


    const onRefresh = useCallback(() => {
        setRefreshing(true);
        // Since Firebase provides real-time data, we can simulate a refresh
        // for UX purposes. A real data refetch isn't strictly necessary unless
        // you want to force a re-read from the server.
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    }, []);


    if (loading) {
        return (
            <ThemedView style={styles.container}>
                <ActivityIndicator size="large" />
            </ThemedView>
        );
    }


    return (
        <View style={styles.container}>
            {sections.length > 0 ? (
                <SectionList
                    sections={sections}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handlePress(item.coordinates)}>
                            <View style={styles.item}>
                                <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                                <ThemedText style={styles.itemCoordinates}>{item.coordinates}</ThemedText>
                            </View>
                        </TouchableOpacity>
                    )}
                    renderSectionHeader={({ section: { title } }) => (
                        <ThemedText style={styles.header}>{title}</ThemedText>
                    )}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            ) : (
                <ThemedView style={styles.container}>
                    <ThemedText>Tidak ada data lokasi tersimpan.</ThemedText>
                </ThemedView>
            )}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    item: {
        backgroundColor: '#a7dcffff',
        padding: 20,
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
    },
    itemCoordinates: {
        color: 'black',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#000000ff',
        color: '#ffffffff',
        padding: 16,
    },
});
