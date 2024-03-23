var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const pharmacist = require("../models/pharmacist");
const account = require('../models/account');
const medicines = require("../models/medicines");
const company = require("../models/company");
const order = require("../models/order");

/* GET users listing. */

router.post('/signup', function(req, res, next) {
  var data = req.body
  account.find({email : data.email}).then(result => {
    if(result.length > 0){
      res.status(200).send({
        massage : 'Account already Exiting'
      })
    }else{
      var type = data.type
      if(type == 1){
        const newpharmacist = new pharmacist({
          name : data.name ,
          location_x : data.location_x,
          location_y : data.location_y ,
          dayes : data.dayes,
          phone : data.phone ,
          start_time : data.start_time ,
          end_time : data.end_time,
          // imgePath:data.imgePath,
          is_open : data.is_open 
          
        })
        newpharmacist.save().then(async result => {
          salt = bcrypt.genSaltSync(10)
          cryptedPassword = await bcrypt.hashSync(data.password , salt)
          const newAccount = new account({
            email : data.email ,
            password : cryptedPassword , 
            type : type ,
            id_profiel : result._id
          })
          newAccount.save().then(result => {
            res.status(200).send({
              message : 'Account already Created' ,
              id : result._id
            })
          }).catch(err => {
            res.status(404).send({message : err})
          })
        }).catch(err => {
          res.status(404).send({message : err})
        })

      }else if(type == 2){
        const newcompany = new company({
          name : data.name ,
          location_x : data.location_x,
          location_y : data.location_y ,
          dayes : data.dayes,
          phone : data.phone ,
          start_time : data.start_time ,
          end_time : data.end_time,
          // imgePath:data.imgePath,
          is_open : data.is_open 
          
        })
        newcompany.save().then(async result => {
          salt = bcrypt.genSaltSync(10)
          cryptedPassword = await bcrypt.hashSync(data.password , salt)
          const newAccount = new account({
            email : data.email ,
            password : cryptedPassword , 
            type : type ,
            id_profiel : result._id
          })
          newAccount.save().then(result => {
            res.status(200).send({
              message : 'Account already Created' ,
              id : result._id
            })
          }).catch(err => {
            res.status(404).send({message : err})
          })
        }).catch(err => {
          res.status(404).send({message : err})
        })
      }
    }
  }).catch(err => {
    res.status(404).send({message : err})
  })
});

router.get('/login', function(req, res, next) {
  var data = req.query
  account.findOne({email : data.email}).then(async result => {
    if(result){
      isMatch = await bcrypt.compare(data.password , result.password)
      console.log(isMatch)
      if(isMatch){
        payload = {
          _id : result._id ,
          email : result.email ,
          type : result.type
        }
        var token = jwt.sign(payload,"pharmacySystem2023")
        console.log(token),
        res.status(200).send({
          id : result._id ,
          token : token
        })
      }else{
        res.status(200).send({message : "The Password or Email is incorrect"})
      }
    }else{
      res.status(200).send({message : "The Password or Email is incorrect"})
    }
  }).catch(err => {
    res.status(404).send({message : err})
  })
});

router.patch('/password', async function(req, res, next) {
  var data = req.body
  salt = bcrypt.genSaltSync(10)
  cryptedPassword = await bcrypt.hashSync(data.password , salt)
  account.findOneAndUpdate({email : data.email},{password : cryptedPassword}).then(result => {
    if(result){
      console.log(result)
      res.status(200).send({
      id : result._id ,
      message : "Password already Updating"
    })
    }else{
      res.status(200).send({message : "Email is not Exiting"})
    }
  }).catch(err => {
    res.status(404).send({message : err})
  })
});


router.patch('/profile', async function(req, res, next) {
  var data = req.body
  account.findByIdAndUpdate({_id : data.id},{email : data.email}).then(result => {
    if(result){
      console.log(result)
      if(data.type == 1){
        pharmacist.findByIdAndUpdate(result.id_profiel , {
          name : data.name ,
          location_x : data.location_x,
          location_y : data.location_y ,
          dayes : data.dayes,
          phone : data.phone ,
          start_time : data.start_time ,
          end_time : data.end_time,
          // imgePath:data.imgePath,
          is_open : data.is_open 
        }).then(result => {
          
          if(result){
            console.log(result)
            res.status(200).send({
            id : result._id ,
            message : "Profile already Updating"
          })
          }else{
            res.status(200).send({message : "Updating Profile is not completed"})
          }
        }).catch(err => {
          res.status(404).send({message : err})
        })
      }else if(data.type == 2){
        company.findByIdAndUpdate(result.id_profiel, {
          name : data.name ,
          location_x : data.location_x,
          location_y : data.location_y ,
          dayes : data.dayes,
          phone : data.phone ,
          start_time : data.start_time ,
          end_time : data.end_time,
          // imgePath:data.imgePath,
          is_open : data.is_open 
        }).then(result => {
          if(result){
            res.status(200).send({
            id : result._id ,
            message : "Profile already Updating"
          })
          }else{
            res.status(200).send({message : "Updating Profile is not completed"})
          }
        }).catch(err => {
          res.status(404).send({message : err})
        })
      }
    }else{
      res.status(200).send({message : "The Account is not founded"})
    }
  }).catch(err => {
    res.status(404).send({message : err})
  })
})


