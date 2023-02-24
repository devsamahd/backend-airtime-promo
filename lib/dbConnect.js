const mongoose = require('mongoose')
const DB = () => {
    try{
        mongoose.set("strictQuery", false);
        mongoose.connect('mongodb://127.0.0.1:27017/raffle', {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
    }catch(err){
        console.log(err)
    }
}

module.exports = DB