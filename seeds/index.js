const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { descriptors, places } = require('./seedhelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
        console.log("CONNECTED TO MONGO!");
    })
    .catch((err) => {
        console.log("COULDN'T CONNECT TO MONGO! ERROR!!");
        console.log(err);
    })

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            img: 'https://source.unsplash.com/collection/9046579',
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati consequatur optio sequi. Quam obcaecati libero alias dignissimos, eius ipsa maxime!',
            price
        });
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});