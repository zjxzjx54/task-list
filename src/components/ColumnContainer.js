import React from 'react';

import {Row, Col, Card, Icon, Input, Button, Modal, Form, Select, DatePicker, message} from 'antd'
import {POST} from "assets/js/http";
import moment from 'moment'
import * as R from 'ramda'
import {inject, observer} from "mobx-react";

const {RangePicker} = DatePicker;
const {Search} = Input;
const {Option} = Select;

@inject("userStore", 'currentStore')
@observer
class ColumnContainerForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchContent: "",
            modalVisibel: false,
            confirmLoading: false,
            confirmModalVisibel:false,
            modalTitle:"添加新任务",
            currentTaskIndex:-1,
        }
        this.showError = this.showError.bind(this);
    }

    searchByTitle(e) {
        console.log("e", e);
        this.setState({
            searchContent: e.target.value
        })
    }

    addTask() {
        this.setState({
            modalVisibel: true,
            modalTitle:"添加新任务"
        })
    }
    updateTask(index){

        this.setState({
            modalVisibel: true,
            modalTitle:"更新任务",
            currentTaskIndex:index
        })
        let currentTask = this.props.tasksList[index];
        this.props.form.setFieldsValue({
            title: currentTask.title,
            tag: currentTask.tag,
            rangeTime:[moment(currentTask.start_date), moment(currentTask.end_date)],
            note:currentTask.note,
            status:currentTask.status.toString(),
        });
    }
    saveTask = async (e) => {
        let {modalTitle,currentTaskIndex} = this.state;
        e.preventDefault();
        this.setState({
            confirmLoading: true,
        })
        this.props.form.validateFields((err, values) => {
            if (err) {
                console.log('Received values of form: ', values);
            }
            else {
                values = Object.assign({}, values, {
                    start_date: values.rangeTime[0].format('YYYY-MM-DD'),
                    end_date: values.rangeTime[1].format('YYYY-MM-DD'),
                })
                delete values.rangeTime;
                const {userId} = this.props.userStore.user;
                let url = '',data = {
                    userId, ...values
                };
                if(modalTitle === "添加新任务"){

                    url= "/api/task/add"
                }else{

                    url= '/api/task/update';
                    data.id = this.props.tasksList[currentTaskIndex].id
                }

                POST(url, data ).then(res => {
                    this.setState({
                        modalVisibel: false,
                        confirmLoading: false,
                    })
                    if (res.data.success) {
                        this.setState({showUserNameTooltip: false, showPasswordTooltip: false});
                        if(modalTitle === "添加新任务"){
                            this.props.currentStore.setTaskList(res.data.data);
                        }else{
                            let newTaskList = [].concat(this.props.tasksList);
                            newTaskList[currentTaskIndex] = data;
                            this.props.currentStore.setTaskList(newTaskList);
                        }
                        this.props.form.resetFields()
                        this.showNote(res.data.msg)
                    } else {
                        this.showError(res.data.msg)
                    }
                }).catch(err => console.log(err))

            }
        });
    }
    showError = (msg) => {
        message.error(msg);
    };
    showNote = (msg) => {
        message.success(msg);
    }
    cancelAdd = (e) => {
        this.setState({
            modalVisibel: false,
            confirmLoading: false,
        })
    }
    deleteTask = (id) => {
        const {userId} = this.props.userStore.user;
        POST("/api/task/delete", {
            userId, taskId: id
        }).then(res => {
            if (res.data.success) {
                //let oldTaskList = [].concat(this.props.currentStore.currentTasks);
                this.props.currentStore.setTaskList(R.filter((item) => item.id !== id, this.props.currentStore.currentTasks))
                this.showNote(res.data.msg)
            } else {
                this.showError(res.data.msg)
            }
        })
    }
    hideConfirm = () => {
        this.setState({
            confirmModalVisibel:false
        })
    }
    showConfirm = (id) => {
        Modal.confirm({
            title: '注意',
            content: '确认删除该任务项',
            okText: '确认',
            cancelText: '取消',
            onCancel: this.hideConfirm,
            onOk: () => this.deleteTask(id)
        })
    };


    render() {
        const {getFieldDecorator} = this.props.form;
        let {modalVisibel, confirmLoading} = this.state;
        let Height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
        return (
            <div style={{width: this.props.mode === 'muti' ? "33vw" : '100vw'}} className='column-container'>
                <div style={{position: "fixed", top: '80px'}}>
                    <div className="column-header">
                        <h1>{this.props.type}</h1>
                        <Button type="link" onClick={() => this.addTask(this.props.type)} icon="plus-circle"
                                size="small"/>
                    </div>
                    <Search
                        placeholder="Search by Title"
                        onChange={e => this.searchByTitle(e)}
                        style={{width: "30vw", marginBottom: '1vw', marginLeft: '0', marginRight: '0'}}
                    />
                </div>
                 <div className="task-container" style={{height:Height - 230 +'px'}}>
                     {
                         this.props.tasksList.map((item, index) => {
                             if (this.state.searchContent !== '') {
                                 if (item.title.indexOf(this.state.searchContent) !== -1) {
                                     return (<Row style={{width: "30vw"}} gutter={8}>
                                         <Col span={24} style={{paddingLeft:'0',paddingRight:'0'}}>
                                             <Card bordered={true}
                                                   actions={[
                                                       <Icon type="select" key="setting"/>,
                                                       <Icon type="edit" onClick={() => this.updateTask(index)} key="edit"/>,
                                                       <Icon type="delete" onClick={() => this.deleteTask(item.id)} key="ellipsis"/>,
                                                   ]}>
                                                 <Card.Meta
                                                     title={item.title}
                                                     description={item.note}
                                                 />
                                             </Card>
                                         </Col>
                                     </Row>)
                                 }
                             }
                             else {
                                 return (
                                     <Row style={{width: "30vw", marginLeft:'0', marginRight:'0',marginBottom:'1vh'}} gutter={8}>
                                         <Col span={24} style={{paddingLeft:'0',paddingRight:'0'}}>
                                             <Card bordered={true}
                                                   actions={[
                                                       <Icon type="select" key="setting"/>,
                                                       <Icon type="edit" onClick={() => this.updateTask(index)} key="edit"/>,
                                                       <Icon type="delete" onClick={() => this.deleteTask(item.id)} key="ellipsis"/>,
                                                   ]}>
                                                 <Card.Meta
                                                     title={item.title}
                                                     description={item.note}
                                                 />
                                             </Card>
                                         </Col>
                                     </Row>
                                 )
                             }}
                         )
                     }
                 </div>
                <Modal
                    title={this.state.modalTitle}
                    visible={modalVisibel}
                    centered
                    onOk={this.saveTask}
                    confirmLoading={confirmLoading}
                    onCancel={this.cancelAdd}
                >
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item label="工作项名">
                            {getFieldDecorator('title', {
                                rules: [{required: true, message: '请输入工作项名!'}],
                            })(
                                <Input
                                    prefix={<Icon type="file-add" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="请输入工作项名"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item label="标签">
                            {getFieldDecorator('tag', {
                                rules: [{required: true, message: '请输入标签名'}],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    placeholder="Tag Name"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item label="开始和结束时间">
                            {getFieldDecorator('rangeTime', {
                                initialValue: [moment(), moment()],
                                rules: [{type: 'array', required: true, message: '请选择开始和结束时间!'}],
                            })
                            (<RangePicker format="YYYY-MM-DD"/>)}
                        </Form.Item>
                        <Form.Item label="备注">
                            {getFieldDecorator('note')(
                                <Input
                                    prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                    type="textarea"
                                    placeholder="请填写备注"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item label="紧急程度">
                            {getFieldDecorator('status', {
                                initialValue: "1"
                            })(
                                <Select style={{width: 120}}>
                                    <Option value="1">普通</Option>
                                    <Option value="0">较低</Option>
                                    <Option value="2">紧急</Option>
                                </Select>,
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
                mountNode
            </div>
        );
    }
}

const ColumnContainer = Form.create({name: 'new_task'})(ColumnContainerForm);
export default ColumnContainer
