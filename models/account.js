const mongoose=require('mongoose');

const accountSchema =mongoose.Schema({

   
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    id_profiel:{
        type:mongoose.Schema.Types.ObjectId,
        required:true   
    },
    type:{
        type:Number,
        required:true
    }

}
);
    module.exports=mongoose.model('account',accountSchema);