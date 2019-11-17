import React from 'react'
import {Form, Icon, Input, Button, Checkbox, Tooltip} from 'antd';
import {Link} from 'react-router-dom'
import {GET,POST,setToken} from '../assets/js/http'
import {inject, observer} from "mobx-react";

const styles = {
    formLogin: {
        width: '25vw',
        height: '40vh',
        margin: 'auto',
        minHeight: '360px',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
    }

};
@inject("userStore","currentStore","finishStore")
@observer
class Login extends React.Component {
    constructor(props) {
        super(props);
        let user = JSON.parse(localStorage.getItem("zjx-user"));
        this.state = {
            formModel: 'login',
            showUserNameTooltip: false,
            showPasswordTooltip: false,
            originalUser:{
                email:user ? user.email : "",
                password:user ? user.password : "",
        }
        };

        this.changeFormModel = (type) => {
            this.setState({
                formModel: type === 'login' ? 'login' : 'signup'
            })
        }
        this.compareTopassword = (rule, value, callback) => {
            const {form} = this.props;
            if (value && value !== form.getFieldValue('password')) {
                callback("two password value is not same!")
            } else
                callback();
        }

    }

    componentDidMount(){

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
            <div id="container">
                <div id="output" style={{height: '100vh', width: '100vw', position: 'relative'}}>
                    <div style={styles.formLogin}>
                        {
                            this.state.formModel === 'login' ?
                                <Form onSubmit={this.handleSubmit} className="login-form">
                                    <h1 style={{
                                        color: 'blue',
                                        fontSize: '28px',
                                        textAlign: 'center',
                                        marginBottom: '3vh'
                                    }}>Task Manager</h1>
                                    <Tooltip overlayClassName="tooltip-warn" visible={this.state.showUserNameTooltip}
                                             title="用户名不对">
                                        <Form.Item>
                                            {getFieldDecorator('email', {
                                                initialValue:email,
                                                rules: [
                                                    {required: true, message: 'Please input your email!'},
                                                    {type: 'email', message: 'email format is incorrect!'},
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
                                                initialValue:password,
                                                rules: [{required: true, message: 'Please input your Password!'}],
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
                                        })(<Checkbox>Remember me</Checkbox>)}
                                        {/*  <a className="login-form-forgot" href="">
                                            Forgot password
                                        </a>*/}
                                        <Button type="primary" style={{float: 'right'}} htmlType="submit"
                                                className="login-form-button">
                                            Log in
                                        </Button>
                                        <br/>
                                        Or <a href="javascript: void(0)" onClick={this.changeFormModel}>register
                                        now!</a>
                                    </Form.Item>
                                </Form>
                                :
                                <Form onSubmit={this.handleSubmit} className="singup-form">
                                    <Form.Item label="User Name">
                                        {getFieldDecorator('username', {
                                            rules: [{required: true, message: 'Please input your username!'}],
                                        })(
                                            <Input
                                                prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                                placeholder="Username"
                                            />,
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Password">
                                        {getFieldDecorator('password', {
                                            rules: [{required: true, message: 'Please input your Password!'}],
                                        })(
                                            <Input.Password/>,
                                        )}
                                    </Form.Item>
                                    <Form.Item label="Confirm Password">
                                        {getFieldDecorator('confirmPs', {
                                            rules: [
                                                {require: true, message: "Please type confirm your password"}
                                            ],
                                            validator: this.compareTopassword
                                        })(<Input.Password/>)}

                                    </Form.Item>
                                </Form>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const LoginPage = Form.create({name: 'normal_login'})(Login);
export default LoginPage
