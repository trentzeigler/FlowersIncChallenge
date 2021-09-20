import React from 'react';
import Clock from "react-clock";
import MessageDisplay from "./local.Trent/Message.jsx";

class InternClock extends React.Component
{
    render(){
        return <React.Fragment>
            <h1>Hello</h1>
            <MessageDisplay />
            <br/>
            <Clock value={new Date()} size= {250} renderNumbers={true} />
        </React.Fragment>
    }
};

export default InternClock;