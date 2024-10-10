const Comment = require('../models/comment');

const checkCommentOwner = async (req,res,next) => {
    if(req.isAuthenticated()) {
        const comment = await Comment.findById(req.params.commentId).exec()
        if(comment.user.id.equals(req.user._id) ) {
            next();
        }
        else {
            req.flash("In","You dont own the comment!");
            res.redirect("back");
        }
    }
    else {
        req.flash("error","Not logged in buddy!");
        res.redirect('/login');
    }
}

module.exports = checkCommentOwner;