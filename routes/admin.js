const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {findProducts , findUsers , insertUser , deleteUser , editUser , findAdmin , findOneUser , search} = require('../helpers/database_operations');

router.get('/',(req, res) => {
    let admin = req.session.admin;
    if(admin){
        findUsers().then((data)=>{
            res.render('admin/view-users',{admin:true,data,user:admin});
        }).catch(err => console.log(err));
    }
    else{
        res.redirect('/admin/login');
    }
});
// router.get('/products',(req,res)=>{
//     let admin = req.session.admin;
//     if(admin){
//         findProducts().then((data)=>{
//             res.render('admin/view-products',{admin:true,data});
//         }).catch(err => console.log(err));
//     }
//     else{
//         res.redirect('/admin/login');
//     }
// });

router.get('/delete/:email',(req, res)=>{
    let delete_id = req.params['email'];
    console.log(delete_id);
    deleteUser(delete_id).then((resp)=>{
        console.log(req.session);
        res.redirect('/admin');
    }).catch((err)=>{console.log(err)});
})

router.get('/login',(req, res) => {
    let admin = req.session.admin;
    if(admin){
        res.redirect('/admin');
    }
    else{
        res.render('admin/login',{admin:true});
    }
});

router.post('/login',(req,res)=>{
    findAdmin().then((data)=>{
        let status = data.find((user)=>{
            return user.email == req.body.email && user.password == req.body.password
        });
        if(status){
            req.session.admin = req.body;
            res.redirect('/admin');
        }
        else{
            res.render('admin/login',{admin:false,msg:"please check your credentials"});
        }
    }).catch(err => console.log(err));
});

router.get('/add-user',(req, res)=>{
    let admin = req.session.admin;
    if(admin){
        res.render('admin/add_user',{admin:true});
    }
    else{
        res.redirect('/admin');
    }
});

router.post('/add-user',[
    body('name').not().isEmpty().withMessage('Name field cannot be empty'),
    body('email').isEmail().withMessage("Incorrect email"),
    body('phone').not().isEmpty().isLength({min:10,max:10}).withMessage('Incorrect Phone number it must contain 10 numbers'),
    body('confirm_password').custom((value,{req})=>{
        if(value !== req.body.password){
            throw new Error('Password confirmation does not match password');
        }
        return true;
    })
],(req, res)=>{
    const errors = validationResult(req);
     if (!errors.isEmpty()) {
         console.log(errors.errors);
         res.render('/admin/add_user',{ admin:true , errors: errors.errors });
     }
     else{
         console.log(req.body);
         let data = req.body;
         var count = 0;
         findUsers().then((users)=>{
                users.forEach((user)=>{
                    if(user.email == data.email){
                        // console.log(user.email);
                        count++;
                    } 
                })
                // console.log("before if"+count);
            if(count > 0){
                let errors = [{msg:"user already exists"}];
                res.render('admin/add_user',{admin:true,errors})
            }else{
                insertUser(data).then((da)=>{
                    req.session.user = req.body;
                    res.redirect('/admin');
                    console.log(da);
                });
            }
            })
       
     } 
});

router.get('/edit/:id',(req, res)=>{
    let userId = req.params["id"];
    findOneUser(userId).then((data)=>{
        res.render('admin/edit_user',{admin:true,data});
    }).catch((err)=>{console.log(err)});
})
router.post('/edit/:id',[
    body('name').not().isEmpty().withMessage('Name field cannot be empty'),
    body('email').isEmail().withMessage("Incorrect email"),
    body('phone').not().isEmpty().isLength({min:10,max:10}).withMessage('Incorrect Phone number it must contain 10 numbers'),
    body('confirm_password').custom((value,{req})=>{
        if(value !== req.body.password){
            throw new Error('Password confirmation does not match password');
        }
        return true;
    })
],(req, res)=>{

    const errors = validationResult(req);
     if (!errors.isEmpty()) {
         console.log(errors.errors);
         res.render('/admin/edit_user',{ admin:true , errors: errors.errors });
     }
     else{

    let userId = req.params["id"];
    let userData = req.body;
        editUser(userId,userData).then((data)=>{
            console.log(data);
            res.redirect('/admin');
        });  
     }     
});
router.post('/search',(req,res)=>{
    let admin = req.session.admin;
    if(admin){
        let searchData = req.body.search;
        search(searchData).then((data)=>{
            if(data.length > 0){
                res.render('admin/view-users',{admin:true,data});
            }
            else{
                let errors = [{msg:"user not found"}];
                res.render('admin/view-users',{admin:true,errors})
            }
        });
    }
    else{
        res.redirect('/admin');
    }
})
router.get('/logout',(req, res) => {
    delete req.session.admin;
    res.redirect('/admin/login');
});


module.exports = router;