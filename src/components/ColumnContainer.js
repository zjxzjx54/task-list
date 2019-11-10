import React from 'react';

import {Row,Col,Card, Icon,Input,Button,Modal, Form, Select, DatePicker}  from 'antd'
import axios from "axios";
import moment from 'moment'
import {inject, observer} from "mobx-react";
const {RangePicker } = DatePicker;
const {Search} = Input;
const {Option} = Select;

@inject("userStore")
@observer
class ColumnContainerForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            searchContent : "",
            modalVisibel:false,
            confirmLoading:false,
        }
    }

    searchByTitle(e){
        console.log("e", e);
        this.setState({
            searchContent:e.target.value
        })
    }
    addTask(){
        this.setState({
            modalVisibel:true
        })
    }
    saveTask = (e)=>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (err) {
                console.log('Received values of form: ', values);
            } else {
                values = Object.assign({},values,{
                    start_date:values.rangeTime[0].format('YYYY-MM-DD'),
                    end_date:values.rangeTime[1].format('YYYY-MM-DD'),
                })
                const {userId,token} = this.props.userStore.user;
                axios.post("/api/task/add", {
                    userId, ...values
                },{headers:{'Authorization':token}}).then(res => {
                    if (res.data.success) {
                        this.setState({showUserNameTooltip: false, showPasswordTooltip: false});
                        this.props.userStore.setUser(res.data.data);
                        this.props.history.push('/index/');
                    } else {
                        let $self = this;
                        res.data.msg === '用户名不存在'
                            ?
                            this.setState({showUserNameTooltip: true})
                            :
                            this.setState({showPasswordTooltip: true})
                        setTimeout(function () {
                            $self.setState({showUserNameTooltip: false, showPasswordTooltip: false})
                        }, 2500)

                    }
                }).catch(err => console.log(err))

            }
        });
    }

    cancelAdd = (e) => {
        this.setState({
            modalVisibel:false,
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        let {modalVisibel,confirmLoading} = this.state;
        let Height = window.innerHeight|| document.documentElement.clientHeight || document.body.clientHeight;
        return (
            <div style={{width:this.props.mode === 'muti' ? "33vw" :'100vw'}} className='column-container'>
                <div style={{position:"fixed",top:'80px'}}>
                    <div className="column-header">
                        <h1>{this.props.type}</h1>
                        <Button type="link" onClick={()=>this.addTask(this.props.type)} icon="plus-circle" size="small" />
                    </div>
                    <Search
                        placeholder="Search by Title"
                        onChange={e => this.searchByTitle(e)}
                        style={{ width:  "30vw" ,marginBottom:'1vw', marginLeft:'0', marginRight:'0'}}
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
                                                       <Icon type="edit" key="edit"/>,
                                                       <Icon type="delete" key="ellipsis"/>,
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
                                                       <Icon type="edit" key="edit"/>,
                                                       <Icon type="delete" key="ellipsis"/>,
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
                    title="添加新任务"
                    visible={modalVisibel}
                    centered
                    onOk={this.saveTask}
                    confirmLoading={confirmLoading}
                    onCancel={this.cancelAdd}
                >
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <Form.Item label="工作项名">
                            {getFieldDecorator('title', {
                                rules: [{ required: true, message: '请输入工作项名!' }],
                            })(
                                <Input
                                    prefix={<Icon type="file-add" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="请输入工作项名"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item label="标签">
                            {getFieldDecorator('tag', {
                                rules: [{ required: true, message: '请输入标签名' }],
                            })(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    placeholder="Tag Name"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item label="开始和结束时间">
                            {getFieldDecorator('rangeTime', {
                                initialValue:[moment(),moment()],
                                rules: [{ type: 'array', required: true, message: '请选择开始和结束时间!' }],})
                            (<RangePicker format="YYYY-MM-DD" />)}
                        </Form.Item>
                        <Form.Item label="备注">
                            {getFieldDecorator('note')(
                                <Input
                                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                    type="textarea"
                                    placeholder="请填写备注"
                                />,
                            )}
                        </Form.Item>
                        <Form.Item label="紧急程度">
                            {getFieldDecorator('status',{
                                initialValue:"1"
                            })(
                                <Select  style={{ width: 120 }} >
                                    <Option value="1">普通</Option>
                                    <Option value="0">较低</Option>
                                    <Option value="2">紧急</Option>
                                </Select>,
                            )}
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}
const ColumnContainer = Form.create({name: 'new_task'})(ColumnContainerForm);
export default ColumnContainer
