import axios from "axios"
export const sendNotification = (subscription) => {
    return axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sendNotification`, {subscription:subscription});
}