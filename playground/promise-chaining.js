require('../src/db/mongoose')
const User=require('../src/models/user')

//update user age to 1
// User.findByIdAndUpdate('5dbc327ad84da015be278ea1',{age:1}).then((user)=>{
//     console.log(user)
//     return User.countDocuments({age:1})
// }).then((result)=>{
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })

const updateAgeandCount=async(id,age)=>{
    const user=await User.findByIdAndUpdate(id,{age:age})
    const count=await User.countDocuments({age:age})
    return count
}

updateAgeandCount('5dbc327ad84da015be278ea1',2).then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})
