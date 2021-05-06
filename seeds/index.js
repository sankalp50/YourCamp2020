const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/your-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20)+10;
        const camp = new Campground({
            author: '608da069392e57308ca410ae',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Veritatis est incidunt molestias magnam earum sint. Facere, quos! Esse, perspiciatis sint id consectetur, consequuntur beatae ad odit porro exercitationem modi a.',
            price,
            geometry: {
                type: "Point",
                coordinates: [-
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dhxtntmmc/image/upload/v1619939536/YourCamp/q7btwidfpfhtslshzw23.jpg',
                    filename: 'YourCamp/q7btwidfpfhtslshzw23'
                },
                {
                    url: 'https://res.cloudinary.com/dhxtntmmc/image/upload/v1619939544/YourCamp/x2xltuxq2uc9sp5v63ty.jpg',
                    filename: 'YourCamp/x2xltuxq2uc9sp5v63ty'
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})