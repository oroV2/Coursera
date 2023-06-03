/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import { ListItem } from '@rneui/themed';
import { DISHES } from '../shared/dishes';


class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dishes: DISHES
        };
    }

    static navigationOptions = {
        title: 'Menu'
    };
    render() {
        const { dishes } = this.state;
        const { navigate } = this.props.navigation;
        const renderMenuItem = (item, index) => {
            return (
                <ListItem
                    key={index}
                    title={item.title}
                    subtitle={item.description}
                    hideChevron={true}
                    onPress={() => navigate('Dishdetail', { dishId: item.id })}
                    leftAvatar={{ source: require('../assets/images/uthappizza.png') }}
                />
            );
        };
        return (
            <FlatList
                data={dishes}
                renderItem={renderMenuItem}
                keyExtractor={item => item.id.toString()}
            />
        );
    }
}

export default Menu;
