import React from 'react'
import { useState } from 'react';
import { useFetchLastFnftId } from "hooks/useFetchLastFnftId"
import { ContentMain } from "components/FnftData"

export function App() {
  const [data, setData] = useState('')
  const [id, setId] = useState('')
  const [submitBtn, setsubmitBtn] = useState(true)
  const lastFnft = useFetchLastFnftId()

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    // Preventing the page from reloading
    event.preventDefault();
    setData(id);
    setsubmitBtn(!submitBtn)
  }

  return (
    <>
      <h1>xLQDR FNFT Rewards Calculator</h1>
      <div className="container">
        <form onSubmit={submitForm}>
          <input
            value={id}
            onChange={(e) => setId(e.target.value)}
            type="number"
            max={lastFnft}
            min="0"
            step="1"
            placeholder="FNFT ID"
            className="input"
          /> {' '}
          <button type="submit" className="btn">Submit</button>
        </form> 
      </div>
      <div>
        <ContentMain formData={data} lastFnft={lastFnft} submitBtn={submitBtn}/>
      </div>
    </>
  )
}
