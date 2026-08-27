import { useRef, useState } from 'react';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Ports Javascript/form-validation.js. `fields` describes each form field so we know
// which validation rule applies: { name, type: 'text' | 'email' | 'textarea', required }.
export function useFormValidation(fields) {
  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map((f) => [f.name, '']))
  );
  const [status, setStatus] = useState(() => Object.fromEntries(fields.map((f) => [f.name, ''])));
  const [success, setSuccess] = useState(false);
  const clearTimer = useRef(null);

  const validateField = (field, value) => {
    const trimmed = value.trim();
    if (!field.required && trimmed.length === 0) return '';
    let isValid;
    if (field.type === 'email') {
      isValid = emailRegex.test(trimmed);
    } else if (field.type === 'textarea') {
      isValid = trimmed.length >= 10;
    } else {
      isValid = trimmed.length > 0;
    }
    if (isValid) return 'valid';
    return trimmed.length > 0 ? 'invalid' : '';
  };

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    const field = fields.find((f) => f.name === name);
    setStatus((prev) => ({ ...prev, [name]: validateField(field, value) }));
  };

  const handleBlur = (name) => {
    const field = fields.find((f) => f.name === name);
    setStatus((prev) => ({ ...prev, [name]: validateField(field, values[name]) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextStatus = {};
    let isFormValid = true;
    fields.forEach((field) => {
      const result = validateField(field, values[field.name]);
      nextStatus[field.name] = result;
      if (field.required ? result !== 'valid' : result === 'invalid') isFormValid = false;
    });
    setStatus(nextStatus);

    if (!isFormValid) return;

    setSuccess(true);
    setValues(Object.fromEntries(fields.map((f) => [f.name, ''])));

    if (clearTimer.current) clearTimeout(clearTimer.current);
    clearTimer.current = setTimeout(() => {
      setStatus(Object.fromEntries(fields.map((f) => [f.name, ''])));
      setSuccess(false);
    }, 3000);
  };

  return { values, status, success, handleChange, handleBlur, handleSubmit };
}
