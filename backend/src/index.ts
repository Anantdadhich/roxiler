import express  from 'express';
import cors from "cors"
import axios from "axios"
import prisma from "./db";
const app=express();

app.use(express.json());

app.use(cors());

const monthsmap:Record<string,number> ={
   january:1,
   february:2,
   march:3,
   april:4,
   may:5,
   june:6,
   july:7,
   august:8,
   september:9,
   october:10,
   november:11,
   december:12
}


const Monthtolowercase=(month:string) :number |undefined =>
   monthsmap[month.toLowerCase()] ||undefined



app.get("/initalise",async (req,res)=>{
try {

 const apiurl="https://s3.amazonaws.com/roxiler.com/product_transaction.json"
       



     const response=await axios.get(apiurl);
     const data=response.data;
   
     await prisma.data.deleteMany({})
     
     await prisma.data.createMany({
      data
     })

     res.status(200).json({
        message:"init"
     })
} catch (error) {
  res.status(500).json({error:"Failed to initalise the data "})
}
})

//@ts-ignore
app.get("/transactions",async (req,res) =>{

 const {month,page=1,perpage=10,search=" "} =req.query;

 if(!month) {
   return res.status(400).json("Month is Required");
 }

 const numericmonth=Monthtolowercase(month as string) ;


 if(!numericmonth) {
   return res.status(400).json({
      messaage:"error fetching month"
   })
 }
   //for pagination
 const skip=(Number(page)-1)*Number(perpage);
 const take=Number(perpage);


 try {
   const transactions=await prisma.data.findMany({
      where:{
         dateOfSale:{
            gte:new Date (new Date().getFullYear(),numericmonth-1,1),
            lt:new Date (new Date().getFullYear(),numericmonth,1)
         },OR:[
            {title:{
               contains:search as string ,mode:"insensitive"
            }},
            {description:{
               contains:search as string ,mode:"insensitive"
            }},
            {price:{equals:Number(search)}}
         ]
      },
      skip,
      take
      
   });

      res.status(200).json({
         page,
         perpage,
         transactions
      })
 } catch (error) {
     res.status(500).json({
      message:"server error "
     })
 }

})
//@ts-ignore
app.get("/statistics",async (req,res)=>{
  const {month} =req.query;
  
  if(!month){
   return res.status(400).json({message:"invalid"})
  }

  const monthinnum=Monthtolowercase(month as string);
   
  if(!monthinnum) {
   return res.status(400).json({message:"invalid"})
  }

  try {
   const [transactionamount,totalsold,totalnotsolds]=await prisma.$transaction([
      prisma.data.aggregate({
         _sum:{price:true},
         where:{
            sold:true,
            dateOfSale:{
               gte:new Date(new Date().getFullYear(),monthinnum-1,1)
            }
         }
      }),
      prisma.data.count({
         where:{
            sold:true,dateOfSale:{
               gte:new Date(new Date().getFullYear(),monthinnum-1,1)
            }
         }
      }),
      prisma.data.count({
         where:{
            sold:false,
            dateOfSale:{
               gte:new Date(new Date().getFullYear(),monthinnum-1,1)
            }
         }
      })
   ])


   res.status(200).json({
      transactionamount,
      totalsold,
      totalnotsolds
   })
  } catch (error) {
      res.status(500).json({
         message:"Server Error"
      })
  }
  
})

//@ts-ignore
app.get("/barchartdata",async (req,res)=>{
  const {month}=req.query;
  if(!month){
   return res.status(400).json({
      messgae:"invalid month"
   })
  }

  const monthinnum=Monthtolowercase(month as string);

  if(!monthinnum){
   return res.status(400).json({
       messgae:"invalid month"
   })
  }


  const priceRange=[
    [0,100],
    [101,200],
    [201,300],
    [301,400],
    [401,500],
    [501,600],
    [601,700],
    [701,800],
    [801,900],
    [901,Number.MAX_VALUE]


  ];


  try {
    const data=await Promise.all(
      priceRange.map(async ([max,min])=>{
         const count=await prisma.data.count({
            where:{
               dateOfSale:{
                  gte:new Date(new Date().getFullYear(),monthinnum-1,1)
               },
               price:{
                  gte:min ,lte:max
               }
            }
         })
         return {range:`${min} - ${max}`,count}
      })
    )
    res.status(200).json({data})
  } catch (error) {
     res.status(500).json({
      message:"invalid server"
     })
  }
})

 //@ts-ignore
app.get("/piechartdata",async (req,res)=>{
  const {month}=req.query;
  if(!month){
   return res.status(400).json({
      messgae:"invalid month"
   })
  }

  const monthinnum=Monthtolowercase(month as string);

  if(!monthinnum){
   return res.status(400).json({
       messgae:"invalid month"
   })
  }


  try {
    const categories=await prisma.data.groupBy({
      by:"category",
      _count:{
         category:true
      },
      where:{
         dateOfSale:new Date(new Date().getFullYear(),monthinnum-1,1)
      }
    })

    res.status(200).json({categories})
  } catch (error) {
      res.status(500).json({
         message:"invlaid "
      })
  }
})
 
//@ts-ignore
app.get("/combined-data",async (req,res)=>{
 try {
   const month=(req.query.month as string || "march").toLowerCase();

 const search=(req.query.search as string || "") ;
 const page =parseInt(req.query.page as string) ||1 ;
 const perpage=parseInt(req.query.perpage as string ) || 10;



  if(!month){
   return res.status(400).json({
      messgae:"invalid month"
   })
  }

  const monthinnum=Monthtolowercase(month as string);

  if(!monthinnum){
   return res.status(400).json({
       messgae:"invalid month"
   })
  }
   
  const startmonth=new Date(new Date().getFullYear(),monthinnum -1,1);
  const endmonth=new Date(new Date().getFullYear(),monthinnum,1);

   const [statistics,barchaart,piechart]=await Promise.all([
      fetchStats(),
      fetchBardata(),
      fetchPiedata()
   ])

   const combinedtransactions={
     statistics,barchaart,piechart
   };

   res.status(200).json({
      combinedtransactions
   })

 } catch (error) {
   res.status(500).json({message:"invalid server "})
 }


})


async function fetchStats(){
   
}

async function fetchBardata(){


}

async function fetchPiedata(){

}
app.listen(3000);
