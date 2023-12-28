import { Button, Form, Input, Modal, Space, Table } from "antd";
import React, { useEffect, useState, useContext } from "react";
import AuthContext from '../../context/AuthContext'
import { AiOutlineDelete } from "react-icons/ai";

const API_URL = "http://localhost:8000/api";
const BANK_API_URL = API_URL + "/bank-account/";

const { Column, ColumnGroup } = Table;


const BankAccountPage = () => {
    let {authTokens, logoutUser} = useContext(AuthContext)
   const [tableData, setTableData] = useState([]);

   useEffect(() => {
      async function getData() {
         let response = await fetch(`${BANK_API_URL}`, {
            method: "GET",
            headers: {
               "Content-Type": "application/json",
               Authorization: "Bearer " + String(authTokens.access),
            },
         });
         let data = await response.json().then((data) => {
            data.forEach((el) => {
               setTableData([
                  ...tableData,
                  {
                     id: el.id,
                     bank: el.bank.bank.bank_name,
                  },
               ]);
            });
         });
         console.log(data);
      }
      getData()
   }, []);

   const [isModal, setIsModal] = useState(false);

   const handleOk = () => {
      setIsModal(false);
   };

   const handleCancel = () => {
      setIsModal(false);
   };
   async function handleDelete(id) {
      let response = await fetch(`${BANK_API_URL}/${id}`, {
         method: "DELETE",
         headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
         },
      });
      setTableData(
         tableData.filter((el) => {
            return el.id !== id;
         })
      );
   }

   function handleAdd(value) {
      setTableData([...tableData, { id: 123, bank: value }]);
   }

   return (
      <div>
         <Table dataSource={tableData} key={crypto.randomUUID()}>
            <Column title="bank" dataIndex="bank" key="bank" />
            <Column
               title="Action"
               key="action"
               render={(_, record) => (
                  <Space size="middle">
                     <AiOutlineDelete
                        size={25}
                        onClick={() => handleDelete(record.id)}
                     >
                        {" "}
                     </AiOutlineDelete>
                  </Space>
               )}
            />
         </Table>
         <Button type="primary" onClick={() => setIsModal(true)}>
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
            <CashForm onSubmit={handleAdd} />
         </Modal>
      </div>
   );
};

const CashForm = ({ onSubmit }) => {
   async function onFinish(values) {
      console.log("Success:", values);
      onSubmit(values.bank);
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
         onFinish={onFinish}
         onFinishFailed={onFinishFailed}
         autoComplete="off"
      >
         <Form.Item label="bank" name="bank">
            <Input />
         </Form.Item>
         <Button type="primary" htmlType="submit">
            Confirm
         </Button>
      </Form>
   );
};

export default BankAccountPage;
