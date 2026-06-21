import { StyleSheet, Text, TextInput, View, FlatList } from 'react-native'
import React, { useState } from 'react'
import { useEffect } from 'react';
import CartScreen from './Screen2';

const API = 'https://jsonplaceholder.typicode.com/posts'

const Screen2 = () => {

    // State
    const [search, setSearch] = useState('');
    const [data, setData] = useState([]);
    const [debouncedSearch, setDebouncedSearch] = useState('');

    // Debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
        }, 500);
        return () => clearTimeout(timer);
    }, [search]);

    // useEffect
    useEffect(() => {
        if (debouncedSearch) {
            fetchData(debouncedSearch);
        }
    }, [debouncedSearch]);

    // API call
    const fetchData = async (query) => {
        console.log('API CALLED:', query);

        try {
            const response = await fetch(
                `${API}${query}`
            );

            const data = await response.json();
            setData(data);
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <View style={styles.container}>
            <TextInput
                placeholder='Search'
                onChangeText={setSearch}
                value={search}
                style={styles.input}
            />
            <FlatList
                data={data}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <Text style={styles.resultText}>{item.title}</Text>
                )}
            />

            <CartScreen />
        </View>
    )
}

export default Screen2

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    },
    input: {
        borderBottomWidth: 2,
        width: '90%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
        marginTop: 20,
    },
    resultText: {
        marginTop: 10,
        fontSize: 18,
        color: 'green',
        fontWeight: 'bold',
    }
})