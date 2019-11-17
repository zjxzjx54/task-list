import React from 'react'
import {Layout,Menu, Dropdown, Icon,Form, Input, Button,Select,DatePicker,Row,Col} from "antd";
import moment from 'moment'
import {Link} from "react-router-dom"
import {inject, observer} from "mobx-react";
const { Header} = Layout;
const {Option} = Select;


@inject("userStore")
@observer
class TopHead extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            data:moment().format("YYYY-MM-DD"),
            userMenu:(
                <Menu onClick={this.clickMenu.bind(this)}>
                    <Menu.Item key="self">
            <span rel="noopener noreferrer" href="http://www.alipay.com/">
                个人信息
            </span>
                    </Menu.Item>
                    <Menu.Item key="loginOut">
            <span rel="noopener noreferrer" >
                退出登录
            </span>
                    </Menu.Item>
                </Menu>),
        }
        this.clickMenu = this.clickMenu.bind(this)
    }
    clickMenu = ({key})=>{
        if(key === 'loginOut'){
            this.props.history.push('/')
        }

    }


    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    };


    render(){
        const { getFieldDecorator } = this.props.form;
        const {username} = this.props.userStore.user;
        const formItemLayout = {
            labelCol: { span: 8},
            wrapperCol: { span: 14 },
        };
        const size = 'small';

        return (
            <Header className="zjx-header">
                <div className="header-top">
                    <Menu onClick={this.handleClick}  theme="dark" mode="horizontal">
                        <Menu.Item key="index">
                            <Link to="/index">
                                <Icon type="home" />
                                Home
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="process">
                            <Link to="/process">
                                <span className="fa fa-calendar-check-o" style={{marginRight:'10px'}} />
                                Process
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="finish">
                            <Link to="/finished">
                                <span className="fa fa-calendar-check-o" style={{marginRight:'10px'}} />
                                Finish Task
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="timeout">
                            <Link to="/timeout">
                                <span className="fa fa-times-rectangle-o" style={{marginRight:'10px'}}/>
                                Time out Task
                            </Link>
                        </Menu.Item>
                    </Menu>
                    <Dropdown overlay={this.state.userMenu}>
                        <Button type="link" ghost>
                            {username} <Icon type="down" />
                        </Button>
                    </Dropdown>
                </div>
                <div className="header-bottom">
                    <Form layout="inline" labelAlign="center"  className="header-form"  onSubmit={this.handleSubmit}>
                        <Row>
                            <Col span={5}>
                                <Form.Item {...formItemLayout} label="任务类型">
                                    <Select size={size} placeholder="请选择任务类型">
                                        <Option value="future">将来任务</Option>
                                        <Option value="finished">已经完成任务</Option>
                                        <Option value="process">未完成任务</Option>
                                        <Option value="all">所有任务</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item {...formItemLayout} label="标题" >
                                    <Input size={size} />
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item labelCol={{span:5}} wrapperCol={{span:19}}  label="选择时间范围">
                                    <Form.Item
                                        style={{ display: 'inline-block', width: 'calc(45% - 12px)' }}
                                    >
                                        <DatePicker size={size} />
                                    </Form.Item>
                                    <span style={{ display: 'inline-block', width: '24px', textAlign: 'center',color:'#ffffff',fontWeight:700, }}>--</span>
                                    <Form.Item style={{ display: 'inline-block', width: 'calc(45% - 12px)' }}>
                                        <DatePicker size={size}/>
                                    </Form.Item>
                                </Form.Item>
                            </Col>
                            <Col span={2}>
                                <Form.Item>
                                    <Button size={size} ghost>
                                        Search
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                    <span style={{lineHeight:'32px',color:'#ffffff'}}>{this.state.data}</span>
                </div>
            </Header>
        )
    }
}


export default Form.create({ name: 'normal_login' })(TopHead);
