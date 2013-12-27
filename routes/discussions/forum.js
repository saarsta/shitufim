var models = require('../../models'),
    async = require('async'),
    InformationItemResource = require('../../api/InformationItemResource.js'),
    PostForumResource = require('../../api/forum/postForumResource.js');


module.exports = function(req,res) {
    var post_resource = new PostForumResource();
    var information_item_resource = new InformationItemResource();

    var subject_id = req.params[0];
    var page = req.query.page || 1,
        limit = 10,
        offset = (page - 1) * limit;
    async.parallel([
        function(cbk) {
            models.Subject.findById(subject_id).exec(function(err, result){
                 cbk(null, result);
            });
        },
        function(cbk){
            post_resource.get_objects(req, {subject_id: subject_id}, {creation_date: 1}, limit, offset, function(err, posts){
                cbk(err, posts);
            });
        },

        function(cbk){
            information_item_resource.get_objects(req, {subjects: subject_id}, {creation_date: -1}, 0, 0, function(err, information_items){
                console.log(information_items);
                cbk(err, information_items);
            });
        }
    ], function(err, results){
        var subject = results[0],
            count = results[1].count,
            main_posts = results[1].page_posts,
            post_groups = results[1].post_groups,
            information_items = results[2].objects;
        if (!subject.isUserAllowed(req.user))
            return res.redirect('/discussions');

        res.render('forum.ejs', {
            subject: subject,
            logged: req.isAuthenticated(),
            user: req.user,
            avatar:req.session.avatar_url,
            user_logged: req.isAuthenticated(),
            url:req.url,
            posts: main_posts || [],
            post_groups: post_groups,
            count: count,
            page: page,
            next: Number(page) + 1,
            prev: Number(page) - 1,
            information_items: information_items
        });
    });

};
