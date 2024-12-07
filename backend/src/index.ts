import express  from 'express';
import cors from "cors"
import axios, { all } from "axios"
import prisma from "./db";
const app=express();

app.use(express.json());

app.use(cors());

const monthmap:Record<string,number>={
  'january': 1,
  'february': 2,
  'march': 3,
  'april': 4,
  'may': 5,
  'june': 6,
  'july': 7,
  'august': 8,
  'september': 9,
  'october': 10,
  'november': 11,
  'december': 12

}

const Convertmonthindex=(month:string):number =>{
    return monthmap[month.toLowerCase()] || 3
}



app.get("/initialize",async(req,res)=>{
   try {
      const api="https://s3.amazonaws.com/roxiler.com/product_transaction.json"

      const response=await axios.get(api);

      const data=response.data;

      await prisma.data.deleteMany({})


      await prisma.data.createMany({
         data:data.map((item:any)=> ({
            id:String(item.id),
            title:item.title,
            description:item.description,
            price:parseFloat(item.price),
            category:item.category,
            sold:item.sold,
            image:item.image,
            dateOfSale:new Date(item.dateOfSale)
         }))
      });

      res.status(200).json({
         message:"the data init "
      })
   } catch (error) {
      res.status(500).json({message:"error in data init "})
   }    
 
})


app.get("/transactions",async (req,res)=>{

    const page=parseInt(req.query.page as string ) || 1 ;
    const perpage=parseInt(req.query.perPage as string) || 10;
    const search=(req.query.search as string) || "" 
    const selectedmonth=(req.query.month as string ) || "march"

   

   const monthind=Convertmonthindex(selectedmonth);
  
    //pagination 
    const skip=(Number(page)-1) * Number(perpage);
    const take=Number(perpage)

   try {
      const transactions=await prisma.data.findMany({
         where:{
            dateOfSale:{
               gte:new Date(new Date().getFullYear(),monthind-1,1 ),
               lte:new Date(new Date().getFullYear(),monthind,1)
            }
            ,OR:[
               {
                  title:{
                     contains:search as string , mode:"insensitive"
                  } 
                  
               },{
                  description:{
                     contains:search as string , mode:"insensitive"
                  }
               },
               {
                  price:{
                     equals:Number(search)
                  }
               }
            ]
         },
         skip,
         take
      })

      res.status(200).json({
         transactions
      })
   } catch (error) {
      
      res.status(500).json({
        message:"trans server not working "
      })
   }
})


app.get("/statistics",async (req,res)=>{
     const month=(req.query.month as string) || "march";
     const monthind=Convertmonthindex(month)

   try {
      const [totalsalesamount,totalsolds,totalnotsolds]=await prisma.$transaction([
         prisma.data.aggregate({
              _sum:{price:true},
            where:{
                sold:true,
                dateOfSale:{
                gte:new Date(new Date().getFullYear(),monthind-1,1),
                 lt:new Date(new Date().getFullYear(),monthind,1)
                }
            }
         })

         ,
         prisma.data.count({
            where:{
               sold:true,
               dateOfSale:{gte:new Date(new Date().getFullYear(),monthind-1,1)
                  ,lt:new Date(new Date().getFullYear(),monthind,1)
               }
            }
         }),
          prisma.data.count({
            where:{
               sold:false,
              dateOfSale:{gte:new Date(new Date().getFullYear(),monthind-1,1)
                  ,lt:new Date(new Date().getFullYear(),monthind,1)
               }
            }
         })
      ])

      res.status(200).json({
         totalsalesamount,
         totalsolds,
         totalnotsolds
      })
   } catch (error) {
       res.status(500).json({messgae:"server error"})
   }


})



