const whitelist = [
    'https://www.yourwebsite.com',
    'http://127.0.0.1:5500',
    'http://localhost:3000',
    'http://localhost:3001'

];

const corsOptions = {
    origin: (origin,callback) => {
        if(whitelist.indexOf(origin) !== -1 || !origin){
            callback(null,true)
        }else {
            callback(new Error('Not Allowed By CORS'))
        }
    },
    optionsSuccessStatus: 200,
    METHODS:['GET','POST'],
    credentials:true
}

module.exports = corsOptions;