router.delete('/', async function(req, res, next) {
  var data = req.query
  account.findOne({email : data.email}).then(async result => {
    if(result){
      isMatch = await bcrypt.compare(data.password , result.password)
      console.log(isMatch)
      if(isMatch){
        account.findByIdAndDelete(result._id).then(result => {
          if(result.type == 1){
            pharmacist.findByIdAndDelete(result.id_profiel).then(result => {
              if(result){
                res.status(200).send({message : "The account has been completely deleted"})
              }else{
                res.status(200).send({message : "The account has not been completely deleted"})
              }
            }).catch(err => {
              res.status(404).send({message : err})
            })
          }else if(result.type == 2){
            company.findByIdAndDelete(result.id_profiel).then(result => {
              if(result){
                res.status(200).send({message : "The account has been completely deleted"})
              }else{
                res.status(200).send({message : "The account has not been completely deleted"})
              }
            }).catch(err => {
              res.status(404).send({message : err})
            })
          }
        }).catch(err => {
          res.status(404).send({message : err})
        })
      }else{
        res.status(200).send({message : "The Password or Email is incorrect"})
      }
    }else{
      res.status(200).send({message : "The Password or Email is incorrect"})
    }
  }).catch(err => {
    res.status(404).send({message : err})
  })
});


router.get('/account', async function(req, res, next) {
  var id = req.query.id
  account.findOne({_id : id}).then(user => {
    var type = user.type
    if(type == 1){
      console.log(user)
      pharmacist.findOne({_id : user.id_profiel}).select('-__v').then(result => {
        if(result){
          res.status(200).send({
            id : user._id,
            email : user.email,
            password : user.password,
            profile : result
          })
        }else{
          res.status(200).send({message : "The User is not founded"})
        }
      }).catch(err => {
        res.status(404).send({message : err})
      })
    }else if(type == 2){
      company.findOne({_id : user.id_profielh}).select('-__v').then(result => {
        if(result){
          res.status(200).send({
            id : user._id,
            email : user.email,
            password : user.password,
            profile : result
          })
        }else{
          res.status(200).send({message : "The User is not founded"})
        }
      }).catch(err => {
        res.status(404).send({message : err})
      })
    }
  }).catch(err => {
    res.status(404).send({message : err})
  })
})

router.get('/profile', async function(req, res, next) {
  var id = req.query.id
  var type = req.query.type
  if(type == 1){
    pharmacist.findOne({_id : id}).select('_id name phone location_x location_y  is_open start_time end_time dayes').then(result => {
      if(result){
        res.status(200).send(result)
      }else{
        res.status(200).send({message : "The User is not founded"})
      }
    }).catch(err => {
      res.status(404).send({message : err})
    })
  }else if(type == 2){
    company.find({_id : id}).select('_id name phone location_x location_y  is_open start_time end_time dayes').then(result => {
      result = result[0]
      if(result){
        res.status(200).send(result)
      }else{
        res.status(200).send({message : "The User is not founded"})
      }
    }).catch(err => {
      res.status(404).send({message : err})
    })
  }
})


//add medicin

router.post('/add', function(req, res, next) {
var data = req.body;
medicin= new medicines(data);
medicin.save()
.then(
  (savemedicines)=>{
    res.send(savemedicines)
  }
).catch(
  (err)=>{
    res.send(err)
  }
)
});

//delet medicin

router.delete('/delete/:id', function(req, res, next) {
id=req.params.id

  medicines.findByIdAndDelete({_id:id})
 .then(
    (deletedemedicines)=>{
      res.send(deletedemedicines)
    }
  )
.catch(
  (err)=>{
    res.send(err)
  }
)
});

//update medicin

router.put('/update/:id', function(req, res, next) {

  id=req.params.id;
  newData=req.body;
  medicines.findByIdAndUpdate({_id:id},newData)
   .then(
      (updeted)=>{
        res.send(updeted)
      }
    )
  .catch(
    (err)=>{
      res.send(err)
    }
  )
  });

//get  all medicin 

router.get('/getall', function(req, res, next) {

  medicines.find()
  .then(
    (medicin)=>{
      res.send(medicin);
    }
  )
.catch(
  (err)=>{
    res.send(err)
  }
)

})

//get certain medicin

router.get('/getbyid/:id', function(req, res, next) {

  id=req.params.id;
  medicines.findOne({_id:id})
  .then(
    (medicines)=>{
      res.send(medicines);
    }
  )
.catch(
  (err)=>{
    res.send(err)
  }
)

})

//add order

router.post('/order', function(req, res, next) {
  var data = req.body;
  orders= new order(data);
  
  orders.save()
  .then(
    (saveorder)=>{
      res.send(saveorder)
    }
  ).catch(
    (err)=>{
      res.send(err)
    }
  )
  
  })
  //get medicin according id company

  router.get('/getbyidcompany/:id', function(req, res, next) {

    var data = req.body;
    medicines.find({id_company : data.id_company})
    .then(
      (medicines)=>{
        res.send(medicines);
      }
    )
  .catch(
    (err)=>{
      res.send(err)
    }
  )
  
  })

  //get medicin according active_substance

  router.get('/getbyactive_substance/:id', function(req, res, next) {

    var data = req.body;
    medicines.find({active_substance : data.active_substance})
    .then(
      (medicines)=>{
        res.send(medicines);
      }
    )
  .catch(
    (err)=>{
      res.send(err)
    }
  )
  
  })

module.exports = router;
