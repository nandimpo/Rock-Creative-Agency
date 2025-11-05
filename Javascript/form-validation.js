/* =====================================================
   FORM VALIDATION - Real-time feedback with validation states
   ===================================================== */

// Initialize form validation on all contact forms
document.addEventListener('DOMContentLoaded', function() {
    const contactForms = document.querySelectorAll('.contact-form');
    
    contactForms.forEach(form => {
        initializeFormValidation(form);
    });
});

function initializeFormValidation(form) {
    const inputs = form.querySelectorAll('input, textarea');
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Add real-time validation listeners
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => validateField(input));
    });
    
    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        let isFormValid = true;
        
        // Validate all fields
        inputs.forEach(input => {
            if (!validateField(input)) {
                isFormValid = false;
            }
        });
        
        if (isFormValid) {
            showSuccessMessage(form);
            form.reset();
            // Clear validation states after success
            setTimeout(() => {
                inputs.forEach(input => {
                    input.classList.remove('valid', 'invalid');
                });
                hideSuccessMessage(form);
            }, 3000);
        }
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Determine field type and validate accordingly
    if (field.type === 'email' || field.name === 'Email') {
        isValid = validateEmail(value);
    } else if (field.name === 'How can we help?' || field.tagName === 'TEXTAREA') {
        isValid = value.length >= 10;
    } else {
        isValid = value.length > 0;
    }
    
    // Apply styles based on validation
    if (isValid) {
        field.classList.remove('invalid');
        field.classList.add('valid');
    } else if (value.length > 0) {
        // Only show invalid state if user has started typing
        field.classList.remove('valid');
        field.classList.add('invalid');
    } else {
        // Clear both states if empty
        field.classList.remove('valid', 'invalid');
    }
    
    return isValid;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showSuccessMessage(form) {
    // Check if success message already exists
    let successMsg = form.querySelector('.success-message');
    
    if (!successMsg) {
        successMsg = document.createElement('div');
        successMsg.className = 'success-message';
        successMsg.textContent = '✓ Message sent successfully! We\'ll get back to you soon.';
        form.insertBefore(successMsg, form.firstChild);
    }
    
    successMsg.classList.add('show');
}

function hideSuccessMessage(form) {
    const successMsg = form.querySelector('.success-message');
    if (successMsg) {
        successMsg.classList.remove('show');
    }
}

// Export functions for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeFormValidation,
        validateField,
        validateEmail
    };
}