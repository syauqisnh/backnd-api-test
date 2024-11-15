import Joi from "joi";

const registerUserValidation = Joi.object({
    name: Joi.string().max(191).required().messages({
      'string.base': 'Nama harus berupa string.',
      'string.max': 'Nama tidak boleh lebih dari 191 karakter.',
      'any.required': 'Nama wajib diisi.',
    }),
  
    email: Joi.string().email().required().messages({
      'string.base': 'Email harus berupa string.',
      'string.email': 'Email tidak valid.',
      'any.required': 'Email wajib diisi.',
    }),
  
    password: Joi.string().min(8).required().messages({
      'string.base': 'Password harus berupa string.',
      'string.min': 'Password harus memiliki minimal 8 karakter.',
      'any.required': 'Password wajib diisi.',
    }),

    role: Joi.string().valid('INSTRUCTOR', 'STUDENT').default('STUDENT').messages({
      'string.base': 'Role harus berupa string.',
      'any.only': 'Role hanya bisa INSTRUCTOR atau STUDENT.',
    })
});

const loginUserValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

const getDetailValidateUser = Joi.object({
  uuid_user: Joi.string().guid({ version: 'uuidv4' }).required().messages({
    'string.guid': 'UUID tidak valid.',
    'any.required': 'UUID wajib diisi.',
})
});

const updateUserValidation = Joi.object({
  email: Joi.string().email().optional(),
  name: Joi.string().optional(),
  password: Joi.string().min(8).optional(),
  role: Joi.string().valid('STUDENT', 'INSTRUCTOR').optional() 
}).or('email', 'name', 'password', 'role');


const logoutValidate = Joi.string().required()

export {
  registerUserValidation,
  loginUserValidation,
  getDetailValidateUser,
  updateUserValidation,
  logoutValidate
}
