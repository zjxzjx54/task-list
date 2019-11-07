import React  from 'react'
import ColumnContainer from "../components/ColumnContainer";
import {inject, observer} from "mobx-react";

@inject("finishStore")
@observer
class Finished extends React.Component {
    constructor(props){
        super(props);

    }

    render(){
        return (
            <div className="main-layout">
                <ColumnContainer mode="single" type="process" tasksList={this.props.finishStore.processList} />
            </div>
        )
    }
}

export default Finished
