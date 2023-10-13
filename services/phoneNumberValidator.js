import axios from "axios"
export const validatePhoneNumber = (phoneNumber) => {
    return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/phoneValidation?apiKey=${process.env.NEXT_PUBLIC_PHONE_API_KEY}&phoneNumber=${phoneNumber}`);
}