var restaurantSchema = new Schema({

    name: String,
    id: Number,
    location: String,
    phoneNumber: String,
    logoURL: String,
    waitTime: Number,
    rating: Number,
    isOpen: Boolean,
    hours: {
        sunday: {start: String, end: String},
        monday: {start: String, end: String},
        tuesday: {start: String, end: String},
        wednesday: {start: String, end: String},
        thursday: {start: String, end: String},
        friday: {start: String, end: String},
        saturday: {start: String, end: String}
    }


})

 var Restaurant = mongoose.model('Restaurant', restaurantSchema);
                    var r = new Restaurant;
                    r.name = 'Azuki Japanese Restaurant';
                    r.id = 3102;
                    r.location = '239 PARK S AVE NEW YORK NY 10003';
                    r.phoneNumber = '555-555-5555';
                    r.logoURL = 'http://www.azuki-nyc.com/';
                    r.waitTime = 20;
                    r.rating = 3.5;
                    r.isOpen = True;
                    r.hours.sunday = {'11am', '8pm'};
                    r.hours.monday = {'11am', '9pm'};
                    r.hours.tuesday = {'11am', '9pm'};
                    r.hours.wednesday = {'11am', '9pm'};
                    r.hours.thursday = {'11am', '9pm'};
                    r.hours.friday = {'11am', '10pm'};
                    r.hours.saturday = {'11am', '10pm'};
                    r.save(callback);