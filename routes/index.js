var express = require("express");
var router = express.Router();
var Message = require("../model/message");
var mongodb = require('../model/db');
var crypto = require('crypto');
var multer = require('multer');


module.exports = function (app) {
    //信息頁面

    app.get('/', function (req, res) {
        var page = parseInt(req.query.page) || 1;
        Message.getAll(null,page, function (err, mess,total) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/');
            }
            return res.render('index', {
                title: '学生信息页面',
                page:page,//当前页数
                //是不是第一页,如果是第一页的话,值为true
                isFirstPage:(page - 1)*5 == 0,
                isLastPage:(page - 1)*5 +mess.length == total,
                success: req.flash('success').toString(),
                error: req.flash('error').toString(),
                mess: mess
            })
        })
    })

    //添加学生页面
    app.get('/add', function (req, res) {
        res.render('add', {
            title: '添加學生信息頁面',
            submitTitle: '添加',
            success: req.flash('success').toString(),
            error: req.flash('error').toString()
        })
    });
    //添加行为
    app.post("/add", function (req, res) {
        var name = req.body.name;
        var age = req.body.age;
        var gender = req.body.gender;
        var phone = req.body.phone;
        var email = req.body.email;
        var detail = req.body.detail;

        // 存入数据库
        var stu = new Message({
            name: name,
            age: age,
            gender: gender,
            phone: phone,
            email: email,
            detail: detail
        });
        stu.save(function (err, mes) {
            if (err) {
                req.flash('error', err);
                return res.redirect("/add");
            }
            req.session.mes = stu;
            req.flash('success', '添加成功');
            return res.redirect('/');

        });
    });

    //编辑页面
    app.get('/edit/:name/:age', function (req, res) {
        Message.edit(req.params.name, req.params.age,
            function (err, mes) {
                if (err) {
                    req.flash('error', err);
                    return res.redirect('/');
                }
                return res.render('edit', {
                    title: '编辑學生信息頁面',

                    submitTitle: '修改',
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString(),
                    mes:mes
                })
            })
    });
    //修改行为
    app.post('/edit', function (req, res) {
        Message.update(req.body.name, req.body.age, req.body.gender,
            req.body.phone, req.body.email, req.body.detail,
            function (err) {
            console.log(req.body.age);

                if (err) {

                    req.flash('error', err);
                    return res.redirect('/');
                }
                req.flash('success', "修改成功");
                console.log('成功');
                return res.redirect('/');
            })
    })

    //删除
    app.get('/remove/:name/:age',function (req,res) {
        Message.remove(req.params.name,req.params.age,
            function (err) {
                if(err){
                    req.flash('error',err);
                    return res.redirect('/');
                }
                req.flash('success','删除成功');
                return res.redirect('/');
            })
    })

    //搜索
    app.get('/search',function (req, res) {
        Message.search(req.query.keyword,function (err,mess) {
            if(err){
                req.flash('error',err);
                return res.redirect('/');
            }
            return res.render('search',{
                title:'搜索结果',
                success:req.flash('success').toString(),
                error:req.flash('error').toString(),
                mess:mess
            })
        })
    })

}