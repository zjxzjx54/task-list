import {observable, computed, action} from "mobx";

export default class CurrentStore {
    @observable currentTasks =  [
/*        {
            title:'任务1',
            isFinish:false,
            tag:"前端工作1",
            taskStart:"2019-11-04",
            taskEnd:"2019-11-05",
            note:"克服困难加油完成",
            result:0,   //0正在完成,1已经完成, -1超时未完成,-2 超时完成
        }*/
    ];

    @action
    setTaskList(list){
        this.currentTasks = list;
    }

}
