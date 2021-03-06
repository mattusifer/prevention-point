import apisauce from "apisauce"
import createAuthRefreshInterceptor from "axios-auth-refresh"
import refreshAuthLogic from "./refreshAuthLogic"

const create = () => {
  const accessToken = localStorage.getItem("JWT_ACCESS")

  const api = apisauce.create({
    baseURL: "/api",
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  createAuthRefreshInterceptor(api.axiosInstance, refreshAuthLogic(api))

  const getParticipants = async () => {
    const response = await api.get("/participants/")
    return response
  }
  return {
    getParticipants,
  }
}

export default create()
