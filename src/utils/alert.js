// src/utils/alert.js
import Swal from 'sweetalert2';

export const showAlert = ({ title = '', text = '', icon = 'info' }) => {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonText: '확인',
  });
};
