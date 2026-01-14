# y-validate 3.0 🚀

**y-validate** is a lightweight, dependency-free (Vanilla JS) library for client-side form validation. It supports standard HTML forms as well as WordPress Contact Form 7 integration.

## 🔗 Live Demo
Check out the live demo here:
**[https://test.dooble.io/y-validate/demo](https://test.dooble.io/y-validate/demo)**

---

## 📦 Installation

Simply include the script in your HTML file (preferably in the footer or head).


<table cellpadding="10">
	<tr>
				<td style="border-bottom:1px solid #ccc;">
					&#60;script src="https://cdn.jsdelivr.net/gh/yuvalAshkenaz/y-validate/y-validate.js<span style="color:blue;">?lang=he</span>"&#62;&#60;/script&#62;
				</td>
				<td style="border-bottom:1px solid #ccc;">add <b>lang=he</b> for Hebrew messages</td>
			</tr>
			<tr>
				<td style="border-bottom:1px solid #ccc;">y_add_error_msg( field, 'The message' );</td>
				<td style="border-bottom:1px solid #ccc;">Add a message after the field</td>
			</tr>
			<tr>
				<td style="border-bottom:1px solid #ccc;">y_remove_error_msg( field );</td>
				<td style="border-bottom:1px solid #ccc;">Remove the message after the field</td>
			</tr>
			<tr>
				<td style="border-bottom:1px solid #ccc;">y_blur_after_validate( field ){ //Do your thing };</td>
				<td style="border-bottom:1px solid #ccc;">You can add your own function after "blur" validation</td>
			</tr>
	<tr>
				<td style="border-bottom:1px solid #ccc;">y_validate_form( form );</td>
				<td style="border-bottom:1px solid #ccc;">
					Check required fields<br/>
					Returning true or false<br/>
					form can be div also or other element
				</td>
			</tr>
			<tr>
				<td style="border-bottom:1px solid #ccc;">class="required"</td>
				<td style="border-bottom:1px solid #ccc;">Required field</td>
			</tr>
			<tr>
				<td style="border-bottom:1px solid #ccc;">class="wpcf7-validates-as-required"</td>
				<td style="border-bottom:1px solid #ccc;">Required field - This class is from Wordpress <b>Contact Forms 7</b></td>
			</tr>
			<tr>
				<td style="border-bottom:1px solid #ccc;">class="email"</td>
				<td style="border-bottom:1px solid #ccc;">Email validation</td>
			</tr>
			<tr>
				<td style="border-bottom:1px solid #ccc;">type="email"</td>
				<td style="border-bottom:1px solid #ccc;">Email validation</td>
			</tr>
			<tr>
				<td style="border-bottom:1px solid #ccc;">class="cell"</td>
				<td style="border-bottom:1px solid #ccc;">Cellphone validation</td>
			</tr>
			<tr>
				<td style="border-bottom:1px solid #ccc;">class="password-confirm"</td>
				<td style="border-bottom:1px solid #ccc;">Confirm two passwords fields. You need to add this class to both fields</td>
			</tr>
		</table>

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
