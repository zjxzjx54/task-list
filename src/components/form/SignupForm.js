import React from 'react'
import {Form, Icon, Input, Button, Checkbox, Tooltip, message} from 'antd';
import {POST} from "../../assets/js/http";
import {withRouter} from 'react-router-dom'
import "../../assets/css/login.scss"
class Signup extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            showUserNameTooltip: false,
            showPasswordTooltip: false,
        };
        this.showNote = this.showNote.bind(this)
    }
    showError = (msg) => {
        message.error(msg);
    };
    showNote(msg) {
        message.success(msg,3 , ()=>{
            this.props.form.resetFields()
            this.props.changeFormModel('login')
        });
    }
    goBack(){

        this.props.changeFormModel('login')
    }
    compareTopassword = (rule, value, callback) => {
        const {form} = this.props;
        if (value && value !== form.getFieldValue('password')) {
            callback("two password value is not same!")
        } else
            callback();
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                console.log('err', err);
                console.log('Received values of form: ', values);
            } else {
                const {email, password,username} = values;

                POST("/signup", {
                    email, password,username
                }).then(res => {
                    let {success,msg} = res.data;
                    if(success){
                        this.props.form.resetFields()
                        this.showNote("创建成功,即将进入登录窗口")
                    }else{
                        this.showError(msg)
                    }
                }).catch(err =>   this.showError(err))

            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="signup-form">
                <Form.Item className="form-item" label="User Name">
                    {getFieldDecorator('username', {
                        rules: [
                            {required: true, message: 'Please input your username!'},
                            {max: 60, message: 'The Max length is 60 bit!'},
                            {min: 6, message: 'The min length is 6 bit!'}
                        ],
                    })(
                        <Input
                            prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            placeholder="Username"
                        />,
                    )}
                </Form.Item>
                <Form.Item className="form-item" label="Email">
                    {getFieldDecorator('email', {
                        rules: [
                            {required: true, message: 'Please input your email!'},
                            {max: 60, message: 'The Max length is 60 bit!'},
                            {min: 6, message: 'The min length is 6 bit!'}
                            ],
                    })(
                        <Input
                            prefix={<Icon type="email" style={{color: 'rgba(0,0,0,.25)'}}/>}
                            placeholder="Email"
                        />,
                    )}
                </Form.Item>
                <Form.Item label="Password">
                    {getFieldDecorator('password', {
                        rules: [
                            {required: true, message: 'Please input your Password!'},
                            {max: 60, message: 'The Max length is 60 bit!'},
                            {min: 6, message: 'The min length is 6 bit!'}
                            ],
                    })(
                        <Input.Password/>,
                    )}
                </Form.Item>
                <Form.Item label="Confirm Password">
                    {getFieldDecorator('confirmPs', {
                        rules: [
                            {required: true, message: "Please type confirm your password"},
                            {max: 60, message: 'The Max length is 60 bit!'},
                            {min: 6, message: 'The min length is 6 bit!'},
                            {    validator: this.compareTopassword}
                        ],

                    })(<Input.Password/>)}

                </Form.Item>
                <div className="signup-submit-container">
                    <Button ghost onClick={()=> this.goBack()}>Go Back</Button>
                    <Button type="primary" htmlType="submit"
                            className="login-form-button">
                        Sign Up
                    </Button>
                </div>
            </Form>
        )
    }
}

const  SignupForm= Form.create({name: 'normal_login'})(Signup);
export default withRouter(SignupForm)
