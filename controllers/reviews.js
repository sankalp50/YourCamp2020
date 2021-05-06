const Review = require('../models/review');
const Campground = require('../models/campground');


module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Created new Review!');
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, rId } = req.params;
    await Campground.findByIdAndUpdate(id, {$pull : {reviews: rId}});
    await Review.findByIdAndDelete(rId);
    req.flash('success', 'Successfully deleted Review!');
    res.redirect(`/campgrounds/${id}`);
}