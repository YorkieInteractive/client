import { Formik } from "formik";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { AUTH_SCHEMA } from "@snailycad/schemas";

import useFetch from "lib/useFetch";

import { Error } from "components/form/Error";
import { FormField } from "components/form/FormField";
import { Input, PasswordInput } from "components/form/Input";
import { Loader } from "components/Loader";
import { handleValidate } from "lib/handleValidate";

const INITIAL_VALUES = {
  username: "",
  password: "",
};

export default function Login() {
  const router = useRouter();
  const { state, execute } = useFetch();

  const validate = handleValidate(AUTH_SCHEMA);

  async function onSubmit(values: typeof INITIAL_VALUES) {
    const data = await execute("/auth/login", {
      data: values,
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
    });

    if (data.json?.userId) {
      router.push("/citizen");
    }

    // todo: add react-hot-toast.
  }

  return (
    <>
      <Head>
        <title>Login - SnailyCAD</title>
      </Head>

      <main className="flex justify-center pt-20">
        <Formik validate={validate} onSubmit={onSubmit} initialValues={INITIAL_VALUES}>
          {({ handleSubmit, handleChange, errors, isValid }) => (
            <form className="rounded-lg p-6 w-full max-w-md bg-gray-100" onSubmit={handleSubmit}>
              <h1 className="text-2xl text-gray-800 font-semibold mb-3">Login</h1>

              <FormField fieldId="username" label="username">
                <Input
                  hasError={!!errors.username}
                  id="username"
                  type="text"
                  name="username"
                  onChange={handleChange}
                />
                <Error>{errors.username}</Error>
              </FormField>

              <FormField fieldId="password" label="Password">
                <PasswordInput
                  hasError={!!errors.password}
                  id="password"
                  name="password"
                  onChange={handleChange}
                />
                <Error>{errors.password}</Error>
              </FormField>

              <div className="mt-3">
                <Link href="/auth/register">
                  <a className="underline inline-block mb-3">{"Don't have an account?"} Register</a>
                </Link>

                <button
                  disabled={!isValid || state === "loading"}
                  type="submit"
                  className="w-full p-1.5 px-4 rounded-md text-white bg-gray-800 hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-3"
                >
                  {state === "loading" ? <Loader  /> : null} Login
                </button>
              </div>
            </form>
          )}
        </Formik>
      </main>
    </>
  );
}
