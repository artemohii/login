import database from "./database.js";
import { loginForm } from "./vars.js";
const { form, fields } = loginForm;

class Validator {
  #form;
  #fields;
  constructor(form, fields) {
    this.#form = form;
    this.#fields = fields;
    this.#validateOnSubmit();
  }

  #validateOnSubmit() {
    this.#form.addEventListener("submit", (e) => {
      e.preventDefault();
      let errorCounter = 0;

      this.#fields.forEach((field) => {
        const input = this.#form.querySelector(`[data-id=${field}]`);
        if (this.#validateField(input) === false) {
          errorCounter++;
        }
      });

      if (this.#validateLoginData() === false) {
        errorCounter++;
      }

      if (errorCounter === 0) {
        localStorage.setItem("auth", "qwertrewq1221");
        this.#form.submit();
      }
    });
  }

  #validateField(field) {
    const value = field.value.trim();
    if (value === "") {
      this.#setFieldStatus(
        field,
        "error",
        `${
          field.closest(".form__group").querySelector("label").textContent
        } can not be blank`
      );
      return false;
    } else if (value.length < 3) {
      this.#setFieldStatus(
        field,
        "error",
        `${
          field.closest(".form__group").querySelector("label").textContent
        } must be more as 2 characters`
      );
      return false;
    }

    if (field.dataset.id === "password") {
      if (value.length < 8) {
        this.#setFieldStatus(
          field,
          "error",
          "Password must be at least 8 characters"
        );
        return false;
      } else {
        this.#setFieldStatus(field, "success", null);
        return true;
      }
    }
    this.#setFieldStatus(field, "success", null);
    return true;
  }

  #validateLoginData() {
    const login = this.#form.querySelector("[data-id='username']").value;
    const password = this.#form.querySelector("[data-id='password']").value;
    let isAuthenticated = false;
    for (const user of database) {
      if (login === user.login && password === user.password) {
        isAuthenticated = true;
        break;
      }
    }
    const formValidateError = this.#form.querySelector(".form__validate-error");
    if (!isAuthenticated) {
      formValidateError.textContent = "Your data is incorrect";
    }
    return isAuthenticated;
  }

  #setFieldStatus(field, status, message) {
    const formError = field
      .closest(".form__group")
      .querySelector(".form__error");

    formError.textContent = message;

    if (status === "error") {
      field.style.border = "1px solid red";
    }

    if (status === "success") {
      field.style.border = "1px solid transparent";
    }
  }
}

const validLogin = new Validator(form, fields);

const passwordInput = document.querySelector("[data-id=password]");
const togglePasswordIcon = document.querySelector("[data-id=togglePassword]");

togglePasswordIcon.addEventListener("click", () => {
  passwordInput.type = passwordInput.type === "password" ? "text" : "password";
  /* if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    
  } else {
    passwordInput.type = 'password';
    
  }
 */
});
// console.log(form);
