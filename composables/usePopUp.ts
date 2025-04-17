import { reactive } from 'vue';

export function usePopup() {
  const state = reactive({
    isVisible: false,
    text: '',
    status: '',
    subTitle: '',
  });

  function showPopup(
    message: string,
    status: 'complete' | 'confirm' | 'error' | 'warn',
    subTitle?: string
  ) {
    state.text = message;
    state.status = status;
    state.isVisible = true;
    state.subTitle = subTitle;
  }

  function hidePopup() {
    state.isVisible = false;
  }

  return { state, showPopup, hidePopup };
}
