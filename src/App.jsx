import React from "react";
import Display from "./components/Display.jsx"

/*

This component will show a message if screen size is large than 575px.
If screen size is <= 575, App will be displayed.

*/

class Application extends React.Component {

    constructor(props) {
        super(props);
        this.state = { width: 0, height: 0 };
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        //window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    }

    render() {
        return (
            (this.state.width > 575) ? "Please resize the window to mobile resolution (< 575px)" : 
            <Display />
        );
    }
}

export default Application;