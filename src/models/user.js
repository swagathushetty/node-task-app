const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('password cant contain password')
            }
        }
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){ //validation package
               throw new Error('Email is invalid') 
            }
        }
    },
    age:{
        type:Number,
        default:0,
        //ES6 method defination syntax
        validate(value){
            if(value<0){
                throw new Error('age must be +ve number')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

userSchema.methods.generateAuthToken=async function(){
    const user=this

    //user._id is a object
    const token=jwt.sign({_id:user._id.toString()},'thisismynewcourse')
    user.tokens=user.tokens.concat({token:token})
    await user.save()

    return token 
}


//method to verify identity
userSchema.statics.findByCredentials=async(email,password)=>{
    const user=await User.findOne({email:email})

    if(!user){
        throw new Error('unable to login')
    }
    const isMatch=await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error('unable to login')
    }
    return user
}

//middleware to hash password before saving
//pre means before user is saved
//1st arg is name of the event
//2nd is the function to run.dont use arrow as they dont have this binding
//next moves the program foward.if we dont use it the function will continue to run
userSchema.pre('save',async function(next){
    const user=this
    
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }
    
    next()
})

//creating model
const User=mongoose.model('User',userSchema)

module.exports=User