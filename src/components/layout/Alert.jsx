import { useContext } from "react";
import AlertContext from "../../contex/alert/AlertContext";

const Alert = () => {
    const {alert} = useContext(AlertContext)

  return alert !== null && (
    <p><strong>{alert.msg}</strong></p>
  )
    
  
}

export default Alert