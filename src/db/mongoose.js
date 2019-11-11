const mongoose=require('mongoose')

//unlike mongodb we need to put DB name directly to link
mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api',{
    useNewUrlParser:true,
    useCreateIndex:true, 
    useFindAndModify:false //to remove depracation warning
})


