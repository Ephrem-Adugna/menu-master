import axios from "axios"
export const sendMail = (phoneNumber, body, subject) => {
    var url = `${process.env.NEXT_PUBLIC_API_URL}?to=${phoneNumber}&body=${body}&subject=${subject}`
    return axios.get(url);
}