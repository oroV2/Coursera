/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button, Alert, PanResponder, Share } from 'react-native';
import { Card, Icon } from '@rneui/themed';
import { DISHES } from '../shared/dishesh';
import { COMMENTS } from '../shared/comments';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';
import * as Animatable from 'react-native-animatable';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: dishId => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) =>
        dispatch(postComment(dishId, rating, author, comment))
});

const shareDish = (title, message, url) => {
    Share.share({
        title: title,
        message: title + ': ' + message + ' ' + url,
        url: url
    }, {
        dialogTitle: 'Share ' + title
    })
}

function RenderComments(props) {

    const comments = props.comments;

    const renderCommentItem = ({ item, index }) => {

        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <Text style={{ fontSize: 12 }}>{item.rating} Stars</Text>
                <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };

    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title='Comments' >
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>
    );
}

function RenderDish(props) {

    const dish = props.dish;

    handleViewRef = ref => this.view = ref;

    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if (dx < -200)
            return true;
        else
            return false;
    }
    const recognizeComment = ({ moveX, moveY, dx, dy }) => {
        if (dx > 200)
            return true;
        else
            return false;
    }

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => { this.view.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled')); },
        onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if (recognizeDrag(gestureState))
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                        { text: 'OK', onPress: () => { props.favorite ? console.log('Already favorite') : props.onPress() } },
                    ],
                    { cancelable: false }
                );
            if (recognizeComment(gestureState))
                props.onComment();
            return true;
        }
    })

    if (dish != null) {
        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
                ref={this.handleViewRef}
                {...panResponder.panHandlers}>
                <Card
                    featuredTitle={dish.name}
                    image={{ uri: baseUrl + dish.image }}>
                    <Text style={{ margin: 10 }}>{dish.description}</Text>
                    <View style={styles.icons}>
                        <Icon
                            raised
                            reverse
                            name={props.favorite ? "heart" : "heart-o"}
                            type="font-awesome"
                            color="#f50"
                            onPress={() =>
                                props.favorite
                                    ? console.log("Already favorite")
                                    : props.onPressFavorite()
                            }
                        />
                        <Icon
                            raised
                            reverse
                            name="pencil"
                            type="font-awesome"
                            color="#512DA8"
                            onPress={props.onPressAddComment}
                        />
                        <Icon
                            raised
                            reverse
                            name='share'
                            type='font-awesome'
                            color='#51D2A8'
                            style={styles.cardItem}
                            onPress={() => shareDish(dish.name, dish.description, baseUrl + dish.image)} />
                    </View>
                </Card>
            </Animatable.View>
        );
    } else {
        return <View />;
    }
}

class DishDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            dishes: DISHES,
            comment: "",
            favorites: [],
            showModal: false,
            author: "",
            rating: null
        };
    }

    static navigationOptions = {
        title: 'Dish Details',
    };

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    toggleModal = () => {
        this.setState({ showModal: !this.state.showModal });
    };

    handleReservation() {
        console.log(JSON.stringify(this.state));
        this.toggleModal();
    }

    ratingCompleted = rating => {
        this.setState({ rating });
    };

    handleAuthorInput = author => {
        this.setState({ author });
    };

    handleCommentInput = comment => {
        this.setState({ comment });
    };

    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date: "",
            showModal: false
        });
    }

    handleComment() {
        const { rating, author, comment } = this.state;
        const dishId = this.props.navigation.getParam("dishId", "");

        this.toggleModal();
        this.props.postComment(dishId, rating, author, comment);
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId', '');
        return (
            <ScrollView>

                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    onPressAddComment={this.toggleModal} />

                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />

                <Modal
                    animationType={"slide"}
                    transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => this.toggleModal()}
                    onRequestClose={() => this.toggleModal()}
                >
                    <View style={styles.modal}>
                        <Rating
                            imageSize={30}
                            startingValue={5}
                            showRating
                            onFinishRating={this.ratingCompleted}
                            style={{ paddingVertical: 10 }}
                        />
                        <Input
                            placeholder="Author"
                            onChangeText={this.handleAuthorInput}
                            leftIcon={{ type: "font-awesome", name: "user-o" }}
                        />
                        <Input
                            placeholder="Comment"
                            onChangeText={this.handleCommentInput}
                            leftIcon={{ type: "font-awesome", name: "comment-o" }}
                        />
                        <View style={{ margin: 10 }}>
                            <Button
                                onPress={() => {
                                    this.handleComment();
                                    this.resetForm();
                                }}
                                color="#512DA8"
                                title="Submit"
                            />
                        </View>
                        <View style={{ margin: 10 }}>
                            <Button
                                onPress={() => {
                                    this.toggleModal();
                                    this.resetForm();
                                }}
                                color="gray"
                                title="Cancel"
                            />
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    icons: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        flexDirection: "row"
    },
    formRow: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
        flexDirection: "row",
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: "center",
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: "bold",
        backgroundColor: "#512DA8",
        textAlign: "center",
        color: "white",
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(DishDetail);