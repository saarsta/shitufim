
module.exports = function(req,res) {
    res.render('about.ejs',{
        is_english: false,
        layout: false,
        url: req.url,
        user_logged: req.isAuthenticated(),
        user: req.session.user,
        avatar_url: req.session.avatar_url,
        is_no_sheatufim : false,
        subject : {}
    });
};