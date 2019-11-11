require('../src/db/mongoose')
const Task=require('../src/models/tasks')


// Task.findByIdAndDelete('5dbaa2e767a95c0cf6379b06').then(()=>{
//     console.log('task deleted')
//     return Task.countDocuments({completed:false})
// }).then((result)=>{
//     console.log(result)
// }).catch((e)=>{
//     console.log(e)
// })

const deleteTaskAndCount=async(id)=>{
    const task=await Task.findByIdAndDelete(id)
    const count=await Task.countDocuments({completed:false})
    return count
}

deleteTaskAndCount('5dbd9b4e6df86419325a0421').then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log('could not delete task ')
})