const mongoose=require('mongoose');

const medicinesSchema =mongoose.Schema({

   
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    id_company:{
    type:mongoose.Schema.Types.ObjectId,
        required:true   
    },
    time_start:{
        type:Number,
        required:true
    },
    time_end:{
        type:Number,
        required:true
    },
    active_substance:{
        type:String,
        required:true
    },
    // imgePath:{
    //     type:String,
    //     required:true
    // },


});
    module.exports=mongoose.model(' medicines',medicinesSchema);