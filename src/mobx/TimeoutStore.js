import {observable, computed, action} from "mobx";

export default class TimeoutStore {
    @observable timeoutTasks = [];

    @action
    setTaskList(list){
        this.timeoutTasks = list;
    }
}
