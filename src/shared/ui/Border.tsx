type BorderVariant = 'default' | 'inset' | 'spacer';

interface BorderProps {
  variant?: BorderVariant;
  height?: string;
}

function Border({ variant = 'default', height = '32px' }: BorderProps) {
  if (variant === 'spacer') {
    return <div className="w-full bg-gray-200" style={{ height }} />;
  }

  if (variant === 'inset') {
    return (
      <div className="px-6">
        <div className="w-full border-t border-gray-200" />
      </div>
    );
  }

  return <div className="w-full border-t border-gray-200" />;
}

export default Border;
