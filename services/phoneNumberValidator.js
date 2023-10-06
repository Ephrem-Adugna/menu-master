import axios from "axios"
export const validatePhoneNumber = (phoneNumber) => {
    return axios.post(`http://apilayer.net/api/validate?access_key=${process.env.NEXT_PUBLIC_PHONE_API_KEY}&number=${phoneNumber}&country_code=US& format = 1`);
}