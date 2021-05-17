module.exports = (status, message, errors = []) => {
    const err = new Error(message);
    err.statusCode = status;
    err.data = errors;
    return err;
}