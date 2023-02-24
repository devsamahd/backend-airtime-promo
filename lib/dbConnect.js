const mongoose = require('mongoose')
const DB = () => {
    try{
        mongoose.set("strictQuery", false);
        mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
    }catch(err){
        console.log(err)
    }
}

module.exports = DB