app.get("/bar-chart",async (req,res)=>{
       const month=(req.query.month as string) || "march";
     const monthind=Convertmonthindex(month)
   
    const priceRanges=[
       [0 , 100],
        [101,200],
        [201,300],
        [301,400],
        [401,500],
        [501,600],
        [601,700],
        [701,800],
        [801,900],
        [900,Number.MAX_VALUE]
    ]

   try {
      const chart=await Promise.all(
         priceRanges.map(async([max,min])=>{
            const count= await prisma.data.count({
               where:{
                  dateOfSale:{
                    gte:new Date(new Date().getFullYear(),monthind-1,1)
                  },
                  price:{
                     gte:min,
                     lte:max
                  }
               }
            })

            return {range:`${min}- ${max}`,count}
         })
      )

      res.status(200).json({
         chart
      })
    
   } catch (error) {
      res.status(500).json({
         message:"Server error "
      })
   }

})


app.get("/pie-chart",async (req,res)=>{
      const month=(req.query.month as string) || "march";
     const monthind=Convertmonthindex(month)
 

   try {
       const categorie=await prisma.data.groupBy({
         by:["category"],
         _count:{
            category:true
         },
         where:{
            dateOfSale:{
               gte:new Date(new Date().getFullYear(),monthind-1,1),
               
            }
         }
       })

       res.status(200).json({
         categorie
       })
   } catch (error) {
      res.status(500).json({message:"server error"})
   }
   
})



app.get("/combinedata",async (req,res)=>{
     const page=parseInt(req.query.page as string ) || 1 ;
    const perpage=parseInt(req.query.perPage as string) || 10;
    const search=(req.query.search as string) || "" 
    const selectedmonth=(req.query.month as string ) || "march"

   

   const monthind=Convertmonthindex(selectedmonth);


   const skip=(Number(page)-1) *(Number(perpage))
   const take=Number(perpage)
   
    const priceRanges=[
       [0 , 100],
        [101,200],
        [201,300],
        [301,400],
        [401,500],
        [501,600],
        [601,700],
        [701,800],
        [801,900],
        [900,Number.MAX_VALUE]
    ]




   try {
     const [transactions,totaltransactionsales,totalsolds,totalnotsolds,chart,categorie]=await Promise.all([
       
        await prisma.data.findMany({
           where:{
            dateOfSale:{
                 gte:new Date(new Date().getFullYear(),monthind-1,1),
                  lt:new Date(new Date().getFullYear(),monthind,1)
            },OR:[
               {
                  title:{
                     contains:search as string ,mode:"insensitive"
                  }
               }
               ,{
                  description:{
                     contains:search as string ,mode:"insensitive"
                  }
               },
               {
                  price:{
                     equals:Number(search) || undefined
                  }
               }
            ]
           },
           skip,
           take
        })
       ,
      await  prisma.data.aggregate({
            _sum:{price:true},
            where:{
               sold:true,
               dateOfSale:{
                  gte:new Date(new Date().getFullYear(),monthind-1,1),
                  lt:new Date(new Date().getFullYear(),monthind,1)
               }
            }
         }),
            await  prisma.data.count({
         where:{
            sold:true,
            dateOfSale:{
                gte:new Date(new Date().getFullYear(),monthind-1,1),
                  lt:new Date(new Date().getFullYear(),monthind,1)
            }
         }
     }),
         await  prisma.data.count({
         where:{
            sold:false,
            dateOfSale:{
                gte:new Date(new Date().getFullYear(),monthind-1,1),
                  lt:new Date(new Date().getFullYear(),monthind,1)
            }
         }
     }),

     Promise.all(priceRanges.map(async([max,min])=>{
     const count=  await prisma.data.count({
         where:{
            dateOfSale:{
                gte:new Date(new Date().getFullYear(),monthind-1,1),
                  lt:new Date(new Date().getFullYear(),monthind,1)
            },
            price:
            {
               gte:min , lte:max
            }
         }
       })
       return {range:` ${min} - ${max}`,count}
     }))
   ,
   await prisma.data.groupBy({
         by:["category"],
         _count:{
            category:true
         },
         where:{
            dateOfSale:{
               gte:new Date(new Date().getFullYear(),monthind-1,1),
               
            }
         }
       })
     






     ]) 


     res.status(200).json({
      transactions,
      totaltransactionsales,
      totalsolds,
      totalnotsolds,
      chart,
      categorie
     })
   






   } catch (error) {
      res.status(500).json({
         messgae:"server error "
      })
   }
})







app.listen(3000);
