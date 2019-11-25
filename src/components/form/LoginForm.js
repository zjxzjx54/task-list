import React from 'react'
import {Form, Icon, Input, Button, Checkbox, Tooltip} from 'antd';
import {GET, POST, setToken} from "../../assets/js/http";
import "../../assets/css/login.scss"
import {withRouter} from 'react-router-dom'
import {inject, observer} from "mobx-react";

@inject("userStore","currentStore","finishStore","timeoutStore")
@observer
class Login extends React.Component {
    constructor(props){
        super(props);
        let user = JSON.parse(localStorage.getItem("zjx-user"));
        this.state = {
            showUserNameTooltip: false,
            showPasswordTooltip: false,
            originalUser:{
                email:user ? user.email : "",
                password:user ? user.password : "",
            }
        };

    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                console.log('err', err);
                console.log('Received values of form: ', values);
            } else {
                const {email, password,remember} = values;
                if(remember){
                    localStorage.setItem("zjx-user",JSON.stringify({
                        email,password
                    }))
                }
                POST("/login", {
                    email, password
                }).then(res => {
                    if (res.data.success) {
                        setToken(res.data.data.token);
                        this.setState({showUserNameTooltip: false, showPasswordTooltip: false});
                        this.props.userStore.setUser(res.data.data);
                        GET(`/api/task/get?uid=${res.data.data.userId}&type=process`)
                            .then(res=>{
                                this.props.currentStore.setTaskList(res.data.data);
                            });
                        GET(`/api/task/get?uid=${res.data.data.userId}&type=finish`)
                            .then(res=>{
                                this.props.finishStore.setTaskList(res.data.data);
                            });
                        GET(`/api/task/get?uid=${res.data.data.userId}&type=timeout`)
                            .then(res=>{
                                this.props.timeoutStore.setTaskList(res.data.data);
                            });
                        this.props.history.push('/index/');
                    } else {
                        let $self = this;
                        res.data.msg === '用户名不存在'
                            ?
                            this.setState({showUserNameTooltip: true})
                            :
                            this.setState({showPasswordTooltip: true})
                        let timer = setTimeout(function () {
                            $self.setState({showUserNameTooltip: false, showPasswordTooltip: false})
                            clearTimeout(timer);
                        }, 2500)

                    }
                }).catch(err => console.log(err))

            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const {email, password} = this.state.originalUser;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <h1 style={{
                    color: '#ffffff',
                    fontSize: '28px',
                    textAlign: 'center',
                    marginBottom: '3vh'
                }}>Task Manager</h1>
                <Tooltip overlayClassName="tooltip-warn" visible={this.state.showUserNameTooltip}
                         title="邮箱名不对">
                    <Form.Item>
                        {getFieldDecorator('email', {
                            initialValue: email,
                            rules: [
                                {required: true, message: 'Please input your email!'},
                                {type: 'email', message: 'email format is incorrect!'},
                                {max:60,message:'The Max length is 60 bit!'},
                                {min:6,message:'The min length is 6 bit!'}
                            ],
                        })(
                            <Input
                                prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                placeholder="Username"
                            />
                        )}
                    </Form.Item>
                </Tooltip>
                <Tooltip placement="bottom" overlayClassName="tooltip-warn"
                         visible={this.state.showPasswordTooltip} title="密码错误">
                    <Form.Item>
                        {getFieldDecorator('password', {
                            initialValue: password,
                            rules: [
                                {required: true, message: 'Please input your Password!'},
                                {max:60,message:'The Max length is 60 bit!'},
                                {min:6,message:'The min length is 6 bit!'}
                            ],
                        })(
                            <Input
                                prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                type="password"
                                placeholder="Password"
                            />
                        )}
                    </Form.Item>
                </Tooltip>
                <Form.Item>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(<Checkbox style={{color: '#ffffff'}}>Remember me</Checkbox>)}
                    {/*  <a className="login-form-forgot" href="">
                                            Forgot password
                                        </a>*/}
                    <Button type="primary" style={{float: 'right'}} htmlType="submit"
                            className="login-form-button">
                        Log in
                    </Button>
                    <br/>
                    Or <a href="javascript: void(0)" style={{color: '#ffffff'}} onClick={()=>this.props.changeFormModel('signup')}>register
                    now!</a>
                </Form.Item>
            </Form>
        )
    }
}

const  LoginForm= Form.create({name: 'normal_login'})(Login);
export default withRouter(LoginForm)
