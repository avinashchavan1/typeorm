interface Error {
  status?: number;
}
module.exports = {
  generateErrorWithStausCode: (statusCode: number, message: string) => {
    let error = new Error(message);
    error.status = statusCode;
    return error;
  },
};
