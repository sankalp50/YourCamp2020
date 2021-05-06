const {campgroundSchema, reviewSchema} = require('./schema');
const ExpressError = require('./utilities/ExpressError');
const Campground = require('./models/campground')
const Review = require('./models/review');
module.exports.isLoggedIn = ( req, res, next ) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in!');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    
    const {error} = campgroundSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!(campground.author._id.equals(req.user._id))){
        req.flash('error', 'You dont have permission to edit!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, rId } = req.params;
    const review = await Review.findById(rId);
    if(!(review.author.equals(req.user._id))){
        req.flash('error', 'You dont have permission to that!');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}



module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    }else{
        next();
    }
}