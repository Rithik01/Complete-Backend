// const asyncHandler = () => {}

// This asyncHandler is an interesting higher order function so it will take a function as a parameter or treat it as a variable

// This myfunc is a parameter which we passed into the asyncHandler function and this myfunc u took agar ise kisi aur function me pass karna chahu toh i've written it below //

// Using try catch
// const asyncHandler = (myfunc) => async (req, res, next) => {
//   try {
//     await myfunc(req, res, next);
//   } catch (error) {
//     // If the user is giving you error code then err.code pass kardete hai otherwise 500
//     res.status(err.code || 500).json({
//       // this success:false we send to  frontend so that it can show an error message
//       success: false,
//       message: err.message || "Server Error",
//     });
//   }
// };

// Using promises below

// const asyncHandler = (requestHandler) => {
//   (req, res, next) => {
//     Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
//   };
// };

// This below is production grade code //
/////// Now here the error doesn't have any structure man kiya status code bhejdia man kia json response bhejdia nai toh nai //
//// So we need to standarize the API ki yeh chize toh bhejni hi bhejni hai //////
////// Node.js gives you complete classes for handling errors /////
const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHandler };
