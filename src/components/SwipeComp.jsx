import React from "react";
import '../Styling/SwipeItem.css';

/*

This component will handle all swipe events and mouse events. And then call functions of Display component passed as props.

*/

class SwipeComp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            left: 0,
            right: 0,
            up: 0,
            down: 0,

            originalOffset_left: 0,
            originalOffset_up: 0,
            originalOffset_down: 0,
            originalOffset_right: 0,

            velocity_left: 0,
            velocity_up: 0,
            velocity_down: 0,
            velocity_right: 0,

            timeOfLastDragEvent: 0,

            touchStartX: 0,
            prevTouchX: 0,

            touchStartY: 0,
            prevTouchY: 0,

            beingTouched: false,
            intervalId: null,

        };
    }

    //This function handles what to do after swipe ends and makes all states to initial values and ready to next swipe detection.
    // Update : This function will be called several time to make all direction values zero. 
    actionDetection() {
        let { left, up, down, right, velocity_left, velocity_up, velocity_down, velocity_right, beingTouched } = this.state;
        if (!beingTouched && ((left < -0.01) || up < -0.01 || down < -0.01 || right < -0.01)) {

            // Next 4 ifs will reduce the left, right, up and down values to initial state 

            if (left < - 0.01) {
                velocity_left += 10 * 0.033;
                left += velocity_left;
            }

            if (right < - 0.01) {
                velocity_right += 10 * 0.033;
                right += velocity_right;
            }

            if (up < - 0.01) {
                velocity_up += 10 * 0.033;
                up += velocity_up;
            }

            if (down < - 0.01) {
                velocity_down += 10 * 0.033;
                down += velocity_down;
            }

            // Next 4 Ifs will check if any action is detected (Up, Down, Left, Right)

            if (up < -100) {
                window.clearInterval(this.state.intervalId);
                this.handleUpSwipe();
            }

            if (down < -100) {
                window.clearInterval(this.state.intervalId);
                this.handleDownSwipe();
            }

            if (right < -100) {
                window.clearInterval(this.state.intervalId);
                this.handleRightSwipe();
            }

            if (left < -100) {
                window.clearInterval(this.state.intervalId);
                this.handleLeftSwipe();
            }

            this.setState({ left, up, down, right, velocity_left, velocity_up, velocity_down, velocity_right });
        }

        else {
            left = 0;
            up = 0;
            down = 0;
            right = 0;
            velocity_left = 0;
            velocity_up = 0;
            velocity_down = 0;
            velocity_right = 0;
            window.clearInterval(this.state.intervalId);
            this.setState({ left, up, down, right, velocity_left, velocity_up, velocity_down, velocity_right, intervalId: null, originalOffset_down: 0, originalOffset_left: 0, originalOffset_up: 0 });
        }
    }

    //function for Up swipe detection -> This in turn will call prop function after 100 ms.
    handleUpSwipe() {
        window.setTimeout(() => this.props.onSwipeUp(), 100);
    }

    //function for Down swipe detection -> This in turn will call prop function after 100 ms.
    handleDownSwipe() {
        window.setTimeout(() => this.props.onSwipeDown(), 100);
    }

    //function for Left swipe detection -> This in turn will call prop function after 100 ms.
    handleLeftSwipe() {
        window.setTimeout(() => this.props.onSwipeLeft(), 100);
    }

    //function for Right swipe detection -> This in turn will call prop function after 100 ms.
    handleRightSwipe() {
        window.setTimeout(() => this.props.onSwipeRight(), 100);
    }

    //This function will initialize start x and y coordinates and set other values to 0.
    // It basically initializes values when swipe starts. 
    handleStart(clientX, clientY) {
        if (this.state.intervalId !== null) {
            window.clearInterval(this.state.intervalId);
        }
        this.setState({
            originalOffset_left: 0,
            originalOffset_up: 0,
            originalOffset_down: 0,
            originalOffset_right: 0,
            velocity_left: 0,
            velocity_up: 0,
            velocity_down: 0,
            velocity_right: 0,
            timeOfLastDragEvent: Date.now(),
            touchStartX: clientX,
            touchStartY: clientY,
            beingTouched: true,
            intervalId: null
        });
    }

    // This function will update the states while swipe is being performed.
    handleMove(clientX, clientY) {
        //console.log(this.state.left, this.state.up, this.state.down, this.state.right);
        if (this.state.beingTouched) {

            const touchX = clientX;
            const touchY = clientY;
            const currTime = Date.now();
            const elapsed = currTime - this.state.timeOfLastDragEvent;

            const velocity_left = 20 * (touchX - this.state.prevTouchX) / elapsed;
            const velocity_up = 20 * (touchY - this.state.prevTouchY) / elapsed;
            const velocity_down = 20 * (this.state.prevTouchY - touchY) / elapsed;
            const velocity_right = 20 * (this.state.prevTouchX - touchX) / elapsed;

            let delta_left = touchX - this.state.touchStartX + this.state.originalOffset_left;
            let delta_up = touchY - this.state.touchStartY + this.state.originalOffset_up;
            let delta_down = this.state.touchStartY - touchY + this.state.originalOffset_down;
            let delta_right = this.state.touchStartX - touchX + this.state.originalOffset_right;

            this.setState({
                left: delta_left,
                up: delta_up,
                down: delta_down,
                right: delta_right,
                velocity_left,
                velocity_up,
                velocity_down,
                velocity_right,
                timeOfLastDragEvent: currTime,
                prevTouchX: touchX,
                prevTouchY: touchY,
            });
        }
    }

    // This function will be invoked when swipe is ended. Now, It will reset x and y coordinates.
    // At the end action detection (Up, right, left, down) will be down by invoking actionDetection function.
    handleEnd() {
        this.setState({
            velocity_left: this.state.velocity_left,
            velocity_up: this.state.velocity_up,
            velocity_down: this.state.velocity_down,
            velocity_right: this.state.velocity_right,
            touchStartX: 0,
            touchStartY: 0,
            beingTouched: false,
            intervalId: window.setInterval(this.actionDetection.bind(this), 15)
        });
    }
    
    // touch start handler
    handleTouchStart(touchStartEvent) {
        touchStartEvent.preventDefault();
        this.handleStart(touchStartEvent.targetTouches[0].clientX, touchStartEvent.targetTouches[0].clientY);
    }

    // touch move handler
    handleTouchMove(touchMoveEvent) {
        touchMoveEvent.preventDefault();
        this.handleMove(touchMoveEvent.targetTouches[0].clientX, touchMoveEvent.targetTouches[0].clientY);
    }

    // touch end handler
    handleTouchEnd() {
        this.handleEnd();
    }

    handleMouseDown(mouseDownEvent) {
        mouseDownEvent.preventDefault();
        this.handleStart(mouseDownEvent.clientX, mouseDownEvent.clientY);
    }

    handleMouseMove(mouseMoveEvent) {
        mouseMoveEvent.preventDefault();
        this.handleMove(mouseMoveEvent.clientX, mouseMoveEvent.clientY);
    }

    handleMouseUp() {
        this.handleEnd();
    }

    handleMouseLeave() {
        this.handleMouseUp();
    }

    render() {
        /*console.log(this.state.left, this.state.up, this.state.down, this.state.right, this.state.originalOffset_left, this.state.originalOffset_up,
            this.state.originalOffset_down, this.state.originalOffset_right);*/
        return (
            <div className="swipeItem"
                onTouchStart={touchStartEvent => this.handleTouchStart(touchStartEvent)}
                onTouchMove={touchMoveEvent => this.handleTouchMove(touchMoveEvent)}
                onTouchEnd={() => this.handleTouchEnd()}

                onMouseDown={mouseDownEvent => this.handleMouseDown(mouseDownEvent)}
                onMouseMove={mouseMoveEvent => this.handleMouseMove(mouseMoveEvent)}
                onMouseUp={() => this.handleMouseUp()}
                onMouseLeave={() => this.handleMouseLeave()}
            >
                <div className="swipeItem-content">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default SwipeComp;