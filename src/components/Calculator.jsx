import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { add, sub } from '../redux/calcSlice'

function Calculator() {
  const dispatch = useDispatch()
  const result = useSelector((state) => state.calc.result)
  const [number1, setNumber1] = useState(0)
  const [number2, setNumber2] = useState(0)

  const handleAdd = () => {
    dispatch(add({ num1: Number(number1), num2: Number(number2) }))
  }

  const handleSub = () => {
    dispatch(sub({ num1: Number(number1), num2: Number(number2) }))
  }

  return (
      <div>
        <h1 >Calculator</h1>

        <div className="flex flex-col gap-4 mb-6">
          <input
            type="number"
            value={number1}
            onChange={(e) => setNumber1(e.target.value)}
            placeholder="Enter first number"
            className="border border-white  text-white"
          />

          <input
            type="number"
            value={number2}
            onChange={(e) => setNumber2(e.target.value)}
            placeholder="Enter second number"
            className="border border-white  text-white"
          />
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={handleAdd}
            className="bg-indigo-500 text-white px-5 py-2 rounded-lg hover:bg-indigo-600 transition-all duration-200"
          >
            Add
          </button>

          <button
            onClick={handleSub}
            className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition-all duration-200"
          >
            Sub
          </button>
        </div>

        <p className="text-lg font-medium text-gray-700">
          Result: <span className="font-bold text-indigo-700">{result}</span>
        </p>
    </div>
  )
}

export default Calculator
