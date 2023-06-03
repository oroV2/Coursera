/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import Menu from './MenuComponent.js';
import Home from './HomeComponent';
import { DISHES } from '../shared/dishesh.js';
import Dishdetail from './DishDetailComponent.js';
import { createStackNavigator, createDrawerNavigator } from '@react-navigation/native';
import Constants from 'expo-constants';
import { Icon } from 'react-native-elements';

const HomeNavigator = createStackNavigator({
    Home: { screen: Home }
}, {
    navigationOptions: ({ navigation }) => ({
        headerStyle: {
            backgroundColor: "#512DA8"
        },
        headerTitleStyle: {
            color: "#fff"
        },
        headerTintColor: "#fff"
    })
});

const MainNavigator = createDrawerNavigator({
    Home:
    {
        screen: HomeNavigator,
        navigationOptions: {
            title: 'Home',
            drawerLabel: 'Home'
        }
    },
    Menu:
    {
        screen: MenuNavigator,
        navigationOptions: {
            title: 'Menu',
            drawerLabel: 'Menu'
        },
    }
}, {
    drawerBackgroundColor: '#D1C4E9'
});

const MenuNavigator = createStackNavigator({
    Menu: { screen: Menu },
    Dishdetail: { screen: Dishdetail },
}, {
    initialRouteName: 'Menu',
    navigationOptions: {
        headerStyle: {
            backgroundColor: '#512DA8',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            color: '#fff',
        },
    },
});

class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dishes: DISHES,
            selectedDish: null,
        };
    }
    onDishSelect(dishId) {
        this.setState({ selectedDish: dishId });
    }

    render() {
        return (
            <View style={{ flex: 1, paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight }}>
                <MainNavigator />
            </View>
        );
    }
}

export default Main;
