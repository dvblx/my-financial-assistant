import { Space, Table } from "antd";
import Column from "antd/es/table/Column";
import React, { useEffect, useState, useContext } from "react";
import { AiFillPlusCircle } from "react-icons/ai";
import { AiFillMinusCircle } from "react-icons/ai";
import AuthContext from '../../context/AuthContext'

const API_URL = 'http://localhost:8000/api/operation/';





/*STORE_PURCHASE = "SP"
    TRANSPORT_PAYMENT = "TP"
    TELECOM_AND_INTERNET_CHARGES = "TI"
    CAFES_AND_RESTAURANTS = "CR"
    CARD_TRANSFERS = "CT"
    ENTERTAINMENTS = "EN"
    BEAUTY_AND_HEALTH = "BH"
    CLOTHES_AND_SHOES = "CS"
    HOUSEHOLD_GOODS = "HG"
    FUEL = "FU"
    CASHBACK = "CB"
    SALARY = "SA"
    SOCIAL_PAYMENT = "SP"
    SCHOLARSHIP = "SC"
    OTHER = "OT"
    OPERATIONS = [
        (STORE_PURCHASE, "Покупки в магазинах"),
        (TRANSPORT_PAYMENT, "Проезд в общественном транспорте"),
        (TELECOM_AND_INTERNET_CHARGES, "Связь и интернет"),
        (CAFES_AND_RESTAURANTS, "Рестораны и кафе"),
        (CARD_TRANSFERS, "Переводы"),
        (ENTERTAINMENTS, "Развлечения"),
        (FUEL, "Топливо"),
        (CASHBACK, "Кэшбэк"),
        (SALARY, "Зарплата"),
        (SCHOLARSHIP, "Стипендия"),
        (SOCIAL_PAYMENT, "Социальные выплаты"),
        (OTHER, "Другие траты"),
    ]*/

function typeTransformer(code) {
   switch (code) {
      case "SP": // if (x === 'value1')
         return "Покупки в магазинах";

      case "TP":
         return "Проезд в общественном транспорте";

      case "TI":
         return "Связь и интернет";

      case "CR":
         return "Рестораны и кафе";

      case "CT":
         return "Переводы";

      case "EN":
         return "Развлечения";

      case "BH":
         return "";

      case "CS":
         return "";

      case "HG":
         return "";

      case "FU":
         return "Топливо";

      case "CB":
         return "Кэшбэк";

      case "SA":
         return "Зарплата";

      case "SP":
         return "Социальные выплаты";

      default:
         return "OTHER";
   }
}

const Operations = () => {
    let {authTokens, logoutUser} = useContext(AuthContext)
   const [tableData, setTableData] =useState([])

   useEffect(()=> {
      async function getData() {
         let response = await fetch(`${API_URL}`, {
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
                     amount: el.amount,
                     type: el.type_of_spend,
                     profit: el.profit,
                  },
               ]);
            });
         });
         console.log(data);
      }
      getData()
   }, [])

   return (
      <div>
         <Table dataSource={tableData} key={crypto.randomUUID()}>
            <Column
               title="Тип операции"
               dataIndex="type"
               key="type"
               render={(_, record) => typeTransformer(record.type)}
            />
            <Column title="Сумма" dataIndex="amount" key="amount" />
            {/* <Column title="Изменение баланса" dataIndex="profit" key="profit" /> */}
            <Column
               title="Изменение баланса"
               key="action"
               render={(_, record) => (
                  <Space size="middle">
                     {record.profit ? (
                        <AiFillPlusCircle size={35} color="green" />
                     ) : (
                        <AiFillMinusCircle size={35} color="orange" />
                     )}
                  </Space>
               )}
            />
         </Table>
      </div>
   );
};

export default Operations;
