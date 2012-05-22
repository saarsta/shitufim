
var resources = require('jest'),
    util = require('util'),
    models = require('../models'),
    async = require('async'),
    common = require('./common'),
    _ = require('underscore');

//Authorization
var Authoriztion = function() {};
util.inherits(Authoriztion,resources.Authorization);

Authoriztion.prototype.edit_object = function(req,object,callback){

    if(req.method == 'POST'){
        models.GradeSuggestion.count({"suggestion_id": object.suggestion_id + "", "user_id":req.user._id}, function(err, count){
            if (err){
                callback(err, null);
            }else{
                if (count > 0){
                    callback({message:"user already grade this discussion",code:401}, null);
                }else{
                    object.user_id = req.user._id;
                    callback(null, object);
                }
            }
        })
    }else{
        if(req.method == 'PUT'){
            if(!(object.user_id + "" == req.user._id + ""))
                callback({message:"its not your garde!",code:401}, null);
            else
                callback(null, object);
        }else{
            callback(null, object);
        }
    }
};

var GradeSuggestionResource = module.exports = common.GamificationMongooseResource.extend({
    init:function(){
        this._super(models.GradeSuggestion,'grade_suggestion', null);
//        GradeResource.super_.call(this,models.Grade);
        this.allowed_methods = ['get','put','post'];
        this.authorization = new Authoriztion();
        this.authentication = new common.SessionAuthentication();
        this.filtering = {discussion_id: {
            exact:null,
            in:null
        }};
        this.fields = {
            _id: null,
            new_grade: null,
            evaluate_counter: null,
            already_graded: null
        }
    },

    create_obj:function(req,fields,callback)
    {
        var self = this;
        var base = this._super;
        var new_grade = null;
        var counter = 0;
        var g_suggestion_obj;
        var is_agree;
        var discussion_evaluation_grade;

        async.waterfall([

            //user can grade suggestion only if he grade the discussion
            function(cbk){
                models.Grade.findOne({user_id: req.user._id, discussion_id: fields.discussion_id}, cbk);
            },

            function(grade_discussion, cbk){
                if(!grade_discussion)
                    cbk({code: 401, message: "must grade discussion first"}, null);
                else{
                    discussion_evaluation_grade = grade_discussion.evaluation_grade;
                    base.call(self, req, fields, cbk);
                }
            },

            function(grade_suggestion_obj, cbk){
                is_agree = grade_suggestion_obj.evaluation_grade >= discussion_evaluation_grade;
                models.Suggestion.findById(grade_suggestion_obj.suggestion_id, function(err, sugg){
                    cbk(err, sugg);
                });
            },

            function(suggestion_obj, cbk){
                calculateSuggestionGrade(suggestion_obj._id, suggestion_obj.discussion_id, is_agree, function(err, _new_grade, _evaluate_counter){
                    if(!err){
                        new_grade = _new_grade;
                        counter = _evaluate_counter;
                    }
                    cbk(err)
                });
            }

            ], function(err, obj){
                if(!err){
                    req.gamification_type = "grade_suggestion";
                    req.token_price = common.getGamificationTokenPrice('grade_suggestion') || 0;
                }
                callback(err, {new_grade:new_grade, evaluate_counter: counter, already_graded: true});
            })
    },

    update_obj: function(req, object, callback){
        var self = this;
        var g_grade;
        var discussion_id = req.body.discussion_id;

        self._super(req, object, function(err, grade_object){
            if(err){
                callback(err, null);
            }else{
                var new_grade, evaluate_counter;
                async.waterfall([
                    function(cbk){
                        g_grade = grade_object;
                        calculateSuggestionGrade(object.suggestion_id, discussion_id, null, function(err, _new_grade, _evaluate_counter){
                            if(!err){
                                new_grade = _new_grade;
                                evaluate_counter = _evaluate_counter;
                            }
                            cbk(err, 0);
                        });
                    }
                ], function(err){
                    callback(err, {new_grade: new_grade, evaluate_counter: evaluate_counter, grade_id: g_grade._id || 0})
                })
            }
        });
    }
})


var calculateSuggestionGrade = GradeSuggestionResource.calculateSuggestionGrade = function (suggestion_id, discussion_id, is_agree_to_suggestion, callback){

    // suggestios_grade_counter + discussion_grade_counter = all graders
    var suggestios_grade_counter;
    var discussion_grade_counter;

    var suggestios_grade_sum = 0;
    var discussion_grade_sum = 0;

    var total_counter;
    var total_sum;
    var new_grade;

    async.waterfall([

        //get all grades for the suggestion,
        function(cbk){
            models.GradeSuggestion.find({suggestion_id: suggestion_id}, ["user_id", "evaluation_grade"], function(err, sug_grades){
                cbk(err, sug_grades);
            });
        },

        function(sugg_grades, cbk){
            var users = [];
            suggestios_grade_counter = sugg_grades.length;

            if(suggestios_grade_counter)
                suggestios_grade_sum = _.reduce(sugg_grades, function(memo, grade){return memo + Number(grade.evaluation_grade); }, 0);

            _.each(sugg_grades, function(grade){users.push(grade.user_id)});

            //get all dicsussion grades that their creators didnot grade the suggestion
            models.Grade.find({ discussion_id: discussion_id, user_id: { $nin: users }}, function(err, grades){
                cbk(err, grades);
            });
        },

        function(disc_grades, cbk){
            discussion_grade_counter = disc_grades.length;

            if(discussion_grade_counter)
                discussion_grade_sum = _.reduce(disc_grades, function(memo, grade){return memo + Number(grade.evaluation_grade); }, 0);

            total_counter = suggestios_grade_counter + discussion_grade_counter;
            total_sum = suggestios_grade_sum + discussion_grade_sum;

            new_grade = total_sum/total_counter;
            if(is_agree_to_suggestion != null){
                if(is_agree_to_suggestion){
                    models.Suggestion.update({_id: suggestion_id}, {$set: {grade: new_grade, evaluate_counter: suggestios_grade_counter, $inc: {agrees: 1}}}, function(err, args){
                        cbk(err, args);
                    });
                }else{
                    models.Suggestion.update({_id: suggestion_id}, {$set: {grade: new_grade, evaluate_counter: suggestios_grade_counter, $inc: {not_agrees: 1}}}, function(err, args){
                        cbk(err, args);
                    });
                }
            }else{
                models.Suggestion.update({_id: suggestion_id}, {$set: {grade: new_grade, evaluate_counter: suggestios_grade_counter}}, function(err, args){
                    cbk(err, args);
                });
            }
        }
    ], function(err, disc_grades){
        callback(err, new_grade, total_counter);
    })
}