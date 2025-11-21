import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontAwesome5 } from '@expo/vector-icons';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref, remove } from 'firebase/database';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Linking, RefreshControl, SectionList, StyleSheet, TouchableOpacity, View, Platform, Alert } from 'react-native';


import firebaseConfig from '../../firebaseConfig.js';

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

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

    const handleDelete = (id) => {
        if (Platform.OS === 'web') {
            if (confirm("Apakah Anda yakin ingin menghapus lokasi ini?")) {
                const pointRef = ref(db, `points/${id}`);
                remove(pointRef);
            }
        } else {
            Alert.alert(
                "Hapus Lokasi",
                "Apakah Anda yakin ingin menghapus lokasi ini?",
                [
                    {
                        text: "Batal",
                        style: "cancel"
                    },
                    {
                        text: "Hapus",
                        onPress: () => {
                            const pointRef = ref(db, `points/${id}`);
                            remove(pointRef);
                        },
                        style: "destructive"
                    }
                ]
            );
        }
    }


    useEffect(() => {
        const pointsRef = ref(db, 'points/');

        const unsubscribe = onValue(pointsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const pointsArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));

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


        return () => unsubscribe();
    }, []);


    const onRefresh = useCallback(() => {
        setRefreshing(true);
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
                        <View style={styles.itemContainer}>
                            <TouchableOpacity onPress={() => handlePress(item.coordinates)} style={styles.item}>
                                <View>
                                    <ThemedText style={styles.itemName}>{item.name}</ThemedText>
                                    <ThemedText style={styles.itemCoordinates}>{item.coordinates}</ThemedText>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                                <FontAwesome5 name="trash" size={24} color="red" />
                            </TouchableOpacity>

                        </View>
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
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#a7dcffff',
        marginVertical: 8,
        marginHorizontal: 16,
        borderRadius: 8,
    },
    item: {
        flex: 1,
        padding: 20,
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
    deleteButton: {
        padding: 5,
        marginRight: 16,
    }

});
