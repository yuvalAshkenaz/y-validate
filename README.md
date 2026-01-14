# y-validate 3.0 🚀

**y-validate** is a lightweight, dependency-free (Vanilla JS) library for client-side form validation. It supports standard HTML forms as well as WordPress Contact Form 7 integration.

## 🔗 Live Demo
Check out the live demo here:
**[https://test.dooble.io/y-validate/demo](https://test.dooble.io/y-validate/demo)**

---

## 📦 Installation

Simply include the script in your HTML file (preferably in the footer or head).

```html
<script src="https://cdn.jsdelivr.net/gh/yuvalAshkenaz/y-validate/y-validate.js"></script>

Localization (Hebrew Support)
To enable Hebrew error messages, add the ?lang=he parameter to the script URL:
<script src="https://cdn.jsdelivr.net/gh/yuvalAshkenaz/y-validate/y-validate.js?lang=he"></script>

🛠 Usage via HTML ClassesYou can trigger validation rules simply by adding specific classes or attributes to your input fields.Class / AttributeDescriptionclass="required"Marks the field as required. The form will not submit if this field is empty.class="wpcf7-validates-as-required"WordPress CF7 Support: Treats the field as required (automatically handled for Contact Form 7).type="email" or class="email"Validates that the input is a valid Email address format.class="cell"Mobile Phone validation (Checks for valid format, e.g., Israeli mobile numbers).class="password-confirm"Password Matching: Add this class to both password fields (e.g., "Password" and "Confirm Password"). The library ensures they match.

⚙️ JavaScript APIy-validate exposes several functions for manual control and customization.Validation & LogicFunctionDescriptiony_validate_form( form )Manually triggers validation for a specific form (or container).Returns: true (valid) or false (invalid).y_add_error_msg( field, 'Message' )Manually adds a custom error message after a specific field.Example: y_add_error_msg(myInput, 'Username taken');y_remove_error_msg( field )Removes the error message and the error state from a specific field.

Hooks & Callbacks
You can define this function in your code to execute custom logic immediately after a field loses focus (blur) and validation runs.

function y_blur_after_validate( field ) {
    // Example: log the field that was just validated
    console.log('Field validated:', field);
    
    // You can add custom logic here
    if ( field.classList.contains('error') ) {
        console.log('Field has error!');
    }
}

📝 Example
<form id="myForm">
    <input type="text" name="name" class="required" placeholder="Full Name">
    
    <input type="email" name="email" class="required" placeholder="Email Address">
    
    <input type="tel" name="phone" class="cell" placeholder="Mobile Phone">

    <input type="password" name="pass" class="required password-confirm" placeholder="Password">
    <input type="password" name="pass2" class="required password-confirm" placeholder="Confirm Password">

    <button type="submit">Submit</button>
</form>

<script src="y-validate.js"></script>

📄 License
MIT
