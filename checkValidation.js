const checkValidation = (error)=>{
    const errorObject = {};
    error.details.forEach((err) => {
      errorObject[err.path[0]] = err.message;
    });
    return errorObject;
}
module.exports = checkValidation;