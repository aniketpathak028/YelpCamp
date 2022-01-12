// wrapper function to catch errors in async middlewares 
module.exports = func => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    }
}