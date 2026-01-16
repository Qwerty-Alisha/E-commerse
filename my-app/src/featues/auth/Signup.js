import { useForm } from "react-hook-form"
import { useSelector, useDispatch } from 'react-redux';
import { selectLoggedInUser, createUserAsync } from './authSlice';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
export default function Signup() {
  
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

    return (
      <>
      {user && <Navigate to="/" replace={true}></Navigate>}
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto bg-white sm:w-full sm:max-w-sm">
            <img
              alt="Your Company"
              src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
              className="mx-auto h-10 w-auto"
            />
            <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
              Create a new account
            </h2>
          </div>
  
          <div className="pt-10 pl-10 pr-10 sm:mx-auto bg-white sm:w-full sm:max-w-sm">
            <form action="#" noValidate method="POST" className="space-y-6" onSubmit={handleSubmit((data) => {
              dispatch(
                createUserAsync({ email: data.email, password: data.password , addresses:[], role:'user',
                  //TODO: this role can be directly given on backend
                  })
              );
              console.log(data);
            })}>
              <div>
                <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    {...register("email", { required: "valid email is required" ,pattern: { value : /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi ,message: "email is not valid"}})}
                    type="email"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                </div>
              </div>
  
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                    Password
                  </label>
                </div>
                
                <div className="mt-2">
                  <input
                    id="password"
                    {...register("password", { required: "password is required",pattern: { value : /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                      message: `- at least 8 characters\n
                    - must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number\n
                    - Can contain special characters`}})}
                    type="password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />{errors.password && <p className="text-red-500">{errors.password.message}</p>}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                    Confirm Password
                  </label>
                </div>
                
                <div className="mt-2">
                  <input
                    id="confirmPassword"
                    {...register("confirmPassword", { required: "this field is required", validate: (value, formValues)=> value=== formValues.password || "passwordnot matched"})}
                    type="password"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message }</p>}
                </div>
              </div>
  
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign up
                </button>
              </div>
            </form>
  
            <p className="mt-10 text-center text-sm/6 text-gray-500">
              Already a member?{' '}
              <Link
              to="/login"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Log In
            </Link>
            </p>
          </div>
        </div>
      </>
    )
  }
  