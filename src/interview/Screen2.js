import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';

const CartScreen = () => {
    const [cart, setCart] = useState([
        {
            id: 1,
            name: 'iPhone',
            price: 50000,
            qty: 1,
        },
    ]);

    // Add Product
    const addToCart = (product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(
                item => item.id === product.id
            );

            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id
                        ? {
                            ...item,
                            qty: item.qty + 1,
                        }
                        : item
                );
            }

            return [
                ...prevCart,
                {
                    ...product,
                    qty: 1,
                },
            ];
        });
    };

    // Decrease Quantity
    const removeFromCart = (productId) => {
        setCart(prevCart =>
            prevCart
                .map(item =>
                    item.id === productId
                        ? {
                            ...item,
                            qty: item.qty - 1,
                        }
                        : item
                )
                .filter(item => item.qty > 0)
        );
    };

    // Delete Item Completely
    const deleteItem = (productId) => {
        setCart(prevCart =>
            prevCart.filter(
                item => item.id !== productId
            )
        );
    };

    // Total Price
    const totalPrice = cart.reduce(
        (sum, item) =>
            sum + item.price * item.qty,
        0
    );

    const renderItem = ({ item }) => (
        <View
            style={{
                padding: 10,
                marginVertical: 5,
                borderWidth: 1,
            }}
        >
            <Text>{item.name}</Text>

            <Text>
                Price: ₹{item.price}
            </Text>

            <Text>
                Quantity: {item.qty}
            </Text>

            <View
                style={{
                    flexDirection: 'row',
                    marginTop: 10,
                }}
            >
                <TouchableOpacity
                    onPress={() =>
                        removeFromCart(item.id)
                    }
                >
                    <Text
                        style={{
                            fontSize: 20,
                            marginRight: 20,
                        }}
                    >
                        -
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        addToCart(item)
                    }
                >
                    <Text
                        style={{
                            fontSize: 20,
                            marginRight: 20,
                        }}
                    >
                        +
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() =>
                        deleteItem(item.id)
                    }
                >
                    <Text
                        style={{
                            fontSize: 18,
                        }}
                    >
                        Delete
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View
            style={{
                flex: 1,
                padding: 16,
            }}
        >
            <FlatList
                data={cart}
                keyExtractor={item =>
                    item.id.toString()
                }
                renderItem={renderItem}
            />

            <Text
                style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                }}
            >
                Total: ₹{totalPrice}
            </Text>
        </View>
    );
};

export default CartScreen;