export const clerkAppearance = {
  layout: {
    logoImageUrl: '/icons/logo.png',
    socialButtonsVariant: 'iconButton',
    logoPlacement: 'inside',
  },
  variables: {
    colorPrimary: '#0ea5e9',
    colorBackground: '#ffffff',
    colorText: '#1f2937',
    colorInputBackground: '#ffffff',
    colorInputText: '#1f2937',
  },
  elements: {
    formButtonPrimary: 'bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200',
    card: 'shadow-lg rounded-xl border-0',
    headerTitle: 'text-2xl font-bold text-gray-900',
    headerSubtitle: 'text-gray-600',
    socialButtons: 'gap-2',
    socialButton: 'border-gray-300 hover:bg-gray-50',
    formFieldInput: 'input-field',
    footerActionLink: 'text-primary-600 hover:text-primary-700 font-medium',
    formFieldLabel: 'text-gray-700 font-medium',
    identityPreviewEditButton: 'text-primary-600 hover:text-primary-700',
  }
}