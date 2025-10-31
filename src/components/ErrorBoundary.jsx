import React, { Component } from 'react'
import { Link } from 'react-router-dom'
export default class ErrorBoundary extends Component {
    constructor(props){
        super(props)
        this.state = {hasError:false}
    }
    static getDerivedStateFromError(error){
        return {hasError:true,error:error};
    }
    componentDidCatch(error,errorInfo){
        console.log(error);
        console.log(errorInfo);
        
        
    }
  render() {
    if(this.state.hasError){
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Oops! Something Went Wrong
            </h1>

            <p className="text-gray-600 mb-6">
              {this.state.error?.message || "An unexpected error occurred."}
            </p>

        

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition shadow-md"
              >
                Reload Page
              </button>

              <Link
                to={-1}
                className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-xl hover:bg-gray-300 transition"
              >
                Go Home
              </Link>
            </div>

          
          </div>
        </div>
    )}
    return this.props.children
  }
}

