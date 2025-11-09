import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { SectionList, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const DATA = [
    {
        title: 'Kelas A',
        data: ['Budi', 'Caca', 'Doni', 'Ega'],
    },
    {
        title: 'Kelas B',
        data: ['Fajar', 'Gita', 'Hasan', 'Indra', 'Joko'],
    },
];

const App = () => (
    <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top']}>
            <SectionList
                sections={DATA}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <FontAwesome name="user" size={24} color="black" style={{marginRight: 10}} />
                        <Text style={styles.title}>{item}</Text>
                    </View>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.header}>{title}</Text>
                )}
            />
        </SafeAreaView>
    </SafeAreaProvider>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        marginHorizontal: 16,
        marginVertical: 16,
    },
    item: {
        backgroundColor: '#A1CEDC',
        padding: 10,
        marginVertical: 8,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    header: {
        fontSize: 32,
        padding: 20,
        color: '#ffffffff',
        borderRadius: 10,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
    },
});

export default App;