import React  from 'react'
import ColumnContainer from "../components/ColumnContainer";
import {inject, observer} from "mobx-react";
@inject("currentStore")
@observer
class Process extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        console.log(this.props.currentStore)
        return (
            <div className='main-layout'>
                <ColumnContainer mode="single" type="Process Task" tasksList={this.props.currentStore.currentTasks} />
            </div>
        )
    }
}

export default Process
