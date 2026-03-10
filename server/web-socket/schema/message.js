import Joi  from 'joi';

const   messageSchema = {
  send: Joi.object({
    content: Joi.string().allow("").max(1000),
    media : Joi.optional()
  }),
  update: Joi.object({
    content: Joi.string().allow("").max(1000),
  })
};

export default messageSchema
