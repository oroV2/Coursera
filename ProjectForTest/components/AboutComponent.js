/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { ScrollView, Text, FlatList } from 'react-native';
import { Card, ListItem } from '@rneui/themed';
import { LEADERS } from '../shared/leaders';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { Loading } from './LoadingComponent';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        leaders: state.leaders
    }
}


class About extends Component {

    constructor(props) {
        super(props);
        this.state = {
            leaders: LEADERS
        };
    }

    static navigationOptions = {
        title: 'About Us'
    };

    render() {
        const { leaders } = this.state;

        const renderLeaders = ({ item, index }) => {
            return (
                <ListItem
                    key={index}
                    title={item.name}
                    subtitle={item.description}
                    hideChevron={true}
                    leftAvatar={{ source: { uri: baseUrl + item.image } }}
                />
            );
        };

        if (this.props.leaders.isLoading) {
            return (
                <ScrollView>
                    <History />
                    <Card
                        title='Corporate Leadership'>
                        <Loading />
                    </Card>
                </ScrollView>
            );
        }
        else if (this.props.leaders.errMess) {
            return (
                <ScrollView>
                    <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
                        <History />
                        <Card
                            title='Corporate Leadership'>
                            <Text>{this.props.leaders.errMess}</Text>
                        </Card>
                    </Animatable.View>
                </ScrollView>
            );
        }
        else {
            return (
                <ScrollView>
                    <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
                        <History />
                        <Card
                            title='Corporate Leadership'>
                            <FlatList
                                data={this.props.leaders.leaders}
                                renderItem={renderLeader}
                                keyExtractor={item => item.id.toString()}
                            />
                        </Card>
                    </Animatable.View>
                </ScrollView>
            );
        }
    }
}

export default connect(mapStateToProps)(About);