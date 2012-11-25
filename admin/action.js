var _ = require('underscore');
var j_forms = require('j-forms');
var async = require('async');
var models = require('../models');
var notifications = require('../api/notifications');
var AdminForm = require('admin-with-forms').AdminForm;

module.exports = AdminForm.extend({
    init:function(request,options,model) {
        this._super(request,options,model);


        this.static['js'].push('/node-forms/js/autocomplete.js');
    },

    get_fields: function() {
        this._super();
        this.fields['is_approved'].widget.attrs['readonly'] = 'readonly';
        this.fields['is_approved'].widget.attrs['disabled'] = 'disabled';
    },


    actual_save : function(callback) {
        var self = this;
        var creator_id = this.instance.creator_id + '';
        var is_approved = self.instance.is_approved;
        var is_action_hidden_when_save = Boolean(this.data.is_hidden);
        var was_hidden_before = Boolean(this.instance.is_hidden);
        var action_id = this.instance.id;

        if(this.clean_values.cycle_id){
            var prev_ids = _.map(this.instance.cycle_id, function(cycle_obj){return cycle_obj.cycle;});
            var cycle_ids = _.map(this.clean_values.cycle_id, function(cycle_obj){return cycle_obj.cycle;});
            _.each(cycle_ids, function(cycle_id, cbk){
                if(_.contains(prev_ids, cycle_id) == false){
                    models.User.find({"cycles.cycle_id": cycle_id}, function(err, followers){
                        if(err){
                            cbk(err);
                        }
                        else{
                            var notified_user_ids = _.map(followers, function(follower) { return follower.id });
                            async.forEach(notified_user_ids, function(notified_user, itr_cbk) {
                                if(creator_id != notified_user){
                                    notifications.create_user_notification("action_added_in_cycle_you_are_part_of", action_id,
                                        notified_user, null, cycle_id, '/actions/' + action_id, function(err, result){
                                            itr_cbk(err);
                                        })
                                }
                            });
                        }
                    })
                }
            })
        }

        var save_action = function(callback) {
            self._super.call(self, function(err, object) {
                //is approved sometimes changes when saving the form
                if( !err && is_approved !== object.is_approved)
                    models.Action.update({_id: object._id}, {$set: {is_approved: is_approved}}, callback);
                else
                    callback(err,object);
            });
        };


        if(was_hidden_before && !is_action_hidden_when_save) {
            var related_cycle_ids = self.instance.cycle_id.map(function(cycle_obj) { return cycle_obj.cycle });
            models.Cycle.find()
                .where('_id').in(related_cycle_ids)
                .where('is_hidden', true)
                .count(function(err, num_cycles){
                    if (err) {
                        callback(err);
                    }
                    if (num_cycles > 0) {
                        var error = new Error("trying to save action as not hidden, when one of the cycles it belongs to is hidden");
                        callback(error);
                    } else {
                        save_action(callback);
                    }
                });
        } else {
            save_action(callback);
        }
        // This is voodoo to try to get rid of 
        save_action=null;
    }
});

