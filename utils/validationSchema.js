import * as yup from 'yup';
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

export const employeeValidationSchema = yup.object().shape({
    dealAyoId:yup.string().required(),
    firstName:yup.string().required(),
    lastName:yup.string(),
    mobile: yup.string().required().matches(phoneRegExp, 'Phone number is not valid'),
    email:yup.string().email().required(),
    startTime:yup.string().required(),
    endTime:yup.string().required(),
    password:yup.string().required(),
    decreaseTask:yup.number().required(),
})
export const employeeValidationEditSchema = yup.object().shape({
    dealAyoId:yup.string().required(),
    firstName:yup.string().required(),
    lastName:yup.string(),
    mobile: yup.string().required().matches(phoneRegExp, 'Phone number is not valid'),
    email:yup.string().email().required(),
    startTime:yup.string().required(),
    endTime:yup.string().required(),
    password:yup.string(),
    decreaseTask:yup.number().required(),
})

export const categoryValidationSchema = yup.object().shape({
    category:yup.string().required(),
    time:yup.string().required(),
})
