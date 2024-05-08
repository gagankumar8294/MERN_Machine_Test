import { body, validationResult } from 'express-validator';

// export default it expects 3 things
// HoistedDeclearation => a function | it takes this | function with function keyword not arrow function
// Class 
// asignment expression

const validateRequest = async (req, res, next) => {
    console.log(req.body);
    //Replacing validation code with Express validator code
    // 1. Setup rules for validtion.
    const rules = [
        body('name').notEmpty().withMessage("Name is required"),
        body('price').isFloat({gt: 0}).withMessage("Price should be a valid numer"),
        // body('imageUrl').isURL().withMessage('Invalid url'), 
        body('imageUrl').custom((value, { req }) => {
            if (!req.file){
                throw new Error('Image is required');
            }
            return true;
        }),
    ]
    // 2. run those rules
    await Promise.all(rules.map(rule => rule.run(req)));
    
    // 3. Check if there are any errors after running the rules.
    var validationErrors = validationResult(req);

    // 4. if errors, return the error message
    if (!validationErrors.isEmpty()) {
        return res.render('new-product', {
            errorMessage: validationErrors.array()[0].msg,
        });
    }
    // it will all the conditions
    // if no isssue found it will call the next middleware in the pipeline 
    next();
}

// after it is declared we export
export default validateRequest;