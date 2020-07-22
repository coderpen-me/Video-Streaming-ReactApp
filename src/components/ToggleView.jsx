import React from "react";
import '../Styling/ToggleView.css';

/*

This component will display either video or Name of video creator using viewSelector prop

*/
class ToggleView extends React.Component {
    render() {
        //console.log(this.props.viewSelector, this.props.creator);
        return (
            (this.props.viewSelector === 0) ?
                <video width="100%" autoPlay>
                    <source src={this.props.videoUrl} type="video/mp4" />
                </video>
                :
                <div className="creator-display-view">
                    {this.props.creator}
                </div>
        );
    }
}

export default ToggleView;