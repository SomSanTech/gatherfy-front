import { reactive } from 'vue';

export function usePopup() {
  const state = reactive({
    isVisible: false,
    text: '',
    status: '',
  });

  function showPopup(
    message: string,
    status: 'complete' | 'confirm' | 'error'
  ) {
    state.text = message;
    state.status = status;
    state.isVisible = true;
  }

  function hidePopup() {
    state.isVisible = false;
  }

  return { state, showPopup, hidePopup };
}
