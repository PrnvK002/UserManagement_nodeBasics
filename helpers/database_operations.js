const {get} = require('../config/connection');

function findProducts(){
    return new Promise(async (resolve, reject)=>{
        let products = await get().collection('products').find().toArray();
        if(products){
            resolve(products);
        }
        else{
            reject("error in finding products");
        }
    });
}
function findUsers(){
    return new Promise( async (resolve,reject)=>{
        let users = await get().collection('users').find().toArray();
        if(users){
            resolve(users);
        }
        else{
            reject("error in finding users");
        }
    });
}

function findOneUser(id){
    return new Promise(async (resolve, reject) =>{
        let users = await get().collection('users').findOne({"email":id});
        if(users){
            resolve(users);
        }
        else{
            reject("error in finding user");
        }
    })
}
function insertUser(user){
    return new Promise(async (resolve,reject)=>{
        let status = await get().collection('users').insertOne({name:user.name,email:user.email,password:user.password,phone:user.phone});  
        if(status){
            resolve("-------------successfully inserted user!----------------------");
        }
        else{
            reject("---------------error in inserting--------------------------------");
        }
    });
}

function deleteUser(id){
    return new Promise(async (resolve,reject)=>{
        let status = await get().collection('users').deleteOne({"email": id});
        console.log(status);
        if(status.deletedCount > 0){
            resolve("-----------------successfully deleted user----------------------");
        }
        else{
            reject("--------------------error in deleting-----------------------------");
        }
    })
}
function editUser(user,data){
    return new Promise(async (resolve,reject) => {
        let status = await get().collection('users').updateOne({"email":user},{$set:{"name":data.name,"email":data.email,"phone":data.phone,"password":data.password}});
        if(status){
            resolve("-------------------------successfully updated data--------------------------------------");
        }
        else{
            reject("-------------------------error in updating--------------------------------------");
        }
    })
}
function findAdmin(){
    return new Promise(async (resolve,reject)=>{
        let status = await get().collection('admin').find().toArray();
        if(status){
            resolve(status);
        }
        else{
            reject("Error in finding admin");
        }
    });
}
function search(data){
    return new Promise(async (resolve,reject)=>{
        let status = await get().collection('users').find({$text:{$search:data}}).toArray();
        if(status){
            resolve(status);
        }
        else{
            reject("Error in searching");
        }
    })
}
module.exports = {
    findProducts , findUsers , insertUser , deleteUser , editUser , findAdmin , findOneUser , search
}