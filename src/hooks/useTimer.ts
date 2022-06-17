import { useEffect, useState } from "react"

export default function useTimer(interval:number)  {
  const [refresh, setRefresh] = useState(new Date())
  useEffect(() => {
    var timerID = setInterval(() => timer(), interval)
    return () => clearInterval(timerID)
  } )

  function timer() {
      setRefresh(new Date())
  }
  return refresh
}

