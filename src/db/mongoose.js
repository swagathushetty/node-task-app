const mongoose=require('mongoose')

//unlike mongodb we need to put DB name directly to link
mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useCreateIndex:true, 
    useFindAndModify:false, //to remove depracation warning
})


