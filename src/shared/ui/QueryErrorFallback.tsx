import Button from './Button';

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return '알 수 없는 오류가 발생했어요.';
}

function QueryErrorFallback({
  title = '문제가 발생했어요',
  error,
  onRetry,
}: {
  title?: string;
  error: unknown;
  onRetry: () => void;
}) {
  const message = getErrorMessage(error);

  return (
    <section
      className="flex flex-1 items-center justify-center min-h-[40vh] w-full p-10"
      aria-label="오류"
    >
      <div className="flex flex-col items-center gap-3">
        <p className="text-center text-gray-900 font-semibold">{title}</p>
        <p className="text-center text-red-500 text-sm" role="alert">
          {message}
        </p>
        <Button type="button" variant="primary" onClick={onRetry}>
          다시 시도
        </Button>
      </div>
    </section>
  );
}

export default QueryErrorFallback;
