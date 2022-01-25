const express = require('express');
const router = express.Router();
const {findProducts,findUsers,insertUser , findOneUser} = require('../helpers/database_operations');
const { body, validationResult } = require('express-validator');

// // router.use((req,res,next)=>{
//     let users = req.session.user;
//     if(users){
//         let email = users.email;
//         findOneUser(email).then((user)=>{
//             if(user){
//                 res.redirect('/');
//             }
//             else{
//                 res.redirect('/login');
//             }
//         });
//     }else{
//         next();
//     }
// })
router.get('/',(req,res)=>{
    console.log(req.session);
    let user = req.session.user;
    if(user ){
        findProducts().then((products)=>{
            res.render('user/index',{admin:false,products,user});
        }).catch(err=>{
            console.error(err);
        })
    }
    else{
        res.redirect('/login');
    }
});
router.get('/login',(req,res)=>{
    let user = req.session.user;
    if(user){
        res.redirect('/');
    }
    else{
        res.render('user/login',{admin:false,msg:null});
    }
});
router.get('/create_account',(req,res)=>{
    let user = req.session.user;
    if(user){
        res.redirect('/');
    }
    else{
        res.render('user/create_account',{admin:false,errors:null});
    }
});
router.post('/login',(req,res)=>{
    findUsers().then((data)=>{
        let status = data.find((user)=>{
            return user.email == req.body.email && user.password == req.body.password
        });
        if(status){
            req.session.user = req.body;
            res.redirect('/');
        }
        else{
            res.render('user/login',{admin:false,msg:"please check your credentials"});
        }
    }).catch(err => console.log(err));
});
router.post('/create_account',[
    body('name').not().isEmpty().withMessage('Name field cannot be empty'),
    body('email').isEmail().withMessage("Icorrect email"),
    body('phone').not().isEmpty().isLength({min:10,max:10}).withMessage('Incorrect Phone number it must contain 10 numbers'),
    body('confirm_password').custom((value,{req})=>{
        if(value !== req.body.password){
            throw new Error('Password confirmation does not match password');
        }
        return true;
    })
],(req,res)=>{
     // Finds the validation errors in this request and wraps them in an object with handy functions
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
         console.log(errors.errors);
       res.render('user/create_account',{ admin:false , errors: errors.errors });
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
                res.render('user/create_account',{admin:false,errors})
            }else{
                insertUser(data).then((da)=>{
                    req.session.user = req.body;
                    res.redirect('/');
                    console.log(da);
                });
            }
            })
         

     }
});
router.get('/logout',(req,res)=>{
    delete req.session.user;
    res.redirect('/login');
});
module.exports = router;