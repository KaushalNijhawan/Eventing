const jwt = require('jsonwebtoken');
const authenticate  = (req, res, next)=>{
    if(!req.headers){
        req.isAuth = false;
        return next();
    }else{
        const authentication = req.headers['authorization'];
        if(!authentication || authentication == "" || authentication.length == 0){
            req.isAuth = false;
            return next();
        }else{
            const token = authentication.split(' ')[1];
            if(token[1] == "" || !token){
                req.isAuth = false;
                return next();
            }
            let decoded = '';
            try{
                decoded = jwt.verify(token , 'longlongververyverylongstringthisoneis');
            }catch(err){
                req.isAuth = false;
                return next();
            }
            req.isAuth = true;
            req.userId = decoded.foo;
            return next();
        }
    }
}

module.exports = authenticate;