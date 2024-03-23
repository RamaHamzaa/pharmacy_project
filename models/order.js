const mongoose=require('mongoose');

const orderSchema =mongoose.Schema({

id_company:{
     type:mongoose.Schema.Types.ObjectId,
     required:true
    },
    id_pharmacist:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
       },
       information:{
        type:Array,
        required:true
       }
    
});
module.exports=mongoose.model('order',orderSchema);