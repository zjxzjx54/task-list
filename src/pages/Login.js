import React from 'react'
import {Form, Icon, Input, Button, Checkbox, Tooltip} from 'antd';
import Particles from 'react-particles-js'
import {GET,POST,setToken} from '../assets/js/http'
import {inject, observer} from "mobx-react";
import "../assets/css/login.scss"
import LoginForm from "../components/form/LoginForm";
import SignupForm from "../components/form/SignupForm";




class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formModel: 'login',

        };
        this.changeFormModel = (type) => {
            this.setState({
                formModel: type === 'login' ? 'login': 'signup'
            })
        }


    }





    render() {


        return (
            <div id="container">
                <Particles className="canvas-wrapper" params={{
                    "particles": {
                        "number": {
                            "value": 100
                        },
                        "size": {
                            "value": 3
                        },
                        "shape": {
                            'type':['star']
                        }
                    },
                }} />
                <div id="output">
                    <div className="form-container">
                        {
                            this.state.formModel === 'login' ?
                                <LoginForm  changeFormModel={this.changeFormModel}/>
                                :
                                <SignupForm changeFormModel={this.changeFormModel}/>
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const LoginPage = Form.create({name: 'normal_login'})(Login);
export default LoginPage
