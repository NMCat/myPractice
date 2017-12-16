var mongodb = require('./db');

function Message(mes) {
    this.name = mes.name;
    this.age = mes.age;
    this.gender = mes.gender;
    this.phone = mes.phone;
    this.email = mes. email;
    this.detail = mes.detail;
}
Message.prototype.save = function (callback) {
    var mesContent = {
        name:this.name,
        age:this.age,
        gender:this.gender,
        phone:this.phone,
        email:this.email,
        detail:this.detail

    }
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('mes',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.insert(mesContent,{safe:true},function (err,mes) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,mes);
            })
        })
    })
}

//获取数据
Message.getAll = function (name,page,callback) {
    mongodb.open(function (err,db) {
        if (err) {
            return callback(err);
        }
        db.collection('mes', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            var query = {}
            if (name) {
                query.name = name;
            }
            collection.count(query, function (err, total) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }

                collection.find(query, {
                    skip: (page - 1) * 5,
                    limit: 5
                }).toArray(function (err, mess) {
                    mongodb.close();
                    if (err) {
                        return callback(err);
                    }
                    return callback(null, mess,total);
                })
            })
        })
    })
}
//编辑功能
Message.edit =function (name,age,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('mes',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.findOne({
                name:name,
                age:age,

            },function (err,mes) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                // console.log(mes)
                return callback(null,mes);
            })
        })
    })
}



//修改学生信息
Message.update = function (name,age,gender,phone,email,detail,callback) {

    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('mes',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.update({
                name:name
            },{
                $set:{

                    age:age,
                    gender:gender,
                    phone:phone,
                    email:email,
                    detail:detail
                }
            },function (err,mes) {
                mongodb.close();
                if(err){
                    return callback(err);
                }

                return callback(null,mes);
            })
        })
    })
}

//删除
Message.remove = function (name,age,callback) {
    //打开数据库
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('mes',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.remove({
                name:name,
                age:age,

            },{
                w:1 //删一个
            },function (err) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null);
            })
        })
    })
}
//搜索
Message.search = function (keyword,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('mes',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            var newRegex = new RegExp(keyword,"i");
            collection.find({
                name:newRegex
            }).toArray(function (err,mess) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,mess);
            })
        })
    })
}

module.exports = Message;
