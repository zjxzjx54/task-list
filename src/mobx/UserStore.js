import {observable, computed, action} from "mobx";

export default class UserStore {
    @observable user = {
        name:"游客",
        id:-1,
        token:null,
    };
}