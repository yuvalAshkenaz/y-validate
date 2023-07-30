# y-validate
validation

<table cellpadding="10">
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
				<td style="border-bottom:1px solid #ccc;">class="password-confirm"</td>
				<td style="border-bottom:1px solid #ccc;">Confirm two passwords fields. You need to this class to both fields</td>
			</tr>
		</table>
