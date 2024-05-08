const express=require("express");
const fs=require("fs");
const ExcelJS=require('exceljs');
const path=require('path')
const multer=require('multer')
const { randomInt } = require("crypto");
const XLSX=require('xlsx')
const app=express();

const storage=multer.diskStorage({
    
destination:function(req,file,cb)
{
    cb(null,path.join(__dirname,'uploads'));
},
filename:function(req,file,cb)
{
    cb(null,file.originalname);
}
});

const upload=multer({storage:storage}).single('file');

app.use(express.json())
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
    ["header-txtrecord","fqdn*","text*","comment","view",
    "EA-Implementer","EA-Req_Date","EA-Req_Ticket","EA-Requester"],
    ["header-mxrecord","fqdn*","mx*","priority*","comment","ttl","view",
    "EA-Implementer","EA-Req_Date","EA-Req_Ticket","EA-Requester"],
    ["header-srvrecord","fqdn*","port*","priority*","target*","weight*","comment","ttl","view",
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

function  readRowsFromFile(filePath,excel){
    try{
        //text file
        
        if(excel)
        {
        const workbook=XLSX.readFile(filePath)
       const sheetName=workbook.SheetNames[0];
       const worksheet=workbook.Sheets[sheetName];
       const excelData=XLSX.utils.sheet_to_json(worksheet,{header:1});
    //    console.log(excelData)
       return excelData;
        }
        const data=fs.readFileSync(filePath,'utf8');
        
       //excel file
       
    //    console.log(excelData)
    
        const rows=data.split('\n').map(row=>removeSpacesExceptQuote(row));
        const list=[];
        
        rows.map((data)=>{
            const row=data.split(',')
            list.push(row)
        })
        
        return list;
    }catch(err)
    {
        console.log("Error reading file");
        return []
    }
}

function isSpecialCharacterOnly(str)
{
    return /^[!@#$%^&*()_+\-;=\[\]{};':"\\|,.<>\/?]*$/.test(str)
}
function InsertRecords(rows,type_num,fqdn_num,value_num,worksheet,zone,append_zone)
{
    let arr=[]
    
    // console.log(rows,"pro1")
    let maxi=Math.max(type_num,fqdn_num,value_num)
    let arecord=0,cnamerecord=0,mxrecord=0,txtrecord=0,srvrecord=0
    rows.map((data)=>{
        try{
        
        if(data.length>=maxi+1){
        let list=[]
        let r_type=data[type_num];
        let lower=r_type.replace(/\s+/g,'').toLowerCase()
        
        // console.log(lower,"\n")
        if(lower=="a" || lower=="arecord")
        {
        let flag=0
        list.push("arecord");
       arecord=1;
        //value
        let value=data[value_num];
        if(value.charAt(value.length-1)=='.')
        value=value.slice(0,-1);
        list.push(value);

        

        //fqdn
        let fqdn=data[fqdn_num];
        if(fqdn===undefined || isSpecialCharacterOnly(fqdn) || fqdn.length===0){
           
        fqdn=zone;
        }
        if(fqdn.charAt(fqdn.length-1)=='.')
        fqdn=fqdn.slice(0,-1);
        if(!fqdn.includes(zone))
        fqdn=fqdn.concat(".",zone)
        list.push(fqdn);

        }
        if(lower=="cname"|| lower=="cnamerecord")
        {
         let flag=0;   
        list.push("cnamerecord");
        cnamerecord=1
        //value
        let value=data[value_num];
        if(value.charAt(value.length-1)=='.')
        value=value.slice(0,-1);
        if(value===undefined || isSpecialCharacterOnly(value) || value.length===0){
            value=zone
             }
        list.push(value);

        //fqdn
        let fqdn=data[fqdn_num];
        if(fqdn===undefined || isSpecialCharacterOnly(fqdn) || fqdn.length===0){
              
            fqdn=zone;
            }
        if(fqdn.charAt(fqdn.length-1)=='.')
        fqdn=fqdn.slice(0,-1);
        if(!fqdn.includes(zone))
        fqdn=fqdn.concat(".",zone)
        
        list.push(fqdn);
        }
        if(lower=="txt" || lower=="txtrecord") 
        {
        let flag=0;
        list.push("txtrecord");
        txtrecord=1    
         //fqdn
         let fqdn=data[fqdn_num];
         if(fqdn===undefined || isSpecialCharacterOnly(fqdn) || fqdn.length===0){  
        fqdn=zone;
        }
         if(fqdn.charAt(fqdn.length-1)=='.')
         fqdn=fqdn.slice(0,-1);
         if(!fqdn.includes(zone))
         fqdn=fqdn.concat(".",zone)
         list.push(fqdn);

        //value
        let value=data[value_num];
        if(value.charAt(value.length-1)=='.')
        value=value.slice(0,-1);

        if(value===undefined || isSpecialCharacterOnly(value) || value.length===0){
           value=zone
            }
        list.push(value);

       
        }
        if(lower=="mx" || lower=="mxrecord")
        {
        let flag=0;
        list.push("mxrecord");
        mxrecord=1
        //fqdn
         let fqdn=data[fqdn_num];
         if(fqdn===undefined || isSpecialCharacterOnly(fqdn) || fqdn.length===0){
            
            fqdn=zone;
            }
         if(fqdn.charAt(fqdn.length-1)=='.')
         fqdn=fqdn.slice(0,-1);
         if(!fqdn.includes(zone))
         fqdn=fqdn.concat(".",zone)
         list.push(fqdn);
        
        //value
        let value=data[value_num+1];
        if(value.charAt(value.length-1)=='.')
        value=value.slice(0,-1);
        if(value===undefined || isSpecialCharacterOnly(value) || value.length===0){
            value=zone
             }
        list.push(value);

        list.push(data[value_num]);
        }
        if(lower=="srv" || lower=="srvrecord")
        {
        let flag=0;
        list.push("srvrecord");
        srvrecord=1
        //fqdn
         let fqdn=data[fqdn_num];
         if(fqdn===undefined || isSpecialCharacterOnly(fqdn) || fqdn.length===0){
            
            fqdn=zone;
            }
         if(fqdn.charAt(fqdn.length-1)=='.')
         fqdn=fqdn.slice(0,-1);
         if(!fqdn.includes(zone))
         fqdn=fqdn.concat(".",zone)
         list.push(fqdn);
        
        //value
        const isNumeric = (string) => Number.isFinite(+string)
        let port=data[value_num],priority=data[value_num+1],target=data[value_num+2],weight=data[value_num+3];
        // console.log(port,priority,target,weight)
        if(port==undefined || !isNumeric(port))
        port="Not a Number"
        if(priority==undefined || !isNumeric(priority))
        priority="Not a Number"
        if(target===undefined || isSpecialCharacterOnly(target) || target.length===0)
        target=zone;
        if(weight==undefined || !isNumeric(weight))
        weight="Not a Number"
        
        list.push(port);
        list.push(priority);
        list.push(target);
        list.push(weight);
        }
        if(lower=="caa")
        {
        list.push("header-caarecord");
        }
        if(list.length>=3)
        arr.push(list)
        }
    }
    catch(err)
    {
        console.log("Error reading file",err,data);
    }
    })
    let headerdata=[]
    if(arecord)
    headerdata.push(data[2])
    if(cnamerecord)
    headerdata.push(data[3])
    if(txtrecord)
    headerdata.push(data[4])
    if(mxrecord)
    headerdata.push(data[5])
    if(srvrecord)
    headerdata.push(data[6])
    // console.log(arr)
    worksheet.addRows(headerdata)
    worksheet.addRows(arr)

// }
// catch(err)
//     {
//         console.log("Error reading file");
//         return []
//     }
}

function removeSpacesExceptQuote(data)
{
    let withinQuotes=false;
    let result='';
    // console.log(data);
    const segments=data.split('"')
    // console.log(segments)
    for(let i=0;i<segments.length;i++)
    {
        if(i%2==0)
        result+=segments[i].replace(/\s+/g,',')
        else
        result+=`"${segments[i]}"`
        
    }
    return result
}
app.get('/',(req,res)=>{
    console.log("pro")
    res.send("pro")
})

app.post('/abc',(req,res)=>{
    console.log("hello")
    res.send("helow")
})
app.post('/file',(req,res)=>{
    try{
   
    let filePath=null;
    upload(req,res,function(err){
        if(err)
        {
            console.log("Error occuered while saving file")
            return res.status(500).send('An error occured')
        }
        // console.log(__dirname,req.file.originalname)
    filePath=path.join(__dirname,'uploads',req.file.originalname)
    const {FQDN,type,value,zone,append_zone,excel}=req.body;
     const workbook= new ExcelJS.Workbook();
    const worksheet=workbook.addWorksheet('Sheet1');
    const type_num=Number(type),fqdn_num=Number(FQDN),value_num=Number(value);
    console.log(filePath,FQDN,type,value,zone,excel)
    const rows=readRowsFromFile(filePath,excel);
    // worksheet.addRows(data)
    InsertRecords(rows,type_num,fqdn_num,value_num,worksheet,zone,append_zone)
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
            // console.log(rows)
        //    res.write(htmldata);
        console.log("Excel File created")
            res.status(200).send("Created Successfully")
        }).catch(function(error){
            // res.json(rows);
            console.log(error);
        })
    })   
}
catch(err)
{
    console.log(err)
    res.send("Some error occured")
}
        // console.log(typeof(type),type)
   
})


app.listen(8080,()=>{
    console.log("Server lisistening at",8080);
})