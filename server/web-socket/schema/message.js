import joi  from 'joi';


export function validateMessage(orderitem) {
    const schema = joi.object({
        message: joi.string().required(),

    });
    const { error } = schema.validate(orderitem);
    if (error) {
        return  error.details[0].message;
    }
}


