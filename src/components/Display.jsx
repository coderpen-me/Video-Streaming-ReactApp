import React from "react";
import ToggleView from "./ToggleView.jsx"
import SwipeComp from "./SwipeComp.jsx"
import '../Styling/ToggleView.css';
var localData = require('../local.json');

/*

This component is using ToggleView component to display video/Name of creator. Also, using SwipeComp component, We will switch to next or previous video.

*/

class Display extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            counter: 0,
            items: [],
            viewSelector: 0,
        };
    }

    // Data will be fetched from backend server, if it fails, I have set it to use local json copy. But in real deployment, we should show an error pop up.
    componentDidMount() {
        fetch('https://cors-anywhere.herokuapp.com/https://bit.ly/2OLFz9L')
            .then(response => response.json())
            .then(data => this.setState({ items: data }))
            .catch(error => {
                this.setState({ items: localData });
            });
    }

    // This function will show next video from data fetched.
    nextItem(prevKey) {
        console.log(prevKey);
        if (prevKey !== this.state.items.length - 1) {
            this.setState({ counter: prevKey + 1 });
        }
    }

    // This function will show previous video from data fetched.
    prevItem(prevKey) {
        console.log(prevKey);
        if (prevKey !== 0) {
            this.setState({ counter: prevKey - 1 });
        }
    }

    // This function will make viewSelector = 0, which will be sent to ToggleView as props to display Video in UI.
    showVideo() {
        this.setState({ viewSelector: 0 })
    }

    // This function will make viewSelector = 1, which will be sent to ToggleView as props to display Name of creator in UI.
    showCreator() {
        this.setState({ viewSelector: 1 })
    }

    render() {
        //console.log(this.state.items);
        return (
            <div className="swipeList">
                {(this.state.items[0]) === undefined ? "Data Loading" :
                    <>
                        <SwipeComp
                            key={`swipeItem-${this.state.counter}`}
                            onSwipeUp={() => this.nextItem(this.state.counter)}
                            onSwipeDown={() => this.prevItem(this.state.counter)}
                            onSwipeLeft={() => this.showCreator()}
                            onSwipeRight={() => this.showVideo()}
                            onRemoval={() => this.removeItem(this.state.counter)}
                        >
                            <ToggleView videoUrl={this.state.items[this.state.counter].video.smallUrl} creator={(this.state.items[this.state.counter].channel === null) ? "Not Available" : this.state.items[this.state.counter].channel.user.name} viewSelector={this.state.viewSelector} />
                        </SwipeComp>
                    </>
                }
            </div>
        );
    }
}

export default Display;