import { status } from "./interfaces"

const getColorStatus = (status : status )=> {
    switch(status) {
      case "ONLINE": {
        return "success"
      }
      case "OFFLINE":
        return "danger"
      case "INGAME":
        return "primary"
      default: {
        return "danger"
      }
    }
}
export {
    getColorStatus
}