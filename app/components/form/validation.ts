export type ValidationParams = {
  shouldValidate: boolean;
  showErrorMessage: boolean;
  validateOnChange?: boolean;
  onValidate: (wasSuccessful: boolean) => void;
  validate?: (value: string) => string | null;
};
