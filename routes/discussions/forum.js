var models = require('../../models'),
    async = require('async'),
    PostForumResource = require('../../api/forum/postForumResource.js');


module.exports = function(req,res) {
//    var resource = new PostForumResource();
    var subject_id = req.params[0];
    var page = req.params.page || 0,
        limit = 10,
        offset = (page - 1) * limit;
    async.waterfall([
        function(cbk) {
            models.Subject.findById(subject_id).exec(function(err, result){
                 cbk(null, result);
            });
        },
        function(subject, cbk){
            models.PostForum
                .find()
                .where('subject_id', subject_id)
                .sort({creation_date: 1})
                .populate('creator_id')
                .exec(function(err, results){
                    cbk(err, subject, results);
                });
        }
    ], function(err, subject, posts){
        var new_posts = [];
        _.each(posts, function(post){
            var new_post = post.toObject();
            new_post.avatar = post.creator_id.avatar_url();
            new_post.username = post.creator_id.toString();
            new_post.creator_id = post.creator_id.id;
            new_post.user_occupation = post.creator_id.occupation;

            //set is_my_comment flag
            new_post.is_my_comment = req.user && (req.user.id + "" === (post.creator_id && post.creator_id + ""));
            new_posts.push(new_post);
        });
        var post_groups = _.groupBy(new_posts, function(post){
            return post.parent_id;
        });

        var main_posts = _.filter(new_posts, function(post){
            return !post.parent_id;
        });

        var page_posts = _.first(_.rest(main_posts, offset),limit);
        res.render('forum.ejs', {
            subject: subject,
            logged: req.isAuthenticated(),
            user: req.user,
            avatar:req.session.avatar_url,
            user_logged: req.isAuthenticated(),
            url:req.url,
            posts: page_posts || [],
            post_groups: post_groups
        });
    });

};
//    models.Subject.findById(subject_id,function(err,subject) {
//        if(err)
//            res.render('500.ejs',{error:err});
//        else {
//            if(!subject)
//                res.redirect('/discussions');
//            else
//                res.render('discussion_list_by_subject.ejs', {
//                    layout: false,
//                    tag_name:req.query.tag_name,
//                    subject:subject,
//                    title:"דיונים",
//                    logged: req.isAuthenticated(),
//                    big_impressive_title: "",
//                    user: req.user,
//                    avatar:req.session.avatar_url,
//                    user_logged: req.isAuthenticated(),
//                    url:req.url,
//                    tab:'discussions'
//                });
//        }
//    });
//};
