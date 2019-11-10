import React  from 'react'
import ColumnContainer from "../components/ColumnContainer";
import {inject, observer} from "mobx-react";

@inject("userStore","currentStore","finishStore")
@observer
class Index extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            processList:this.props.currentStore.currentTasks,
            finishList:this.props.finishStore.finishTasks,
            timeoutList: [
                {
                    title:'任务1',
                    isFinish:false,
                    tag:"前端工作1",
                    taskStart:"2019-11-04",
                    taskEnd:"2019-11-05",
                    note:"克服困难加油完成",
                    result:0,   //0正在完成,1已经完成, -1超时未完成,-2 超时完成
                }
            ],

        }
    }

    render(){

        return (
            <div  className='main-layout'>
                <ColumnContainer mode="muti" type="Process Task" tasksList={this.state.processList} />
                <ColumnContainer mode="muti"  type="finished Task" tasksList={this.state.finishList} />
                <ColumnContainer mode="muti"  type="Timeout Task" tasksList={this.state.timeoutList} />
            </div>
        )
    }
}

export default Index
