import React from 'react'
import {Layout,Menu, Dropdown, Icon,Form, Input, Button,Select,DatePicker,Row,Col} from "antd";
import moment from 'moment'
import {Link} from "react-router-dom"
import {inject, observer} from "mobx-react";
import {POST} from "../assets/js/http";
const { Header} = Layout;
const {Option} = Select;


@inject("userStore","currentStore","finishStore","timeoutStore")
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
            if (err) {
                console.log('Received values of form: ', values);
            }else{
                let {type,start_date,end_date,title} = values;
                title = title === undefined ? "" : title;
                start_date = moment(start_date).format("YYYY-MM-DD")
                end_date = moment(end_date).format("YYYY-MM-DD")
                const {userId} = this.props.userStore.user;
                let data = {userId, type,start_date,end_date,title};
                POST("/api/task/filter",data)
                    .then(res=>{
                        if(type === 'process'){
                            this.props.currentStore.setTaskList(res.data.data.process);
                        }else if(type === 'finished'){
                            this.props.finishStore.setTaskList(res.data.data.finished);
                        }else if(type === 'timeout'){
                            this.props.timeoutStore.setTaskList(res.data.data.timeout);
                        }else if(type === 'all'){
                            this.props.currentStore.setTaskList(res.data.data.process);
                            this.props.finishStore.setTaskList(res.data.data.finished);
                            this.props.timeoutStore.setTaskList(res.data.data.timeout);
                        }
                    })
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
                                    {getFieldDecorator('type',{
                                        initialValue: "process",
                                    })(
                                        <Select size={size} placeholder="请选择任务类型">
                                            <Option value="process">正在完成</Option>
                                            <Option value="finished">已经完成任务</Option>
                                            <Option value="timeout">超时任务</Option>
                                            <Option value="all">所有任务</Option>
                                        </Select>
                                    )}

                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item {...formItemLayout} label="标题" >
                                    {getFieldDecorator('title')(
                                        <Input size={size} />
                                    )}
                                </Form.Item>
                            </Col>
                            <Col span={10}>
                                <Form.Item labelCol={{span:5}} wrapperCol={{span:19}}  label="选择时间范围">
                                    <Form.Item
                                        style={{ display: 'inline-block', width: 'calc(45% - 12px)' }}
                                    >
                                        {getFieldDecorator('start_date',{
                                            initialValue: moment(),
                                        })(
                                            <DatePicker size={size}  format="YYYY-MM-DD"/>
                                        )}

                                    </Form.Item>
                                    <span style={{ display: 'inline-block', width: '24px', textAlign: 'center',color:'#ffffff',fontWeight:700, }}>--</span>
                                    <Form.Item style={{ display: 'inline-block', width: 'calc(45% - 12px)' }}>
                                        {getFieldDecorator('end_date',{
                                            initialValue: moment(),
                                        })(
                                            <DatePicker size={size}  format="YYYY-MM-DD"/>
                                        )}
                                    </Form.Item>
                                </Form.Item>
                            </Col>
                            <Col span={2}>
                                <Form.Item>
                                    <Button size={size} ghost htmlType="submit">
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
