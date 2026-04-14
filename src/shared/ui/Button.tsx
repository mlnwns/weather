import type { ComponentProps } from 'react';

export type ButtonVariant = 'primary' | 'secondary';

interface ButtonProps extends ComponentProps<'button'> {
  variant?: ButtonVariant;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-blue-600 text-white border border-blue-700 hover:not-disabled:bg-blue-700',
  secondary: 'bg-white text-gray-900 border border-gray-300 hover:not-disabled:bg-gray-100',
};

function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button
      className={[
        'px-4 py-2 rounded-lg text-sm cursor-pointer transition-colors duration-200',
        variantStyles[variant],
        'disabled:bg-gray-300 disabled:text-gray-600 disabled:border-gray-300 disabled:cursor-not-allowed',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
