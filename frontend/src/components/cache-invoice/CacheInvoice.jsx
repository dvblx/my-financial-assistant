import React, {useState, useEffect, useContext} from 'react'
import { Button, Modal, Select, Space, Table } from "antd";

import { Checkbox, Form, Input } from "antd";

import { AiOutlineDelete } from "react-icons/ai";

import AuthContext from '../../context/AuthContext'

const { Column, ColumnGroup } = Table;



const API_URL = "http://localhost:8000/api/cash-invoice/";



const CacheInvoice = () => {
    let {authTokens, logoutUser} = useContext(AuthContext)
   const [isModal, setIsModal] = useState(false);

   const [tableData, setTableData] = useState([]);

   const [formProps, setFormProps] = useState(null);

   useEffect(() => {
      async function getData() {
         let response = await fetch(`${API_URL}`, {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
                Authorization: "Bearer " + String(authTokens.access),
            },
         });
         //здесь получаем данные с сервера и преобразовываем в нормальный вид, записываем в стейт, чтобы оно обновилось
         let data = await response.json().then((data) => {
            data.forEach((el) => {
               setTableData([
                  ...tableData,
                  { id: el.id, currency: el.currency, amount: el.amount },
               ]);
            });
         });
         console.log(data);
      }

      getData();
   }, []);

   function handleAdd() {
      setIsModal(true);
   }
   function handleEdit(record) {
      setFormProps(record);
      console.log(record);
      setIsModal(true);
   }

   const handleOk = () => {
      setIsModal(false);
   };

   const handleCancel = () => {
      setIsModal(false);
   };

   async function handleDelete(record) {
      let response = await fetch(`${API_URL}/${record.id}`, {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
         },
      });
      setTableData(
         tableData.filter((el) => {
            return el.id !== record.id;
         })
      );
   }

   function handleSubmit(values, props) {
      console.log(values);
      if (props !== null) {
         setTableData((tableData) =>
            tableData.filter((el) => {
               return props.id !== el.id;
            })
         );
      }
      setTableData((tableData) => [...tableData, {...values, id:crypto.randomUUID()}]);
      setIsModal(false);
   }

   return (
      <div>
         <Table dataSource={tableData} key={crypto.randomUUID()}>
            <ColumnGroup title="Cash">
               <Column title="Валюта" dataIndex="currency" key="currency" />
               <Column title="amount" dataIndex="amount" key="amount" />
            </ColumnGroup>
            <Column
               title="Action"
               key="action"
               render={(_, record) => (
                  <Space size="middle">
                     <Button onClick={() => handleEdit(record)}>Edit</Button>
                     <AiOutlineDelete
                        size={25}
                        onClick={() => handleDelete(record)}
                     >
                        {" "}
                     </AiOutlineDelete>
                  </Space>
               )}
            />
         </Table>
         <Button type="primary" onClick={handleAdd}>
            {" "}
            Add new
         </Button>
         <Modal
            title="Basic Modal"
            open={isModal}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[]}
         >
            <CacheForm onSubmit={handleSubmit} props={formProps} />
         </Modal>
      </div>
   );
};

const CacheForm = ({ onSubmit, props }) => {
   let {authTokens, logoutUser} = useContext(AuthContext)
   async function onFinish(values) {
      console.log("Success:", values);


      let response = await fetch(`${API_URL}`, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
             Authorization: "Bearer " + String(authTokens.access),
         },
         body: JSON.stringify({
            amount: values.amount,
            currency: values.currency,
         }),
      });
      onSubmit(values, props);
   }

   const onFinishFailed = (errorInfo) => {
      console.log("Failed:", errorInfo);
   };

   return (
      <Form
         name="basic"
         labelCol={{ span: 8 }}
         wrapperCol={{ span: 16 }}
         style={{ maxWidth: 600 }}
         // initialValues={{ remember: true }}
         initialValues={props ? props : null}
         onFinish={onFinish}
         onFinishFailed={onFinishFailed}
         autoComplete="off"
      >
         <Form.Item
            label="currency"
            name="currency"
         >
            <Select
               // defaultValue={"RUB"}
               options={[
                  {
                     value: "RUB",
                     label: "Российский рубль",
                  },
                  {
                     value: "BYN",
                     label: "Белорусский рубль",
                  },
                  {
                     value: "KZT",
                     label: "Тенге",
                  },
                  {
                     value: "USD",
                     label: "Доллар",
                  },
                  {
                     value: "EUR",
                     label: "Евро",
                  },
                  {
                     value: "CNY",
                     label: "Юань",
                  },
                  {
                     value: "TRY",
                     label: "Турецкая лира",
                  },
                  {
                     value: "DHS",
                     label: "Дирхам ОЭА",
                  },
               ]}
            ></Select>
         </Form.Item>

         <Form.Item
            label="amount"
            type="number"
            name="amount"
            rules={[
               {
                  type: Number,
                  required: true,
                  message: "Please input your username!",
               },
            ]}
         >
            <Input />
         </Form.Item>

         <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
               Submit
            </Button>
         </Form.Item>
      </Form>
   );
};

export default CacheInvoice;
