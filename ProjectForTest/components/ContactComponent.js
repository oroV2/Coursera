/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Card, Button, Icon } from '@rneui/themed';
import * as Animatable from 'react-native-animatable';
import { MailComposer } from 'expo';

class Contact extends Component {

    static navigationOptions = {
        title: 'Contact Us'
    };

    sendMail() {
        MailComposer.composeAsync({
            recipients: ['confusion@food.net'],
            subject: 'Enquiry',
            body: 'To whom it may concern:'
        })
    }

    render() {
        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
                <Card
                    title='Contact Information'>
                    <Text style={{ margin: 10, justifyContent: 'flex-start', alignItems: 'flex-start' }}>121, Clear Water Bay Road</Text>
                    <Text style={{ margin: 10, justifyContent: 'flex-start', alignItems: 'flex-start' }}>Clear Water Bay, Kowloon</Text>
                    <Text style={{ margin: 10, justifyContent: 'flex-start', alignItems: 'flex-start' }}>HONG KONG</Text>
                    <Text style={{ margin: 10, justifyContent: 'flex-start', alignItems: 'flex-start' }}>Tel: +852 1234 5678</Text>
                    <Text style={{ margin: 10, justifyContent: 'flex-start', alignItems: 'flex-start' }}>Fax: +852 8765 4321</Text>
                    <Text style={{ margin: 10, justifyContent: 'flex-start', alignItems: 'flex-start' }}>Email:confusion@food.net</Text>
                </Card>
                <Button
                    title="Send Email"
                    buttonStyle={{ backgroundColor: "#512DA8" }}
                    icon={<Icon name='envelope-o' type='font-awesome' color='white' />}
                    onPress={this.sendMail}
                />
            </Animatable.View>
        );
    }
}

export default Contact;