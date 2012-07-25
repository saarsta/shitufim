///**
// * Created by JetBrains WebStorm.
// * User: ishai
// * Date: 2/13/12
// * Time: 12:34 PM
// * To change this template use File | Settings | File Templates.
// */
//var sys = require('util'),
//    mongoose = require('mongoose');
//var bcrypt;
//try {
//    bcrypt = require('bcrypt');
//}
//catch (e) {
//    bcrypt = {
//        gen_salt_sync:function (num) {
//            return '';
//        },
//
//        encrypt_sync:function (password, salt) {
//            return password;
//        },
//
//        compare_sync:function (password, hashedPassword) {
//            return password == hashedPassword;
//        }
//    };
//}
//
//var _ = require('underscore');
//
//var Models = require("../models");
//var g_next;
//exports.referred_by_middleware = function(req,res,next)
//{
//    if('referred_by' in req.query)
//    {
//        req.session.referred_by = req.query['referred_by'];
//        req.session.save(function(err,result)
//        {
//            next();
//        });
//    }
//    else
//        next();
//};
//
//
//exports.routing = function(router)
//{
//    router.post('/register',function (req, res) {
//        var data = req.body;
//        var user = new Models.User(data);
//        user.password = bcrypt.encrypt_sync(data.password, bcrypt.gen_salt_sync(10));
//        user.identity_provider = "register";
//        if(req.session.referred_by)
//        {
//            user.invited_by = req.session.referred_by;
//        }
//        /* user.num_of_extra_tokens = 10000000;////delete!!
//         user.invited_by = "4f69e4c52c18dffc11000002";////
//         user.num_of_extra_tokens = 4;////
//         user.has_been_invited = true; ////*/
//
//        user_model = Models.User;
//
//        user_model.find({username:user.username, identity_provider:'register'}, function (err, result) {
//            if (err == null) {
//
//                var test = result.length;
//                if (result.length < 1) {     //user is not registered
//                    user.save(function (err, user) {
//                        if (err) {
////                      res.send('something wrong: '+ err.message,500);
//
//                            res.render('login.ejs', {title:'Login', failed:true, exist_username:false, errors:err.errors, next:req.query.next});
//                        }
//                        else {
//                            console.log('new user has been created by registration');
//                            req.body['username'] = user.username;
//                            req.body['password'] = data['password'];
//                            req.authenticate('simple', function (err, is_authenticated) {
//                                if (err) res.send('something wrong: ' + err.message, 500);
//                                else {
//                                    if (!is_authenticated) res.send('something wrong', 500);
//                                    else {
//                                        var next = req.query.next || DEFAULT_LOGIN_REDIRECT;
//                                        res.redirect(next);
//                                    }
//                                }
//                            });
//                        }
//                    });
//                } else {
//                    res.render('login.ejs', {title:'Login',
//                        tab:'users',
//                        failed:false, exist_username:true, next:req.query.next});
//                }
//            } else {
//                throw "Error reading db.User";
//            }
//        });
//
//    });
//
//    router.post('/login', require('./login'));
//
//    router.get('/facebooklogin',function (req, res) {
//        function go() {
//            req.authenticate("facebook", function (error, authenticated) {
//                var next = req.session['fb_next'];
//                var referred_by = req.session['referred_by'];
//                console.log(error);
//                if (authenticated) {
//
//                    var user_detailes = req.getAuthDetails().user;
//                    var access_token = req.session["access_token"];
//                    var user_fb_id = req.getAuthDetails().user.id;
//
//                    isUserInDataBase(user_fb_id, function (is_user_in_db) {
//
//                        if (!is_user_in_db) {
//                            user_detailes.invited_by = referred_by;
//                            createNewUser(user_detailes, access_token, function (_id) {
//                                req.session.user_id = _id;
////                            req.session.auth.user._id = _id; i can delete this
//                                req.session.save(function (err, object) {
//                                    if (err != null) {
//                                        console.log(err);
//                                    } else {
//                                        res.redirect(next || DEFAULT_LOGIN_REDIRECT);
//                                        console.log('user _id to session is ok')
//                                    }
//                                });
//                            });
//                        } else {
//
//                            updateUesrAccessToken(user_detailes, access_token, function (_id) {
//                                req.session.auth.user._id = _id;
//                                req.session.save(function (err, object) {
//                                    if (err != null) {
//                                        console.log(err);
//                                    } else {
//                                        res.redirect(next || DEFAULT_LOGIN_REDIRECT);
//                                        console.log('user _id to session is ok')
//                                    }
//
//                                });
//                            });
//                        }
//                    });
//                }
//            });
//        }
//
//        if (req.query.next) {
//            req.session['fb_next'] = req.query.next;
//            req.session.save(function(err, obj){
//                go();
//            });
//        }
//        else
//            go();
//    });
//
//    router.get('/logout', function (req, res) {
//        res.clearCookie('connect.sid', {path:'/'});
//        delete req.session['user_id'];
//        delete req.session['user']
//        req.session.save();
//        req.session.destroy();
//        res.redirect('/');
//        req.logout();
//    });
//
//};
//
//
//var https = require("https");
//
///**   Simple Authentication ************/
//var Basic = require("connect-auth").Basic;
//
//var SimpleAuthentication = exports.SimpleAuthentication = function (options) {
//    options = options || {};
//    var that = Basic(options);
//    var my = {};
//
//    function validatePasswordFunction(username, password, successCallback, failureCallback) {
//
//        var user_model = Models.User;
//
//        user_model.findOne({username:username, identity_provider:'register'}, function (err, result) {
//            if (err == null) {
//
//                if (result == null) {     //user is not registered
//                    failureCallback();
//                } else {
//                    if (bcrypt.compare_sync(result.password, password)) {
//                        successCallback(result.id);
//                    } else {
//                        failureCallback();
//                    }
//                }
//            } else {
//                throw "Error reading db.User";
//            }
//        });
//    }
//
//    that.name = options.name || "simple";
//
//    that.authenticate = function (request, response, callback) {
//        var self = this;
//        var username = request.body.username;
//        var password = request.body.password;
//        var email = request.body.email;
////        var _id = request.body._id;
//
//        validatePasswordFunction(username, password, function (custom) {
//            var result = /*custom || {"username": username  "email": email };*/{'user_id':custom};
//            self.success(result, callback);
//        }, function (error) {
//            if (error)
//                callback(error);
//            else
//                self.fail(callback);
//            //that._unAuthenticated(self, request, response, callback);
//        });
//    };
//    return that;
//};
//
//exports.facebookShare = function(req,res)
//{
//    //var link = req.app.settings.root_path + (req.query.link || '');
//    //res.redirect("http://www.facebook.com/sharer/sharer.php?u=" + link + "&referrer=" + req.session.user_id);
//    res.send('soon will be enabled');
//};
//
//function isUserInDataBase(user_facebook_id, callback) {
//
//    var user_model = Models.User,
//        flag = false;
//
//    user_model.find({facebook_id:user_facebook_id}, function (err, result) {
//        if (err == null) {
//            if (result.length == 1) { // its not a new user
//                //var user_id = result[0]._id;
//                //console.log("isUserInDataBase returns true")
//                flag = true;
//            } else {
//                if (result.length == 0) { // its a new user
//                    //console.log("isUserInDataBase returns false");
//                } else { // handle error here
//                    throw "Error: Too many users with same user_facebook_id";
//                }
//            }
//        } else {
//            throw "Error reading db.User in isNewUser";
//        }
//
//        callback(flag);
//    });
//}
//
//function createNewUser(data, access_token, callback) {
//    var user = new Models.User();
//    user.username = data.username;
//    user.identity_provider = "facebook";
//    user.first_name = data.first_name;
//    user.last_name = data.last_name;
//    user.email = data.email;
//    if (data.hometown) {
//         user.address = data.hometown.name;
//    }
//    user.gender = data.gender;
//    user.facebook_id = data.id;
//    if(data.invited_by)
//        user.invited_by = data.invited_by;
//    user.access_token = access_token;
//    user.save(function (err, object) {
//        if (err != null) {
//            console.log(err);
//        } else {
//            callback(object.id);
//            console.log("done creating new user - " + user.first_name + " " + user.last_name);
////            res.write("done creating new user - " + user.first_name + " " + user.last_name);
//        }
////        res.end();
//    });
//}
//
//function updateUesrAccessToken(data, access_token, callback) {
//    var user_model = Models.User;
//
//    user_model.findOne({facebook_id:data.id}, function (err, user) {
//        if (err) {
//            return next(err);
//        }
//        user.access_token = access_token;
////            user.session_id = session_id;
//        user.save(function (err) {
//            if (err) {
//                return callback(err);
//            } else {
//                callback(user.id);
//            }
//        });
////        res.end();
//    });
//}
//
//
//var forms = require('j-forms').forms;
//
//var UserForm = function(request,options)
//{
//    UserForm.super_.call(this,request,options,Models.User);
//};
//
//require('util').inherits(UserForm,forms.MongooseForm);
//
//UserForm.prototype.get_fields = function()
//{
//    UserForm.super_.prototype.get_fields.call(this);
//    this.fields = {
//        'avatar' : this.fields['avatar']
//    };
//};
//
//
//exports.edit_user = function(req,res)
//{
//    var user_id = req.session.user_id;
//    Models.User.findById(user_id,function(err,user)
//    {
//        var form = new UserForm(req,{instance:user});
//        if(req.method == 'GET')
//        {
//            // render page with form
//            //res.render()
//            var input = form.fields.avatar.render_str();
//            res.render('change_avatar.ejs',{input:input,
//                tab:'users'
//            });
//        }
//        else
//        {
//            form.is_valid(function(err,is_valid)
//            {
//                if(is_valid)
//                {
//                    form.save(function(err,result)
//                    {
//                        // saved
//                        res.render();
//                    });
//                }
//            });
//        }
//    });
//};
//
//
//