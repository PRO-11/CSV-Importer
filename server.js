const express=require("express");
const fs=require("fs");
const ExcelJS=require('exceljs');
const { randomInt } = require("crypto");

const app=express();




// const worksheet=workbook.addWorksheet('Sheet1');

const data=[
    ["header-authzone","fqdn*","zone_format*","comment","ns_group","soa_email","soa_mnames","view","zone_type",
    "EA-Implementer","EA-Req_Date","EA-Req_Ticket","EA-Requester"],
    ["header-delegatedzone","fqdn*","zone_format*","comment","delegate_to","view",
    "EA-Implementer","EA-Req_Date","EA-Req_Ticket","EA-Requester"],
    ["header-arecord","address*","fqdn*","comment","ttl","view",
    "EA-Implementer","EA-Req_Date","EA-Req_Ticket","EA-Requester"],
    ["header-cnamerecord","canonical_name*","fqdn*","view",
    "EA-Implementer","EA-Req_Date","EA-Req_Ticket","EA-Requester"],
    ["header-txtrecord","text*","comment","view",
    "EA-Implementer","EA-Req_Date","EA-Req_Ticket","EA-Requester"],
    ["header-mxrecord","FQDN","mx*","priority*","comment","ttl","view",
    "EA-Implementer","EA-Req_Date","EA-Req_Ticket","EA-Requester"],
    ["header-srvrecord","FQDN","port*","priority*","target*","weight*","comment","ttl","view",
    "EA-Implementer","EA-Req_Date","EA-Req_Ticket","EA-Requester"],
    ["header-caarecord","ca_flag*","ca_tag*","ca_value*","fqdn*","name","ttl","view",
    "EA-Implementer","EA-Req_Date","EA-Req_Ticket","EA-Requester"],
]

const htmldata=`<!DOCTYPE html>
<html>
<body>

<h1>My First Heading</h1>
<p>My first paragraph.</p>

</body>
</html>`

function  readRowsFromFile(filePath){
    try{
        const data=fs.readFileSync(filePath,'utf8');
        const rows=data.split('\n').map(row=>row.replace(/\s/g,','));
        const list=[];
        rows.map((data)=>{
            data.replace()
        })
        rows.map((data)=>{
            const row=data.split(',')
            list.push(row)
        })
        
        return list;
    }catch(err)
    {
        //console.log("Error reading file");
        return []
    }
}

function InsertRecords(rows,type_num,fqdn_num,value_num,worksheet)
{
    let arr=[]
    try{
    rows.map((data)=>{
        let list=[]
        let r_type=data[type_num];
        const lower=r_type.toLowerCase()
        if(lower=="a")
        {
        list.push("header-arecord");
        list.push(data[value_num]);
        list.push(data[fqdn_num]);
        }
        if(lower=="cname")
        {
        list.push("header-cnamerecord");
        list.push(data[value_num]);
        list.push(data[fqdn_num]);
        }
        if(lower=="txt")
        {
        list.push("header-txtrecord");
        list.push(data[fqdn_num]);
        list.push(data[value_num]);
        }
        if(lower=="mx")
        {
        list.push("header-mxrecord");
        list.push(data[fqdn_num]);
        list.push(data[value_num+1]);
        list.push(data[value_num]);
        }
        if(lower=="srv")
        {
        list.push("header-srvrecord");
        }
        if(lower=="caa")
        {
        list.push("header-caarecord");
        }
        if(list.length>=3)
        arr.push(list)
    })
    //console.log(arr)
    worksheet.addRows(arr)
}
catch(err)
    {
        //console.log("Error reading file");
        return []
    }
}

app.get('/file',(req,res)=>{
    const workbook= new ExcelJS.Workbook();
    const worksheet=workbook.addWorksheet('Sheet1');
    const {filePath,FQDN,type,value,zone}=req.query;
    //console.log(filePath)
    const type_num=Number(type),fqdn_num=Number(FQDN),value_num=Number(value);
    const rows=readRowsFromFile(filePath);
    worksheet.addRows(data)
    InsertRecords(rows,type_num,fqdn_num,value_num,worksheet)
    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=" + `${zone}.xlsx`,
        "data"
      );
         workbook.xlsx.write(res).then(function(){
            //console.log(rows)
        //    res.write(htmldata);
            res.end()
            //console.log("Excel File created")
        }).catch(function(error){
            // res.json(rows);
            //console.log("Error Occured");
        })
        // //console.log(typeof(type),type)
   
})
app.get('/',(req,res)=>{
    res.end("pro")
})

app.listen(8080,()=>{
    //console.log("Server lisistening at",8080);
})