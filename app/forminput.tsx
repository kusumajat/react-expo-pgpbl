import { Stack, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, TextInput, Pressable, View, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const TextInputExample = () => {
    const router = useRouter();
    const [nama, setNama] = React.useState('');
    const [nim, setNim] = React.useState('');
    const [kelas, setKelas] = React.useState('');

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Stack.Screen options={{ title: 'Form Input' }} />
                <TextInput
                    style={styles.input}
                    onChangeText={setNama}
                    value={nama}
                    placeholder="Nama"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setNim}
                    value={nim}
                    placeholder="NIM"
                    keyboardType="numeric"
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setKelas}
                    value={kelas}
                    placeholder="Kelas"
                />
                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        {
                            backgroundColor: pressed ? '#8eB8C7' : '#A1CEDC',
                        },
                    ]}
                    onPress={() => router.push('/forminput')}
                >
                    <Text style={styles.buttonText}>Submit</Text>
                </Pressable>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderColor: 'white',
        color: 'white',
        borderRadius: 10,
    },
    button: {
        margin: 12,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default TextInputExample;