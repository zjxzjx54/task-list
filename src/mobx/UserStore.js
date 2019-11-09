import {observable, computed, action} from "mobx";

export default class UserStore {
    @observable user = {
        username:"zjxzjx",
        email:"444138776@qq.com",
        token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTczMjgzNDQ4LCJleHAiOjE1NzMyODcwNDh9.UKfOSUfwNBQB6EFJStMqAtHO9g-0UGKYm9mOCPMwdkY",
        userId:1
    };

    @action
    setUser(user){
        this.user = user
    }
}
