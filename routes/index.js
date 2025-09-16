var express = require('express');
var router = express.Router();
var ProductModel = require('../models/Product')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//File upload
router.get('/fileupload', function(req, res, next) {
  res.render('fileupload-form');
});

router.post('/fileupload', function(req, res, next) {
  console.log(req.files.files123);
  var myFile = req.files.files123
  myFile.mv('public/uploads/'+myFile.name, function(err) {
    if(err) {
      return res.status(500).send(err);
    }
    res.send("File Uploaded");
  });
  //res.render('index', { title: 'Express' });
});

//login
router.get('/login', function(req, res, next) {
  res.render('login')
});

router.post('/login', function(req, res, next) {
  var a = req.body.txt1
  req.session.uname = a
  res.redirect('/dashboard')
  //res.render('login')
});

router.get('/dashboard', function(req, res, next) {
  if(req.session.uname) {
    var a = req.session.uname
    res.render('dashboard', {mya : a})
  }
  else {
    res.redirect('/login')
  }
});

//logout
router.get('/logout', function(req, res, next) {
  req.session.destroy(function(err){
    res.redirect('/login');
  });
});

router.get('/add-product', function(req, res, next) {
  res.render('add-product')
});

router.post('/add-product-process', function(req, res, next) {
  var obj = {
    pname:req.body.txt1,
    pdetails:req.body.txt2,
    pprice:req.body.txt3
  }
  var ProductData = new ProductModel(obj)
  ProductData.save()
  .then(()=>{
    console.log("Data Added")
    res.send("Working")
  })
  .catch((err)=>console.log("Error "+err))  
});

router.get('/display-product', function(req, res, next) {
  ProductModel.find()
  .then((mydata)=>{
    console.log(mydata)
    res.render('display-product', {mydata:mydata})
  })
  .catch((err)=>console.log("Error in display product"))
})

// Correct route
router.get('/delete-product/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await ProductModel.findByIdAndDelete(id);
    res.redirect('/display-product');
  } catch (err) {
    console.error("Error in deleting product", err);
    res.status(500).send("Error in deleting product");
  }
});

router.get('/edit-product/:id', function(req, res, next) {
  var myid = req.params.id
  ProductModel.findById(myid)
  .then((mydata)=>{
    console.log(mydata)
    res.render('edit-product', {mydata : mydata})
  })
  .catch((err)=>console.log("Error in editing product" +err))
})

router.post('/update-product-process/:id', function(req, res, next) {
  var myid = req.params.id
  var mydata = {
    pname:req.body.txt1,
    pdetails:req.body.txt2,
    pprice:req.body.txt3
  }

  ProductModel.findByIdAndUpdate(myid, mydata)
  .then(()=>{
    res.redirect('/display-product')
  })
  .catch((err)=>console.log("Error in update" +err))
  
})


module.exports = router;
