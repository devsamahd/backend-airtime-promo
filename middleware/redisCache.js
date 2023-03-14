const redisClient = require("../lib/redis")

const cache = async(req, res, next) => {
    const orgid = req.params?.orgid
    let queryname = '';

    if(!orgid){
        queryname = "allOrgs"
    }
    else if(!req.query?.type && !req.query?.status){
        const { skip }= req.query
        const limit = req.query.limit || 10
        queryname = orgid+skip.toString()+limit.toString()
    }
    else if(!req.query?.type && req.query?.status){
        const { skip, status }= req.query
        const limit = req.query.limit || 10      
        queryname = orgid+skip.toString()+limit.toString()+status  
    }
    else if(req.query?.type && !req.query?.status){
        const { skip, type }= req.query
        const limit = req.query.limit || 10
        
        queryname = orgid+skip.toString()+limit.toString()+type
    }else{
        const { skip, limit, type, status }= req.query
        queryname = orgid+skip.toString()+limit.toString()+type+status
    }

const data = await redisClient.get(queryname)
if(data !== null){
    return res.json(JSON.parse(data))
}
next()
}

module.exports = cache