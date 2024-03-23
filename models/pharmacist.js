const mongoose=require('mongoose');

const pharmacistSchema =mongoose.Schema({

    
    name:{
        type:String,
        required:true
    },
    location_x:{
        type:Number,
        required:true
    },
    location_y:{
        type:Number,
        required:true
    },
    dayes:{
        type:Array,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    start_time:{
        type:Number,
        required:true
    },
    end_time:{
        type:Number,
        required:true
    },
    // imgePath:{
    //     type:String,
    //     required:true
    // },
    is_open:{
        type:Boolean,
        required:true
    },
   
});

module.exports=mongoose.model('pharmacist',pharmacistSchema);