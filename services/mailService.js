import axios from "axios"
export const sendMail = (phoneNumber, body, subject, regToken) => {
    var url = `${process.env.NEXT_PUBLIC_API_URL}?to=${phoneNumber}&body=${body}&subject=${subject}&regToken=${regToken}`
    return axios.get(url);
}