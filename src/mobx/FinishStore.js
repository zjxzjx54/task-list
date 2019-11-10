import {observable, computed, action} from "mobx";

export default class FinishStore {
    @observable finishTasks = [];

    @action
    setTaskList(list){
        this.finishTasks = list;
    }
}
